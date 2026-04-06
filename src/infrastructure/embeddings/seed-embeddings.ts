import { prisma } from "@/infrastructure/db";
import { getEmbeddingProvider } from "@/infrastructure/embeddings";
import { composeEmbeddingText } from "./compose-text";
import { toVectorLiteral } from "./vector-search";
import type { EmbeddableTranslation } from "./compose-text";
import type { EmbeddingProviderName } from "./types";

interface SeedOptions {
  provider?: EmbeddingProviderName;
  locale?: string;
  force?: boolean;
  batchSize?: number;
}

interface SeedResult {
  embedded: number;
  skipped: number;
}

interface TranslationRow extends EmbeddableTranslation {
  id: number;
  professionId: string;
}

export async function generateAndStoreEmbeddings(
  options: SeedOptions = {}
): Promise<SeedResult> {
  const { provider: providerName, locale = "fr", force = false, batchSize = 50 } = options;
  const provider = getEmbeddingProvider(providerName);

  const translations: TranslationRow[] = await prisma.professionTranslation.findMany({
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
  }) as unknown as TranslationRow[];

  // Check which translations already have embeddings (via raw SQL — Prisma can't select Unsupported columns)
  const existingIds = force
    ? new Set<number>()
    : new Set(
        (await prisma.$queryRaw<{ id: number }[]>`
          SELECT id FROM "ProfessionTranslation"
          WHERE locale = ${locale} AND embedding IS NOT NULL
        `).map((r: { id: number }) => r.id)
      );

  const toEmbed = translations.filter((t) => !existingIds.has(t.id));
  const skipped = existingIds.size;

  if (toEmbed.length === 0) {
    return { embedded: 0, skipped };
  }

  let embedded = 0;

  // Process in batches
  for (let i = 0; i < toEmbed.length; i += batchSize) {
    const batch = toEmbed.slice(i, i + batchSize);
    const texts = batch.map((t) => composeEmbeddingText(t));
    const embeddings = await provider.embedBatch(texts);

    for (let j = 0; j < batch.length; j++) {
      const vectorStr = toVectorLiteral(embeddings[j]);
      await prisma.$executeRaw`
        UPDATE "ProfessionTranslation"
        SET embedding = ${vectorStr}::vector
        WHERE id = ${batch[j].id}
      `;
      embedded++;
    }
  }

  return { embedded, skipped };
}
