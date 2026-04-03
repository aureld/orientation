import { prisma } from "@/infrastructure/db";

const EXPECTED_DIMENSIONS = 1024;

/**
 * Convert cosine distance to an intuitive 0-100 score.
 * Cosine distance for text embeddings rarely reaches 0.0 even for
 * near-identical content — a distance of ~0.3 is already an excellent match.
 * This rescales so that strong matches (distance <= 0.33) reach 100%.
 */
export function distanceToScore(distance: number): number {
  return Math.max(0, Math.min(100, Math.round((1 - distance) * 150)));
}

export interface VectorSearchResult {
  professionId: string;
  name: string;
  distance: number;
}

export async function storeEmbedding(
  translationId: number,
  embedding: number[]
): Promise<void> {
  if (embedding.length !== EXPECTED_DIMENSIONS) {
    throw new Error(
      `Expected ${EXPECTED_DIMENSIONS} dimensions, got ${embedding.length}`
    );
  }
  const vectorStr = `[${embedding.join(",")}]`;
  await prisma.$executeRaw`
    UPDATE "ProfessionTranslation"
    SET embedding = ${vectorStr}::vector
    WHERE id = ${translationId}
  `;
}

export async function searchByVector(
  queryVector: number[],
  locale: string,
  limit = 10
): Promise<VectorSearchResult[]> {
  const vectorStr = `[${queryVector.join(",")}]`;
  return prisma.$queryRaw<VectorSearchResult[]>`
    SELECT "professionId", name,
           embedding <=> ${vectorStr}::vector AS distance
    FROM "ProfessionTranslation"
    WHERE locale = ${locale}
      AND embedding IS NOT NULL
    ORDER BY distance ASC
    LIMIT ${limit}
  `;
}

export async function findSimilarProfessions(
  professionId: string,
  locale: string,
  limit = 5
): Promise<VectorSearchResult[]> {
  return prisma.$queryRaw<VectorSearchResult[]>`
    SELECT pt2."professionId", pt2.name,
           pt1.embedding <=> pt2.embedding AS distance
    FROM "ProfessionTranslation" pt1
    JOIN "ProfessionTranslation" pt2
      ON pt2.locale = pt1.locale
      AND pt2."professionId" != pt1."professionId"
      AND pt2.embedding IS NOT NULL
    WHERE pt1."professionId" = ${professionId}
      AND pt1.locale = ${locale}
      AND pt1.embedding IS NOT NULL
    ORDER BY distance ASC
    LIMIT ${limit}
  `;
}

export async function hasEmbeddings(locale: string): Promise<boolean> {
  const result = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count
    FROM "ProfessionTranslation"
    WHERE locale = ${locale}
      AND embedding IS NOT NULL
  `;
  return result[0].count > BigInt(0);
}
