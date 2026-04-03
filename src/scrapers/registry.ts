import type { Scraper } from "./types";

class ScraperRegistry {
  private scrapers = new Map<string, Scraper>();

  register(scraper: Scraper): void {
    this.scrapers.set(scraper.sourceId, scraper);
  }

  get(sourceId: string): Scraper | undefined {
    return this.scrapers.get(sourceId);
  }

  list(): Scraper[] {
    return Array.from(this.scrapers.values());
  }
}

export const scraperRegistry = new ScraperRegistry();
