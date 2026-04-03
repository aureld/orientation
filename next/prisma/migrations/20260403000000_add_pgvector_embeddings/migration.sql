-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to ProfessionTranslation for semantic search
ALTER TABLE "ProfessionTranslation" ADD COLUMN "embedding" vector(1024);
