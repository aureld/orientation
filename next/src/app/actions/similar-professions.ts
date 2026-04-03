"use server";

import { prisma } from "@/lib/db";
import {
  findSimilarProfessions,
  hasEmbeddings,
  distanceToScore,
} from "@/lib/embeddings/vector-search";

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

  const professions = (await prisma.profession.findMany({
    where: { id: { in: similar.map((s) => s.professionId) } },
    select: { id: true, icon: true, type: true },
  })) as { id: string; icon: string; type: string }[];

  const profMap = new Map(professions.map((p) => [p.id, p]));

  return similar.map((s) => {
    const prof = profMap.get(s.professionId);
    return {
      id: s.professionId,
      name: s.name,
      icon: prof?.icon ?? "💼",
      type: prof?.type ?? "CFC",
      score: distanceToScore(s.distance),
    };
  });
}
