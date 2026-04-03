import { describe, it, expect, vi, beforeEach } from "vitest";
import { emptyProfile, type ProfileVector } from "../profile-dimensions";

vi.mock("@/lib/db", () => ({
  prisma: {
    $queryRaw: vi.fn(),
    profession: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/embeddings/index", () => ({
  getEmbeddingProvider: vi.fn(),
}));

vi.mock("@/lib/embeddings/vector-search", () => ({
  searchByVector: vi.fn(),
  hasEmbeddings: vi.fn(),
}));

import { getHybridMatches, profileToSearchQuery } from "../matching-hybrid";
import { getEmbeddingProvider } from "@/lib/embeddings/index";
import { searchByVector, hasEmbeddings } from "@/lib/embeddings/vector-search";

const mockGetProvider = vi.mocked(getEmbeddingProvider);
const mockSearchByVector = vi.mocked(searchByVector);
const mockHasEmbeddings = vi.mocked(hasEmbeddings);

const fakeEmbedding = Array.from({ length: 1024 }, () => 0.1);

function makeProfile(overrides: Partial<ProfileVector>): ProfileVector {
  return { ...emptyProfile(), ...overrides };
}

const professions = [
  {
    id: "p1",
    profile: makeProfile({ manuel: 10, creatif: 2 }),
  },
  {
    id: "p2",
    profile: makeProfile({ intellectuel: 10, analytique: 8 }),
  },
  {
    id: "p3",
    profile: makeProfile({ equipe: 10, contactHumain: 9 }),
  },
];

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
  mockSearchByVector.mockResolvedValue([]);
});

describe("profileToSearchQuery", () => {
  it("converts top dimensions to a descriptive search query", () => {
    const profile = makeProfile({ contactHumain: 8, equipe: 7, manuel: 3 });
    const query = profileToSearchQuery(profile);
    // Uses descriptive labels, not raw dimension keys
    expect(query).toContain("contact humain");
    expect(query).toContain("équipe");
  });

  it("returns empty string for an all-zero profile", () => {
    expect(profileToSearchQuery(emptyProfile())).toBe("");
  });

  it("includes only the top 3 dimensions", () => {
    const profile = makeProfile({
      contactHumain: 10,
      equipe: 9,
      manuel: 8,
      creatif: 1,
    });
    const query = profileToSearchQuery(profile);
    // Top 3: contactHumain, equipe, manuel — NOT creatif (rank 4 with low score)
    expect(query).toContain("contact humain");
    expect(query).toContain("équipe");
    expect(query).toContain("manuel");
    expect(query).not.toContain("créativité");
  });
});

describe("getHybridMatches", () => {
  it("returns dimension-based matches when embeddings are unavailable", async () => {
    mockHasEmbeddings.mockResolvedValueOnce(false);
    const player = makeProfile({ manuel: 9, creatif: 3 });

    const results = await getHybridMatches(player, professions, "fr");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].professionId).toBe("p1");
  });

  it("blends dimension and semantic results when both available", async () => {
    mockSearchByVector.mockResolvedValueOnce([
      { professionId: "p3", name: "P3", distance: 0.1 },
      { professionId: "p2", name: "P2", distance: 0.3 },
    ]);

    const player = makeProfile({ manuel: 9, creatif: 3 });
    const results = await getHybridMatches(player, professions, "fr");

    // Should include results from both systems
    const ids = results.map((r) => r.professionId);
    expect(ids).toContain("p1"); // top dimension match
  });

  it("deduplicates professions appearing in both systems", async () => {
    mockSearchByVector.mockResolvedValueOnce([
      { professionId: "p1", name: "P1", distance: 0.1 },
    ]);

    const player = makeProfile({ manuel: 9, creatif: 3 });
    const results = await getHybridMatches(player, professions, "fr");

    const p1Count = results.filter((r) => r.professionId === "p1").length;
    expect(p1Count).toBe(1);
  });

  it("returns empty array for all-zero profile when no embeddings", async () => {
    mockHasEmbeddings.mockResolvedValueOnce(false);
    const results = await getHybridMatches(emptyProfile(), professions, "fr");
    expect(results).toEqual([]);
  });

  it("respects the limit parameter", async () => {
    const player = makeProfile({ manuel: 5 });
    const results = await getHybridMatches(player, professions, "fr", {
      limit: 2,
    });
    expect(results.length).toBeLessThanOrEqual(2);
  });
});
