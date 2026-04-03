import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { EmbeddingProvider } from "../embeddings/types";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("OllamaProvider", () => {
  let provider: EmbeddingProvider;

  beforeEach(async () => {
    const { OllamaProvider } = await import("../embeddings/ollama");
    provider = new OllamaProvider();
  });

  it("has name 'ollama' and 1024 dimensions", () => {
    expect(provider.name).toBe("ollama");
    expect(provider.dimensions).toBe(1024);
  });

  it("embed() calls the Ollama /api/embed endpoint with bge-m3 model", async () => {
    const fakeEmbedding = Array.from({ length: 1024 }, (_, i) => i * 0.001);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ embeddings: [fakeEmbedding] }),
    });

    const result = await provider.embed("test text");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:11434/api/embed");
    expect(JSON.parse(opts.body)).toEqual({
      model: "bge-m3",
      input: ["test text"],
    });
    expect(result).toHaveLength(1024);
  });

  it("embed() uses custom OLLAMA_URL when set", async () => {
    vi.stubEnv("OLLAMA_URL", "http://custom:1234");
    const { OllamaProvider } = await import("../embeddings/ollama");
    const customProvider = new OllamaProvider();

    const fakeEmbedding = Array.from({ length: 1024 }, () => 0.1);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ embeddings: [fakeEmbedding] }),
    });

    await customProvider.embed("test");
    expect(mockFetch.mock.calls[0][0]).toBe("http://custom:1234/api/embed");
  });

  it("embedBatch() sends all texts in one API call", async () => {
    const fakeEmbeddings = [
      Array.from({ length: 1024 }, () => 0.1),
      Array.from({ length: 1024 }, () => 0.2),
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ embeddings: fakeEmbeddings }),
    });

    const result = await provider.embedBatch(["text 1", "text 2"]);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(1024);
    expect(result[1]).toHaveLength(1024);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input).toEqual(["text 1", "text 2"]);
  });

  it("throws on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(provider.embed("test")).rejects.toThrow(/Ollama.*500/);
  });
});

describe("OpenAIProvider", () => {
  let provider: EmbeddingProvider;

  beforeEach(async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test-key");
    const { OpenAIProvider } = await import("../embeddings/openai");
    provider = new OpenAIProvider();
  });

  it("has name 'openai' and 1536 dimensions", () => {
    expect(provider.name).toBe("openai");
    expect(provider.dimensions).toBe(1536);
  });

  it("embed() calls the OpenAI embeddings endpoint", async () => {
    const fakeEmbedding = Array.from({ length: 1536 }, (_, i) => i * 0.001);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ embedding: fakeEmbedding }],
      }),
    });

    const result = await provider.embed("test text");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/embeddings");
    const body = JSON.parse(opts.body);
    expect(body.model).toBe("text-embedding-3-small");
    expect(body.input).toEqual(["test text"]);
    expect(opts.headers["Authorization"]).toBe("Bearer sk-test-key");
    expect(result).toHaveLength(1536);
  });

  it("embedBatch() sends all texts in one API call", async () => {
    const fakeEmbeddings = [
      Array.from({ length: 1536 }, () => 0.1),
      Array.from({ length: 1536 }, () => 0.2),
      Array.from({ length: 1536 }, () => 0.3),
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: fakeEmbeddings.map((embedding, i) => ({ embedding, index: i })),
      }),
    });

    const result = await provider.embedBatch(["a", "b", "c"]);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(1536);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input).toEqual(["a", "b", "c"]);
  });

  it("throws when OPENAI_API_KEY is not set", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const { OpenAIProvider } = await import("../embeddings/openai");
    const noKeyProvider = new OpenAIProvider();

    await expect(noKeyProvider.embed("test")).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it("throws on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(provider.embed("test")).rejects.toThrow(/OpenAI.*401/);
  });
});

describe("getEmbeddingProvider", () => {
  it("defaults to ollama when no env var is set", async () => {
    vi.stubEnv("EMBEDDING_PROVIDER", "");
    const { getEmbeddingProvider } = await import("../embeddings/index");
    const provider = getEmbeddingProvider();
    expect(provider.name).toBe("ollama");
  });

  it("returns ollama provider when explicitly set", async () => {
    const { getEmbeddingProvider } = await import("../embeddings/index");
    const provider = getEmbeddingProvider("ollama");
    expect(provider.name).toBe("ollama");
    expect(provider.dimensions).toBe(1024);
  });

  it("returns openai provider when explicitly set", async () => {
    const { getEmbeddingProvider } = await import("../embeddings/index");
    const provider = getEmbeddingProvider("openai");
    expect(provider.name).toBe("openai");
    expect(provider.dimensions).toBe(1536);
  });

  it("reads EMBEDDING_PROVIDER env var", async () => {
    vi.stubEnv("EMBEDDING_PROVIDER", "openai");
    const { getEmbeddingProvider } = await import("../embeddings/index");
    const provider = getEmbeddingProvider();
    expect(provider.name).toBe("openai");
  });

  it("throws for unknown provider", async () => {
    const { getEmbeddingProvider } = await import("../embeddings/index");
    expect(() => getEmbeddingProvider("unknown" as never)).toThrow(
      /Unknown embedding provider/
    );
  });
});
