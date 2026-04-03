import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/infrastructure/ingestion", () => ({
  runIngestion: vi.fn(),
}));

import { POST } from "../route";
import { runIngestion } from "@/infrastructure/ingestion";

const mockRunIngestion = vi.mocked(runIngestion);

function makeRequest(
  body: Record<string, unknown>,
  token?: string
): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return new NextRequest("http://localhost/api/cron/ingest", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CRON_SECRET", "test-secret");
});

describe("POST /api/cron/ingest", () => {
  it("returns 401 without authorization header", async () => {
    const res = await POST(makeRequest({ sourceId: "orientation-ch" }));
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 401 with wrong token", async () => {
    const res = await POST(
      makeRequest({ sourceId: "orientation-ch" }, "wrong-token")
    );
    expect(res.status).toBe(401);
  });

  it("returns 500 when CRON_SECRET is not configured", async () => {
    vi.stubEnv("CRON_SECRET", "");

    const res = await POST(
      makeRequest({ sourceId: "orientation-ch" }, "some-token")
    );
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("CRON_SECRET not configured");
  });

  it("returns 400 when sourceId is missing", async () => {
    const res = await POST(makeRequest({}, "test-secret"));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("sourceId is required");
  });

  it("returns 200 on successful ingestion", async () => {
    mockRunIngestion.mockResolvedValue({
      logId: "log-1",
      status: "completed",
      counts: { scraped: 5, created: 2, updated: 3, embedded: 4, skipped: 1 },
    });

    const res = await POST(
      makeRequest({ sourceId: "orientation-ch" }, "test-secret")
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("completed");
    expect(json.logId).toBe("log-1");
  });

  it("returns 500 on failed ingestion", async () => {
    mockRunIngestion.mockResolvedValue({
      logId: "log-1",
      status: "failed",
      counts: { scraped: 0, created: 0, updated: 0, embedded: 0, skipped: 0 },
      error: "Connection refused",
    });

    const res = await POST(
      makeRequest({ sourceId: "orientation-ch" }, "test-secret")
    );
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.status).toBe("failed");
    expect(json.error).toBe("Connection refused");
  });

  it("defaults locale to fr", async () => {
    mockRunIngestion.mockResolvedValue({
      logId: "log-1",
      status: "completed",
      counts: { scraped: 0, created: 0, updated: 0, embedded: 0, skipped: 0 },
    });

    await POST(makeRequest({ sourceId: "orientation-ch" }, "test-secret"));

    expect(mockRunIngestion).toHaveBeenCalledWith({
      sourceId: "orientation-ch",
      locale: "fr",
      scrapeOptions: undefined,
    });
  });

  it("passes locale and limit through to runIngestion", async () => {
    mockRunIngestion.mockResolvedValue({
      logId: "log-1",
      status: "completed",
      counts: { scraped: 0, created: 0, updated: 0, embedded: 0, skipped: 0 },
    });

    await POST(
      makeRequest(
        { sourceId: "orientation-ch", locale: "de", limit: 10 },
        "test-secret"
      )
    );

    expect(mockRunIngestion).toHaveBeenCalledWith({
      sourceId: "orientation-ch",
      locale: "de",
      scrapeOptions: { limit: 10 },
    });
  });
});
