import { DIMENSIONS, type ProfileVector } from "./profile-dimensions";
import { getMatchScore } from "./matching";
import { getEmbeddingProvider } from "@/lib/embeddings/index";
import { searchByVector, hasEmbeddings, distanceToScore } from "@/lib/embeddings/vector-search";

// Dimension labels used for text query generation
const DIMENSION_LABELS: Record<string, string> = {
  manuel: "travail manuel, pratique",
  intellectuel: "travail intellectuel, théorique",
  creatif: "créativité, imagination, design",
  analytique: "analyse, logique, méthode",
  interieur: "travail en intérieur, bureau",
  exterieur: "travail en extérieur, plein air",
  equipe: "travail en équipe, collaboration",
  independant: "travail indépendant, autonomie",
  contactHumain: "contact humain, communication, social",
  technique: "technique, technologie, machines",
  routine: "routine, structure, régularité",
  variete: "variété, changement, polyvalence",
};

export function profileToSearchQuery(profile: ProfileVector): string {
  const ranked = DIMENSIONS.map((d) => ({ dim: d, value: profile[d] || 0 }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (ranked.length === 0) return "";

  // Take top 3 dimensions
  return ranked
    .slice(0, 3)
    .map((d) => DIMENSION_LABELS[d.dim] || d.dim)
    .join(", ");
}

export interface HybridMatchResult {
  professionId: string;
  score: number;
  source: "dimensions" | "semantic" | "both";
}

export async function getHybridMatches(
  playerProfile: ProfileVector,
  professions: { id: string; profile: ProfileVector }[],
  locale: string,
  options?: { limit?: number; semanticWeight?: number }
): Promise<HybridMatchResult[]> {
  const { limit = 10, semanticWeight = 0.3 } = options ?? {};
  const dimensionWeight = 1 - semanticWeight;

  // 1. Dimension-based scores
  const dimensionScores = new Map<string, number>();
  for (const prof of professions) {
    const score = getMatchScore(playerProfile, prof.profile);
    if (score > 0) {
      dimensionScores.set(prof.id, score);
    }
  }

  // 2. Semantic scores (if available)
  const semanticScores = new Map<string, number>();
  const embeddingsAvailable = await hasEmbeddings(locale);

  if (embeddingsAvailable) {
    const query = profileToSearchQuery(playerProfile);
    if (query) {
      try {
        const provider = getEmbeddingProvider();
        const queryVector = await provider.embed(query);
        const semanticResults = await searchByVector(
          queryVector,
          locale,
          limit * 2
        );
        for (const r of semanticResults) {
          semanticScores.set(
            r.professionId,
            distanceToScore(r.distance)
          );
        }
      } catch {
        // Semantic search failed — fall back to dimension-only
      }
    }
  }

  // 3. Merge and blend scores
  const allIds = new Set([
    ...dimensionScores.keys(),
    ...semanticScores.keys(),
  ]);
  const results: HybridMatchResult[] = [];

  for (const id of allIds) {
    const dimScore = dimensionScores.get(id);
    const semScore = semanticScores.get(id);

    let source: HybridMatchResult["source"];
    let blendedScore: number;

    if (dimScore != null && semScore != null) {
      source = "both";
      blendedScore = Math.round(
        dimScore * dimensionWeight + semScore * semanticWeight
      );
    } else if (dimScore != null) {
      source = "dimensions";
      blendedScore = dimScore;
    } else {
      source = "semantic";
      blendedScore = semScore!;
    }

    results.push({ professionId: id, score: blendedScore, source });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
