export interface ScrapedRecord {
  externalId: string;
  sourceId: string;
  locale: string;
  data: Record<string, unknown>;
}

export interface ScrapeOptions {
  limit?: number;
}

export interface Scraper {
  readonly sourceId: string;
  readonly supportedLocales: string[];
  scrape(locale: string, options?: ScrapeOptions): Promise<ScrapedRecord[]>;
}
