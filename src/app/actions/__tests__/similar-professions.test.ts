import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    $queryRaw: vi.fn(),
    profession: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/embeddings/vector-search", async () => {
  const actual = await vi.importActual("@/lib/embeddings/vector-search");
  return {
    ...actual,
    findSimilarProfessions: vi.fn(),
    hasEmbeddings: vi.fn(),
  };
});

import { getSimilarProfessions } from "../similar-professions";
import {
  findSimilarProfessions,
  hasEmbeddings,
} from "@/lib/embeddings/vector-search";
import { prisma } from "@/lib/db";

const mockFindSimilar = vi.mocked(findSimilarProfessions);
const mockHasEmbeddings = vi.mocked(hasEmbeddings);
const mockFindMany = vi.mocked(prisma.profession.findMany);

beforeEach(() => {
  mockFindSimilar.mockReset();
  mockHasEmbeddings.mockReset();
  mockFindMany.mockReset();
  mockHasEmbeddings.mockResolvedValue(true);
});

describe("getSimilarProfessions", () => {
  it("returns similar professions with scores", async () => {
    mockFindSimilar.mockResolvedValueOnce([
      { professionId: "infirm", name: "Infirmier/ère", distance: 0.15 },
      { professionId: "pharma", name: "Pharmacien/ne", distance: 0.25 },
    ]);
    mockFindMany.mockResolvedValueOnce([
      { id: "infirm", icon: "🏥", type: "CFC" },
      { id: "pharma", icon: "💊", type: "CFC" },
    ] as never);

    const results = await getSimilarProfessions("assc", "fr");

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      id: "infirm",
      name: "Infirmier/ère",
      icon: "🏥",
      type: "CFC",
      score: 100, // distanceToScore(0.15) = min(100, (1-0.15)*150) = 100
    });
  });

  it("returns at most limit results", async () => {
    mockFindSimilar.mockResolvedValueOnce([
      { professionId: "a", name: "A", distance: 0.1 },
      { professionId: "b", name: "B", distance: 0.2 },
      { professionId: "c", name: "C", distance: 0.3 },
    ]);
    mockFindMany.mockResolvedValueOnce([
      { id: "a", icon: "💼", type: "CFC" },
      { id: "b", icon: "💼", type: "CFC" },
      { id: "c", icon: "💼", type: "CFC" },
    ] as never);

    const results = await getSimilarProfessions("assc", "fr", 3);

    expect(mockFindSimilar).toHaveBeenCalledWith("assc", "fr", 3);
    expect(results).toHaveLength(3);
  });

  it("defaults limit to 5", async () => {
    mockFindSimilar.mockResolvedValueOnce([]);
    mockFindMany.mockResolvedValueOnce([] as never);

    await getSimilarProfessions("assc", "fr");

    expect(mockFindSimilar).toHaveBeenCalledWith("assc", "fr", 5);
  });

  it("returns empty array when no embeddings exist", async () => {
    mockHasEmbeddings.mockResolvedValueOnce(false);

    const results = await getSimilarProfessions("assc", "fr");
    expect(results).toEqual([]);
  });

  it("returns empty array when findSimilarProfessions returns nothing", async () => {
    mockFindSimilar.mockResolvedValueOnce([]);
    mockFindMany.mockResolvedValueOnce([] as never);

    const results = await getSimilarProfessions("nonexistent", "fr");
    expect(results).toEqual([]);
  });
});
