import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────

const mockScrape = vi.fn();

vi.mock("@/scrapers", () => ({
  scraperRegistry: {
    get: vi.fn(),
  },
}));

vi.mock("../import-records", () => ({
  importRecords: vi.fn(),
}));

vi.mock("@/infrastructure/embeddings/seed-embeddings", () => ({
  generateAndStoreEmbeddings: vi.fn(),
}));

vi.mock("@/repositories/ingestion-repository", () => ({
  createIngestionLog: vi.fn(),
  completeIngestionLog: vi.fn(),
  failIngestionLog: vi.fn(),
  findLatestIngestionLog: vi.fn(),
}));

import { runIngestion } from "../run-ingestion";
import { scraperRegistry } from "@/scrapers";
import { importRecords } from "../import-records";
import { generateAndStoreEmbeddings } from "@/infrastructure/embeddings/seed-embeddings";
import {
  createIngestionLog,
  completeIngestionLog,
  failIngestionLog,
  findLatestIngestionLog,
} from "@/repositories/ingestion-repository";

const mockRegistryGet = vi.mocked(scraperRegistry.get);
const mockImportRecords = vi.mocked(importRecords);
const mockEmbeddings = vi.mocked(generateAndStoreEmbeddings);
const mockCreateLog = vi.mocked(createIngestionLog);
const mockCompleteLog = vi.mocked(completeIngestionLog);
const mockFailLog = vi.mocked(failIngestionLog);
const mockFindLatest = vi.mocked(findLatestIngestionLog);

beforeEach(() => {
  vi.clearAllMocks();
  mockFindLatest.mockResolvedValue(null);
});

function setupHappyPath() {
  mockRegistryGet.mockReturnValue({
    sourceId: "orientation-ch",
    supportedLocales: ["fr"],
    scrape: mockScrape,
  });
  mockScrape.mockResolvedValue([{ externalId: "1" }, { externalId: "2" }]);
  mockCreateLog.mockResolvedValue({ id: "log-1" } as never);
  mockImportRecords.mockResolvedValue({ created: 1, updated: 1 });
  mockEmbeddings.mockResolvedValue({ embedded: 2, skipped: 0 });
  mockCompleteLog.mockResolvedValue({} as never);
}

describe("runIngestion", () => {
  it("orchestrates scrape → import → embed and completes log", async () => {
    setupHappyPath();

    const result = await runIngestion({ sourceId: "orientation-ch", locale: "fr" });

    expect(result.status).toBe("completed");
    expect(result.logId).toBe("log-1");
    expect(result.counts).toEqual({
      scraped: 2,
      created: 1,
      updated: 1,
      embedded: 2,
      skipped: 0,
    });

    // Verify call order
    expect(mockCreateLog).toHaveBeenCalledWith("orientation-ch", "fr");
    expect(mockScrape).toHaveBeenCalledWith("fr", undefined);
    expect(mockImportRecords).toHaveBeenCalled();
    expect(mockEmbeddings).toHaveBeenCalledWith({ locale: "fr" });
    expect(mockCompleteLog).toHaveBeenCalledWith("log-1", result.counts);
  });

  it("throws for unknown scraper", async () => {
    mockRegistryGet.mockReturnValue(undefined);

    await expect(
      runIngestion({ sourceId: "unknown", locale: "fr" })
    ).rejects.toThrow("Unknown scraper: unknown");

    expect(mockCreateLog).not.toHaveBeenCalled();
  });

  it("fails log when scrape throws", async () => {
    mockRegistryGet.mockReturnValue({
      sourceId: "orientation-ch",
      supportedLocales: ["fr"],
      scrape: mockScrape,
    });
    mockScrape.mockRejectedValue(new Error("Network error"));
    mockCreateLog.mockResolvedValue({ id: "log-1" } as never);
    mockFailLog.mockResolvedValue({} as never);

    const result = await runIngestion({ sourceId: "orientation-ch", locale: "fr" });

    expect(result.status).toBe("failed");
    expect(result.error).toBe("Network error");
    expect(mockFailLog).toHaveBeenCalledWith("log-1", "Network error");
  });

  it("fails log when import throws", async () => {
    mockRegistryGet.mockReturnValue({
      sourceId: "orientation-ch",
      supportedLocales: ["fr"],
      scrape: mockScrape,
    });
    mockScrape.mockResolvedValue([]);
    mockCreateLog.mockResolvedValue({ id: "log-1" } as never);
    mockImportRecords.mockRejectedValue(new Error("Unique constraint failed"));
    mockFailLog.mockResolvedValue({} as never);

    const result = await runIngestion({ sourceId: "orientation-ch", locale: "fr" });

    expect(result.status).toBe("failed");
    expect(result.error).toBe("Unique constraint failed");
  });

  it("fails log when embedding generation throws", async () => {
    mockRegistryGet.mockReturnValue({
      sourceId: "orientation-ch",
      supportedLocales: ["fr"],
      scrape: mockScrape,
    });
    mockScrape.mockResolvedValue([]);
    mockCreateLog.mockResolvedValue({ id: "log-1" } as never);
    mockImportRecords.mockResolvedValue({ created: 0, updated: 0 });
    mockEmbeddings.mockRejectedValue(new Error("Ollama not running"));
    mockFailLog.mockResolvedValue({} as never);

    const result = await runIngestion({ sourceId: "orientation-ch", locale: "fr" });

    expect(result.status).toBe("failed");
    expect(result.error).toBe("Ollama not running");
  });

  it("skips if ingestion is already running for same source+locale", async () => {
    mockRegistryGet.mockReturnValue({
      sourceId: "orientation-ch",
      supportedLocales: ["fr"],
      scrape: mockScrape,
    });
    mockFindLatest.mockResolvedValue({ id: "existing-log", status: "running" } as never);

    const result = await runIngestion({ sourceId: "orientation-ch", locale: "fr" });

    expect(result.status).toBe("skipped");
    expect(result.logId).toBe("existing-log");
    expect(mockCreateLog).not.toHaveBeenCalled();
    expect(mockScrape).not.toHaveBeenCalled();
  });

  it("passes scrapeOptions through to scraper", async () => {
    setupHappyPath();

    await runIngestion({
      sourceId: "orientation-ch",
      locale: "fr",
      scrapeOptions: { limit: 5 },
    });

    expect(mockScrape).toHaveBeenCalledWith("fr", { limit: 5 });
  });
});
