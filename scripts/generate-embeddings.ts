/**
 * Standalone script to generate embeddings for all profession translations.
 * Does NOT require a full re-seed — only generates/updates embeddings.
 *
 * Usage:
 *   npx tsx scripts/generate-embeddings.ts
 *   npx tsx scripts/generate-embeddings.ts --force        # re-embed all
 *   npx tsx scripts/generate-embeddings.ts --locale de    # specific locale
 *   npx tsx scripts/generate-embeddings.ts --provider openai
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { composeEmbeddingText } from "../src/lib/embeddings/compose-text.js";
import { getEmbeddingProvider } from "../src/lib/embeddings/index.js";
import type { EmbeddingProviderName } from "../src/lib/embeddings/types.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Parse CLI args
const args = process.argv.slice(2);
const force = args.includes("--force");
const localeIdx = args.indexOf("--locale");
const locale = localeIdx !== -1 ? args[localeIdx + 1] : "fr";
const providerIdx = args.indexOf("--provider");
const providerName = providerIdx !== -1 ? args[providerIdx + 1] as EmbeddingProviderName : undefined;

async function main() {
  const provider = getEmbeddingProvider(providerName);
  console.log(`Using embedding provider: ${provider.name} (${provider.dimensions} dims)`);
  console.log(`Locale: ${locale}, Force: ${force}`);

  // Fetch translations — embedding column is Unsupported, so use raw SQL to check which have embeddings
  const translations = await prisma.professionTranslation.findMany({
    where: { locale },
    select: {
      id: true,
      professionId: true,
      name: true,
      description: true,
      activities: true,
      qualities: true,
      domainesProfessionnels: true,
      descriptionFull: true,
      autresInformations: true,
    },
  });

  // Get IDs that already have embeddings (via raw SQL since Prisma can't select Unsupported columns)
  const existingIds = force
    ? new Set<number>()
    : new Set(
        (await prisma.$queryRaw<{ id: number }[]>`
          SELECT id FROM "ProfessionTranslation"
          WHERE locale = ${locale} AND embedding IS NOT NULL
        `).map((r) => r.id)
      );

  const toEmbed = translations.filter((t) => !existingIds.has(t.id));

  console.log(`Found ${translations.length} translations, ${toEmbed.length} to embed (${existingIds.size} skipped)`);

  if (toEmbed.length === 0) {
    console.log("Nothing to embed.");
    return;
  }

  const batchSize = 50;
  let embedded = 0;

  for (let i = 0; i < toEmbed.length; i += batchSize) {
    const batch = toEmbed.slice(i, i + batchSize);
    const texts = batch.map((t) => composeEmbeddingText(t));

    console.log(`  Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toEmbed.length / batchSize)} (${batch.length} items)...`);
    const embeddings = await provider.embedBatch(texts);

    for (let j = 0; j < batch.length; j++) {
      const vectorStr = `[${embeddings[j].join(",")}]`;
      await prisma.$executeRaw`
        UPDATE "ProfessionTranslation"
        SET embedding = ${vectorStr}::vector
        WHERE id = ${batch[j].id}
      `;
      embedded++;
    }
  }

  console.log(`Done! ${embedded} embeddings generated.`);
}

main()
  .catch((e) => {
    console.error("Embedding generation failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
