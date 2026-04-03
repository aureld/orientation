/**
 * Import scraped orientation.ch profession data into the database.
 *
 * Usage:
 *   npx tsx scripts/import-professions.ts                          # import FR data
 *   npx tsx scripts/import-professions.ts --file output/professions-cfc-de.json --locale de
 *
 * Matching strategy (in order):
 * 1. Match by swissdoc (stable cross-locale key) on existing Profession records
 * 2. Match by orientation.ch ID extracted from existing urlOrientation field
 * 3. Match by generated slug (e.g., "informaticien")
 * 4. If no match → create new Profession
 *
 * For existing professions (from seed), only orientation.ch content fields are added.
 * Hand-curated game data (description, activities, qualities, profile, sector) is preserved.
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface ScrapedProfession {
  name: string;
  url: string;
  orientationId: string;
  domainesProfessionnels: string;
  niveauxDeFormation: string;
  swissdoc: string;
  miseAJour: string;
  description: string;
  formation: string;
  perspectivesProfessionnelles: string;
  autresInformations: string;
  adressesUtiles: string;
}

/**
 * Generate a URL-safe slug from a profession name.
 * "Informaticien CFC / Informaticienne CFC" → "informaticien"
 * "Agent de propreté CFC / Agente de propreté CFC" → "agent-de-proprete"
 */
function slugify(name: string): string {
  let slug = name.split(/\s+CFC/)[0].trim();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug;
}

/**
 * Extract duration in years from the formation text.
 */
function extractDuration(formation: string): number {
  const dureeSection = formation.split("### Dur")[1] || formation;
  const match = dureeSection.match(/(\d)\s*ans?/);
  return match ? parseInt(match[1], 10) : 3;
}

function swissdocMainGroup(swissdoc: string): string {
  const bloc2 = swissdoc.split(".")[1];
  return bloc2[0] + "00";
}

/**
 * Extract orientation.ch ID from a URL like
 * "https://www.orientation.ch/dyn/show/1900?id=947" → "947"
 */
function extractOrientationId(url: string): string | null {
  const match = url.match(/[?&]id=(\d+)/);
  return match ? match[1] : null;
}

async function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf("--file");
  const localeIdx = args.indexOf("--locale");
  const filePath = fileIdx !== -1 ? args[fileIdx + 1] : "output/professions-cfc.json";
  const locale = localeIdx !== -1 ? args[localeIdx + 1] : "fr";

  const fullPath = join(__dirname, filePath);
  console.log(`Reading ${fullPath} (locale: ${locale})...`);

  const data: ScrapedProfession[] = JSON.parse(readFileSync(fullPath, "utf-8"));
  console.log(`Found ${data.length} professions to import.\n`);

  // Pre-load all existing professions for matching
  const allProfessions = await prisma.profession.findMany({
    select: { id: true, swissdoc: true, urlOrientation: true },
  });

  // Build lookup maps
  const bySwissdoc = new Map(
    allProfessions.filter((p) => p.swissdoc).map((p) => [p.swissdoc!, p.id])
  );
  const byOrientationId = new Map(
    allProfessions
      .filter((p) => p.urlOrientation)
      .map((p) => [extractOrientationId(p.urlOrientation!), p.id])
      .filter(([k]) => k !== null) as [string, string][]
  );
  const byId = new Set(allProfessions.map((p) => p.id));

  console.log(
    `Existing professions: ${allProfessions.length} (${bySwissdoc.size} with swissdoc, ${byOrientationId.size} with orientationId)\n`
  );

  let created = 0;
  let updated = 0;
  let translationsUpserted = 0;

  for (const scraped of data) {
    const slug = slugify(scraped.name);
    const duration = extractDuration(scraped.formation);

    // Try to find existing profession using multiple strategies
    let professionId: string | null = null;
    let matchType = "";

    // Strategy 1: match by swissdoc
    if (bySwissdoc.has(scraped.swissdoc)) {
      professionId = bySwissdoc.get(scraped.swissdoc)!;
      matchType = "swissdoc";
    }
    // Strategy 2: match by orientation.ch ID from existing urlOrientation
    else if (byOrientationId.has(scraped.orientationId)) {
      professionId = byOrientationId.get(scraped.orientationId)!;
      matchType = "orientationId";
    }
    // Strategy 3: match by slug
    else if (byId.has(slug)) {
      professionId = slug;
      matchType = "slug";
    }

    if (professionId) {
      // Update existing profession: add swissdoc + group if missing
      await prisma.profession.update({
        where: { id: professionId },
        data: { swissdoc: scraped.swissdoc, swissdocGroup: swissdocMainGroup(scraped.swissdoc) },
      });
      updated++;
      process.stdout.write(`  ~ ${professionId} (matched by ${matchType})\n`);
    } else {
      // Create new profession
      await prisma.profession.create({
        data: {
          id: slug,
          type: "CFC",
          duration,
          swissdoc: scraped.swissdoc,
          swissdocGroup: swissdocMainGroup(scraped.swissdoc),
          urlOrientation: scraped.url,
        },
      });
      professionId = slug;
      created++;
      // Update in-memory maps for subsequent iterations
      bySwissdoc.set(scraped.swissdoc, slug);
      byId.add(slug);
      process.stdout.write(`  + ${slug}\n`);
    }

    // Upsert translation — preserve hand-curated fields if they exist
    const existingTranslation = await prisma.professionTranslation.findUnique({
      where: { professionId_locale: { professionId, locale } },
    });

    const orientationFields = {
      orientationUrl: scraped.url,
      orientationId: scraped.orientationId,
      domainesProfessionnels: scraped.domainesProfessionnels,
      descriptionFull: scraped.description,
      formation: scraped.formation,
      perspectivesProfessionnelles: scraped.perspectivesProfessionnelles,
      autresInformations: scraped.autresInformations,
      adressesUtiles: scraped.adressesUtiles,
    };

    if (existingTranslation) {
      // Update only orientation.ch fields, keep hand-curated data intact
      await prisma.professionTranslation.update({
        where: { id: existingTranslation.id },
        data: orientationFields,
      });
    } else {
      await prisma.professionTranslation.create({
        data: {
          professionId,
          locale,
          name: scraped.name,
          description: "",
          activities: [],
          qualities: [],
          ...orientationFields,
        },
      });
    }
    translationsUpserted++;
  }

  console.log(`\nDone!`);
  console.log(`  Professions created: ${created}`);
  console.log(`  Professions updated (matched): ${updated}`);
  console.log(`  Translations upserted: ${translationsUpserted}`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
