import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB module
vi.mock("@/lib/db", () => ({
  prisma: {
    professionTranslation: {
      findMany: vi.fn(),
    },
    $executeRaw: vi.fn(),
    $queryRaw: vi.fn(),
  },
}));

// Mock the embedding provider
vi.mock("@/lib/embeddings/index", () => ({
  getEmbeddingProvider: vi.fn(),
}));

import { prisma } from "@/lib/db";
import { getEmbeddingProvider } from "@/lib/embeddings/index";
import { generateAndStoreEmbeddings } from "../embeddings/seed-embeddings";

const mockFindMany = vi.mocked(prisma.professionTranslation.findMany);
const mockExecuteRaw = vi.mocked(prisma.$executeRaw);
const mockQueryRaw = vi.mocked(prisma.$queryRaw);
const mockGetProvider = vi.mocked(getEmbeddingProvider);

function makeMockTranslation(id: number, professionId: string) {
  return {
    id,
    professionId,
    locale: "fr",
    name: `Profession ${professionId}`,
    description: "A test profession",
    activities: ["Activity 1"],
    qualities: ["Quality 1"],
    domainesProfessionnels: "Test domain",
    descriptionFull: null,
    autresInformations: null,
  };
}

const fakeEmbedding = Array.from({ length: 1024 }, () => 0.1);

beforeEach(() => {
  mockFindMany.mockReset();
  mockExecuteRaw.mockReset();
  mockQueryRaw.mockReset();
  mockGetProvider.mockReset();

  // Default: no existing embeddings
  mockQueryRaw.mockResolvedValue([]);

  mockGetProvider.mockReturnValue({
    name: "ollama",
    dimensions: 1024,
    embed: vi.fn().mockResolvedValue(fakeEmbedding),
    embedBatch: vi.fn().mockResolvedValue([fakeEmbedding]),
  });
});

describe("generateAndStoreEmbeddings", () => {
  it("fetches translations and generates embeddings", async () => {
    const translations = [makeMockTranslation(1, "assc")];
    mockFindMany.mockResolvedValueOnce(translations as never);
    mockExecuteRaw.mockResolvedValue(1);

    const result = await generateAndStoreEmbeddings({ locale: "fr" });

    expect(result.embedded).toBe(1);
    expect(mockFindMany).toHaveBeenCalledOnce();
  });

  it("skips translations that already have embeddings", async () => {
    const translations = [
      makeMockTranslation(1, "assc"),
      makeMockTranslation(2, "infirm"),
    ];
    mockFindMany.mockResolvedValueOnce(translations as never);
    // ID 1 already has an embedding
    mockQueryRaw.mockResolvedValueOnce([{ id: 1 }]);
    mockExecuteRaw.mockResolvedValue(1);

    const result = await generateAndStoreEmbeddings({ locale: "fr" });

    expect(result.embedded).toBe(1);
    expect(result.skipped).toBe(1);
  });

  it("re-embeds all when force is true", async () => {
    const translations = [
      makeMockTranslation(1, "assc"),
      makeMockTranslation(2, "infirm"),
    ];
    mockFindMany.mockResolvedValueOnce(translations as never);
    mockExecuteRaw.mockResolvedValue(1);

    const provider = mockGetProvider();
    (provider.embedBatch as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      fakeEmbedding,
      fakeEmbedding,
    ]);

    const result = await generateAndStoreEmbeddings({
      locale: "fr",
      force: true,
    });

    expect(result.embedded).toBe(2);
    expect(result.skipped).toBe(0);
  });

  it("batches embedBatch calls to respect batchSize", async () => {
    const translations = Array.from({ length: 5 }, (_, i) =>
      makeMockTranslation(i + 1, `prof-${i}`)
    );
    mockFindMany.mockResolvedValueOnce(translations as never);
    mockExecuteRaw.mockResolvedValue(1);

    const provider = mockGetProvider();
    (provider.embedBatch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce([fakeEmbedding, fakeEmbedding])
      .mockResolvedValueOnce([fakeEmbedding, fakeEmbedding])
      .mockResolvedValueOnce([fakeEmbedding]);

    const result = await generateAndStoreEmbeddings({
      locale: "fr",
      batchSize: 2,
    });

    expect(result.embedded).toBe(5);
    expect(provider.embedBatch).toHaveBeenCalledTimes(3);
  });

  it("returns zero counts when no translations exist", async () => {
    mockFindMany.mockResolvedValueOnce([] as never);

    const result = await generateAndStoreEmbeddings({ locale: "fr" });

    expect(result.embedded).toBe(0);
    expect(result.skipped).toBe(0);
  });
});
