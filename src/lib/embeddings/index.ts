import type { EmbeddingProvider, EmbeddingProviderName } from "./types";
import { OllamaProvider } from "./ollama";
import { OpenAIProvider } from "./openai";

export { type EmbeddingProvider, type EmbeddingProviderName } from "./types";

export function getEmbeddingProvider(
  name?: EmbeddingProviderName
): EmbeddingProvider {
  const provider =
    name || (process.env.EMBEDDING_PROVIDER as EmbeddingProviderName) || "ollama";

  switch (provider) {
    case "ollama":
      return new OllamaProvider();
    case "openai":
      return new OpenAIProvider();
    default:
      throw new Error(`Unknown embedding provider: ${provider}`);
  }
}
