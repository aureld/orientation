"use server";

import { findProfessionsByIds } from "@/repositories/profession-repository";
import {
  findSimilarProfessions,
  hasEmbeddings,
  distanceToScore,
} from "@/repositories/embedding-repository";

export interface SimilarProfessionResult {
  id: string;
  name: string;
  icon: string;
  type: string;
  score: number;
}

export async function getSimilarProfessions(
  professionId: string,
  locale: string,
  limit = 5
): Promise<SimilarProfessionResult[]> {
  const available = await hasEmbeddings(locale);
  if (!available) return [];

  const similar = await findSimilarProfessions(professionId, locale, limit);
  if (similar.length === 0) return [];

  const professions = await findProfessionsByIds(similar.map((s) => s.professionId));
  const profMap = new Map(professions.map((p) => [p.id, p]));

  return similar.map((s) => {
    const prof = profMap.get(s.professionId);
    return {
      id: s.professionId,
      name: s.name,
      icon: prof?.icon ?? "\u{1F4BC}",
      type: prof?.type ?? "CFC",
      score: distanceToScore(s.distance),
    };
  });
}
