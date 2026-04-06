import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/infrastructure/db", () => ({
  prisma: {
    $executeRaw: vi.fn(),
    $queryRaw: vi.fn(),
  },
}));

import { prisma } from "@/infrastructure/db";
import {
  storeEmbedding,
  searchByVector,
  findSimilarProfessions,
  hasEmbeddings,
  distanceToScore,
  toVectorLiteral,
} from "@/infrastructure/embeddings/vector-search";

const mockExecuteRaw = vi.mocked(prisma.$executeRaw);
const mockQueryRaw = vi.mocked(prisma.$queryRaw);

beforeEach(() => {
  mockExecuteRaw.mockReset();
  mockQueryRaw.mockReset();
});

describe("storeEmbedding", () => {
  it("executes an UPDATE query with the vector", async () => {
    mockExecuteRaw.mockResolvedValueOnce(1);

    const embedding = Array.from({ length: 1024 }, (_, i) => i * 0.001);
    await storeEmbedding(42, embedding);

    expect(mockExecuteRaw).toHaveBeenCalledOnce();
  });

  it("throws if vector length does not match expected dimensions", async () => {
    const shortEmbedding = [0.1, 0.2, 0.3];
    await expect(storeEmbedding(42, shortEmbedding)).rejects.toThrow(
      /dimensions/
    );
  });
});

describe("searchByVector", () => {
  it("returns professions ordered by cosine distance", async () => {
    const mockResults = [
      { professionId: "infirm", name: "Infirmier/ère", distance: 0.1 },
      { professionId: "assc", name: "ASSC", distance: 0.3 },
    ];
    mockQueryRaw.mockResolvedValueOnce(mockResults);

    const queryVector = Array.from({ length: 1024 }, () => 0.1);
    const results = await searchByVector(queryVector, "fr", 10);

    expect(results).toEqual(mockResults);
    expect(mockQueryRaw).toHaveBeenCalledOnce();
  });

  it("defaults limit to 10", async () => {
    mockQueryRaw.mockResolvedValueOnce([]);
    const queryVector = Array.from({ length: 1024 }, () => 0.1);
    await searchByVector(queryVector, "fr");
    expect(mockQueryRaw).toHaveBeenCalledOnce();
  });

  it("returns empty array when no embeddings exist", async () => {
    mockQueryRaw.mockResolvedValueOnce([]);
    const queryVector = Array.from({ length: 1024 }, () => 0.1);
    const results = await searchByVector(queryVector, "fr");
    expect(results).toEqual([]);
  });
});

describe("findSimilarProfessions", () => {
  it("returns similar professions excluding the source", async () => {
    const mockResults = [
      { professionId: "infirm", name: "Infirmier/ère", distance: 0.15 },
      { professionId: "pharma", name: "Pharmacien/ne", distance: 0.25 },
    ];
    mockQueryRaw.mockResolvedValueOnce(mockResults);

    const results = await findSimilarProfessions("assc", "fr", 5);

    expect(results).toEqual(mockResults);
    expect(results.every((r) => r.professionId !== "assc")).toBe(true);
    expect(mockQueryRaw).toHaveBeenCalledOnce();
  });

  it("defaults limit to 5", async () => {
    mockQueryRaw.mockResolvedValueOnce([]);
    await findSimilarProfessions("assc", "fr");
    expect(mockQueryRaw).toHaveBeenCalledOnce();
  });

  it("returns empty array when profession has no embedding", async () => {
    mockQueryRaw.mockResolvedValueOnce([]);
    const results = await findSimilarProfessions("nonexistent", "fr");
    expect(results).toEqual([]);
  });
});

describe("hasEmbeddings", () => {
  it("returns true when embeddings exist for the locale", async () => {
    mockQueryRaw.mockResolvedValueOnce([{ count: BigInt(42) }]);
    expect(await hasEmbeddings("fr")).toBe(true);
  });

  it("returns false when no embeddings exist", async () => {
    mockQueryRaw.mockResolvedValueOnce([{ count: BigInt(0) }]);
    expect(await hasEmbeddings("fr")).toBe(false);
  });
});

describe("distanceToScore", () => {
  it("returns 100 for very small distances (exact/near matches)", () => {
    expect(distanceToScore(0.1)).toBe(100);
    expect(distanceToScore(0.2)).toBe(100);
    expect(distanceToScore(0.3)).toBe(100);
  });

  it("returns high scores for good matches", () => {
    expect(distanceToScore(0.4)).toBe(90);
    expect(distanceToScore(0.5)).toBe(75);
  });

  it("returns 0 for very distant vectors", () => {
    expect(distanceToScore(1.0)).toBe(0);
    expect(distanceToScore(1.5)).toBe(0);
  });

  it("never exceeds 100 or goes below 0", () => {
    expect(distanceToScore(-0.1)).toBe(100);
    expect(distanceToScore(2.0)).toBe(0);
  });
});

describe("toVectorLiteral", () => {
  it("converts a valid number array to a pgvector string", () => {
    expect(toVectorLiteral([0.1, 0.2, -0.3])).toBe("[0.1,0.2,-0.3]");
  });

  it("handles zero and negative values", () => {
    expect(toVectorLiteral([0, -1, 1])).toBe("[0,-1,1]");
  });

  it("rejects NaN values in the embedding", () => {
    expect(() => toVectorLiteral([0.1, NaN, 0.3])).toThrow(
      /non-finite value/
    );
  });

  it("rejects Infinity values in the embedding", () => {
    expect(() => toVectorLiteral([0.1, Infinity, 0.3])).toThrow(
      /non-finite value/
    );
  });

  it("rejects -Infinity values in the embedding", () => {
    expect(() => toVectorLiteral([0.1, -Infinity, 0.3])).toThrow(
      /non-finite value/
    );
  });

  it("rejects non-number values coerced into the array", () => {
    const malicious = [0.1, "0.2; DROP TABLE users" as unknown as number, 0.3];
    expect(() => toVectorLiteral(malicious)).toThrow(/non-finite value/);
  });

  it("works with a valid 1024-dimension embedding", () => {
    const embedding = Array.from({ length: 1024 }, (_, i) => i * 0.001);
    const result = toVectorLiteral(embedding);
    expect(result).toMatch(/^\[[\d.,e+-]+\]$/);
  });
});

describe("storeEmbedding — validation", () => {
  it("rejects embeddings containing NaN", async () => {
    const embedding = Array.from({ length: 1024 }, () => 0.1);
    embedding[512] = NaN;
    await expect(storeEmbedding(42, embedding)).rejects.toThrow(
      /non-finite value/
    );
    expect(mockExecuteRaw).not.toHaveBeenCalled();
  });

  it("rejects embeddings containing non-number values", async () => {
    const embedding = Array.from({ length: 1024 }, () => 0.1);
    (embedding as unknown[])[0] = "malicious";
    await expect(storeEmbedding(42, embedding)).rejects.toThrow(
      /non-finite value/
    );
    expect(mockExecuteRaw).not.toHaveBeenCalled();
  });
});
