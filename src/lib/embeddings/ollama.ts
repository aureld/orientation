import type { EmbeddingProvider } from "./types";

export class OllamaProvider implements EmbeddingProvider {
  readonly name = "ollama";
  readonly dimensions = 1024;
  private readonly baseUrl: string;
  private readonly model = "bge-m3";

  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  }

  async embed(text: string): Promise<number[]> {
    const [result] = await this.embedBatch([text]);
    return result;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.model, input: texts }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding failed (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    return data.embeddings;
  }
}
