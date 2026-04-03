// Re-export vector search functions that already use raw SQL
// These are inherently repository-level operations
export {
  storeEmbedding,
  searchByVector,
  findSimilarProfessions,
  hasEmbeddings,
  distanceToScore,
  type VectorSearchResult,
} from "@/infrastructure/embeddings/vector-search";
