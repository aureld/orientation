"use server";

import { getEmbeddingProvider } from "@/infrastructure/embeddings";
import { searchByVector, hasEmbeddings, distanceToScore } from "@/repositories/embedding-repository";

export interface SemanticSearchResult {
  id: string;
  name: string;
  score: number;
}

export async function semanticSearch(
  query: string,
  locale: string,
  limit = 10
): Promise<SemanticSearchResult[]> {
  if (!query.trim()) return [];

  try {
    const available = await hasEmbeddings(locale);
    if (!available) return [];

    const provider = getEmbeddingProvider();
    const queryVector = await provider.embed(query);
    const results = await searchByVector(queryVector, locale, limit);

    return results.map((r) => ({
      id: r.professionId,
      name: r.name,
      score: distanceToScore(r.distance),
    }));
  } catch {
    return [];
  }
}
