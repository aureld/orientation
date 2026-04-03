import { scraperRegistry } from "./registry";
import { OrientationChScraper } from "./orientation-ch/scraper";

// Register all available scrapers
scraperRegistry.register(new OrientationChScraper());

export { scraperRegistry } from "./registry";
export type { Scraper, ScrapedRecord, ScrapeOptions } from "./types";
