import { DIMENSIONS, type ProfileVector } from "@/domain/profile";

function normalize(
  profile: ProfileVector,
  maxScale?: number
): ProfileVector | null {
  let maxVal = 0;
  for (const d of DIMENSIONS) {
    const v = profile[d] || 0;
    if (v > maxVal) maxVal = v;
  }
  if (maxVal === 0) return null;

  const divisor = maxScale ?? maxVal;
  const result = {} as ProfileVector;
  for (const d of DIMENSIONS) {
    result[d] = (profile[d] || 0) / divisor;
  }
  return result;
}

function cosineSimilarity(a: ProfileVector, b: ProfileVector): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const d of DIMENSIONS) {
    const va = a[d] || 0;
    const vb = b[d] || 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function getMatchScore(
  playerProfile: ProfileVector,
  professionProfile: ProfileVector
): number {
  const normalizedPlayer = normalize(playerProfile);
  if (!normalizedPlayer) return 0;
  const normalizedProf = normalize(professionProfile, 10);
  if (!normalizedProf) return 0;
  return Math.round(cosineSimilarity(normalizedPlayer, normalizedProf) * 100);
}

export interface MatchResult {
  professionId: string;
  score: number;
}

export function getTopMatches(
  playerProfile: ProfileVector,
  professions: { id: string; profile: ProfileVector }[],
  n = 5
): MatchResult[] {
  const normalizedPlayer = normalize(playerProfile);
  if (!normalizedPlayer) return [];

  const scores: MatchResult[] = [];
  for (const prof of professions) {
    const normalizedProf = normalize(prof.profile, 10);
    if (!normalizedProf) continue;
    scores.push({
      professionId: prof.id,
      score: Math.round(
        cosineSimilarity(normalizedPlayer, normalizedProf) * 100
      ),
    });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, n);
}
