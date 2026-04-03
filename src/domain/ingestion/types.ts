export type IngestionStatus = "running" | "completed" | "failed";

export interface IngestionCounts {
  scraped: number;
  created: number;
  updated: number;
  embedded: number;
  skipped: number;
}
