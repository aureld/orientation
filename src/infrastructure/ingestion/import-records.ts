import { prisma } from "@/infrastructure/db";
import type { ScrapedRecord } from "@/scrapers/types";
import type { OrientationChProfession } from "@/scrapers/orientation-ch/types";

export interface ImportResult {
  created: number;
  updated: number;
}

export function slugify(name: string): string {
  let slug = name.split(/\s+CFC/)[0].trim();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug;
}

export function extractDuration(formation: string): number {
  const dureeSection = formation.split("### Dur")[1] || formation;
  const match = dureeSection.match(/(\d)\s*ans?/);
  return match ? parseInt(match[1], 10) : 3;
}

export function swissdocMainGroup(swissdoc: string): string {
  const bloc2 = swissdoc.split(".")[1];
  return bloc2[0] + "00";
}

export function extractOrientationId(url: string): string | null {
  const match = url.match(/[?&]id=(\d+)/);
  return match ? match[1] : null;
}

export async function importRecords(
  records: ScrapedRecord[],
  locale: string
): Promise<ImportResult> {
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

  let created = 0;
  let updated = 0;

  for (const record of records) {
    const scraped = record.data as unknown as OrientationChProfession;
    const slug = slugify(scraped.name);
    const duration = extractDuration(scraped.formation);

    // Try to find existing profession using multiple strategies
    let professionId: string | null = null;

    // Strategy 1: match by swissdoc
    if (bySwissdoc.has(scraped.swissdoc)) {
      professionId = bySwissdoc.get(scraped.swissdoc)!;
    }
    // Strategy 2: match by orientation.ch ID from existing urlOrientation
    else if (byOrientationId.has(scraped.orientationId)) {
      professionId = byOrientationId.get(scraped.orientationId)!;
    }
    // Strategy 3: match by slug
    else if (byId.has(slug)) {
      professionId = slug;
    }

    if (professionId) {
      await prisma.profession.update({
        where: { id: professionId },
        data: { swissdoc: scraped.swissdoc, swissdocGroup: swissdocMainGroup(scraped.swissdoc) },
      });
      updated++;
    } else {
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
  }

  return { created, updated };
}
