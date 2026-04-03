import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/infrastructure/embeddings", () => ({
  getEmbeddingProvider: vi.fn(),
}));

vi.mock("@/repositories/embedding-repository", () => ({
  searchByVector: vi.fn(),
  hasEmbeddings: vi.fn(),
  distanceToScore: vi.fn((d: number) => Math.max(0, Math.min(100, Math.round((1 - d) * 150)))),
}));

import { semanticSearch } from "../semantic-search";
import { getEmbeddingProvider } from "@/infrastructure/embeddings";
import { searchByVector, hasEmbeddings } from "@/repositories/embedding-repository";

const mockGetProvider = vi.mocked(getEmbeddingProvider);
const mockSearchByVector = vi.mocked(searchByVector);
const mockHasEmbeddings = vi.mocked(hasEmbeddings);

const fakeEmbedding = Array.from({ length: 1024 }, () => 0.1);

beforeEach(() => {
  mockGetProvider.mockReset();
  mockSearchByVector.mockReset();
  mockHasEmbeddings.mockReset();

  mockGetProvider.mockReturnValue({
    name: "ollama",
    dimensions: 1024,
    embed: vi.fn().mockResolvedValue(fakeEmbedding),
    embedBatch: vi.fn(),
  });
  mockHasEmbeddings.mockResolvedValue(true);
});

describe("semanticSearch", () => {
  it("returns matching professions with scores", async () => {
    mockSearchByVector.mockResolvedValueOnce([
      { professionId: "assc", name: "ASSC", distance: 0.1 },
      { professionId: "infirm", name: "Infirmier", distance: 0.3 },
    ]);

    const results = await semanticSearch("soins sant\u00e9", "fr");

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe("assc");
    expect(results[0].name).toBe("ASSC");
    expect(results[0].score).toBe(100); // distanceToScore(0.1) = min(100, (1-0.1)*150) = 100
    expect(results[1].score).toBe(100); // distanceToScore(0.3) = min(100, (1-0.3)*150) = 100
  });

  it("embeds the query text using the configured provider", async () => {
    mockSearchByVector.mockResolvedValueOnce([]);

    await semanticSearch("travailler avec des animaux", "fr");

    const provider = mockGetProvider();
    expect(provider.embed).toHaveBeenCalledWith("travailler avec des animaux");
  });

  it("passes the query vector to searchByVector", async () => {
    mockSearchByVector.mockResolvedValueOnce([]);

    await semanticSearch("test query", "fr", 5);

    expect(mockSearchByVector).toHaveBeenCalledWith(fakeEmbedding, "fr", 5);
  });

  it("returns empty array for empty query", async () => {
    const results = await semanticSearch("", "fr");
    expect(results).toEqual([]);
  });

  it("returns empty array for whitespace-only query", async () => {
    const results = await semanticSearch("   ", "fr");
    expect(results).toEqual([]);
  });

  it("defaults limit to 10", async () => {
    mockSearchByVector.mockResolvedValueOnce([]);
    await semanticSearch("test", "fr");
    expect(mockSearchByVector).toHaveBeenCalledWith(fakeEmbedding, "fr", 10);
  });

  it("returns empty array when no embeddings exist", async () => {
    mockHasEmbeddings.mockResolvedValueOnce(false);
    const results = await semanticSearch("test", "fr");
    expect(results).toEqual([]);
  });

  it("returns empty array on provider error", async () => {
    mockGetProvider.mockReturnValue({
      name: "ollama",
      dimensions: 1024,
      embed: vi.fn().mockRejectedValue(new Error("connection refused")),
      embedBatch: vi.fn(),
    });

    const results = await semanticSearch("test", "fr");
    expect(results).toEqual([]);
  });
});
