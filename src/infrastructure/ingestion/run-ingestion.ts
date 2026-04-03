import type { ScrapeOptions } from "@/scrapers/types";
import { scraperRegistry } from "@/scrapers";
import { importRecords } from "./import-records";
import { generateAndStoreEmbeddings } from "@/infrastructure/embeddings/seed-embeddings";
import {
  createIngestionLog,
  completeIngestionLog,
  failIngestionLog,
  findLatestIngestionLog,
} from "@/repositories/ingestion-repository";
import type { IngestionCounts } from "@/domain/ingestion";

export interface IngestionOptions {
  sourceId: string;
  locale: string;
  scrapeOptions?: ScrapeOptions;
}

export interface IngestionResult {
  logId: string;
  status: "completed" | "failed" | "skipped";
  counts: IngestionCounts;
  error?: string;
}

const zeroCounts: IngestionCounts = {
  scraped: 0,
  created: 0,
  updated: 0,
  embedded: 0,
  skipped: 0,
};

export async function runIngestion(
  options: IngestionOptions
): Promise<IngestionResult> {
  const { sourceId, locale, scrapeOptions } = options;

  const scraper = scraperRegistry.get(sourceId);
  if (!scraper) {
    throw new Error(`Unknown scraper: ${sourceId}`);
  }

  // Concurrency guard: skip if already running for same source+locale
  const existing = await findLatestIngestionLog(sourceId, locale);
  if (existing?.status === "running") {
    return { logId: existing.id, status: "skipped", counts: zeroCounts };
  }

  const log = await createIngestionLog(sourceId, locale);

  try {
    // Step 1: Scrape
    const records = await scraper.scrape(locale, scrapeOptions);

    // Step 2: Import
    const importResult = await importRecords(records, locale);

    // Step 3: Generate embeddings
    const embedResult = await generateAndStoreEmbeddings({ locale });

    const counts: IngestionCounts = {
      scraped: records.length,
      created: importResult.created,
      updated: importResult.updated,
      embedded: embedResult.embedded,
      skipped: embedResult.skipped,
    };

    await completeIngestionLog(log.id, counts);

    return { logId: log.id, status: "completed", counts };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await failIngestionLog(log.id, message);
    return { logId: log.id, status: "failed", counts: zeroCounts, error: message };
  }
}
