import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/repositories/profession-repository", () => ({
  findProfessionsByIds: vi.fn(),
}));

vi.mock("@/repositories/embedding-repository", () => ({
  findSimilarProfessions: vi.fn(),
  hasEmbeddings: vi.fn(),
  distanceToScore: vi.fn((d: number) => Math.max(0, Math.min(100, Math.round((1 - d) * 150)))),
}));

import { getSimilarProfessions } from "../similar-professions";
import {
  findSimilarProfessions,
  hasEmbeddings,
} from "@/repositories/embedding-repository";
import { findProfessionsByIds } from "@/repositories/profession-repository";

const mockFindSimilar = vi.mocked(findSimilarProfessions);
const mockHasEmbeddings = vi.mocked(hasEmbeddings);
const mockFindProfessionsByIds = vi.mocked(findProfessionsByIds);

beforeEach(() => {
  mockFindSimilar.mockReset();
  mockHasEmbeddings.mockReset();
  mockFindProfessionsByIds.mockReset();
  mockHasEmbeddings.mockResolvedValue(true);
});

describe("getSimilarProfessions", () => {
  it("returns similar professions with scores", async () => {
    mockFindSimilar.mockResolvedValueOnce([
      { professionId: "infirm", name: "Infirmier/\u00e8re", distance: 0.15 },
      { professionId: "pharma", name: "Pharmacien/ne", distance: 0.25 },
    ]);
    mockFindProfessionsByIds.mockResolvedValueOnce([
      { id: "infirm", icon: "\u{1F3E5}", type: "CFC" },
      { id: "pharma", icon: "\u{1F48A}", type: "CFC" },
    ] as never);

    const results = await getSimilarProfessions("assc", "fr");

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      id: "infirm",
      name: "Infirmier/\u00e8re",
      icon: "\u{1F3E5}",
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
    mockFindProfessionsByIds.mockResolvedValueOnce([
      { id: "a", icon: "\u{1F4BC}", type: "CFC" },
      { id: "b", icon: "\u{1F4BC}", type: "CFC" },
      { id: "c", icon: "\u{1F4BC}", type: "CFC" },
    ] as never);

    const results = await getSimilarProfessions("assc", "fr", 3);

    expect(mockFindSimilar).toHaveBeenCalledWith("assc", "fr", 3);
    expect(results).toHaveLength(3);
  });

  it("defaults limit to 5", async () => {
    mockFindSimilar.mockResolvedValueOnce([]);

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

    const results = await getSimilarProfessions("nonexistent", "fr");
    expect(results).toEqual([]);
  });
});
