import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/infrastructure/db", () => ({
  prisma: {
    ingestionLog: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/infrastructure/db";
import {
  createIngestionLog,
  completeIngestionLog,
  failIngestionLog,
  findLatestIngestionLog,
  findIngestionLogById,
} from "../ingestion-repository";

const mockCreate = vi.mocked(prisma.ingestionLog.create);
const mockUpdate = vi.mocked(prisma.ingestionLog.update);
const mockFindFirst = vi.mocked(prisma.ingestionLog.findFirst);
const mockFindUnique = vi.mocked(prisma.ingestionLog.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createIngestionLog", () => {
  it("creates a log with status running", async () => {
    mockCreate.mockResolvedValueOnce({} as never);

    await createIngestionLog("orientation-ch", "fr");

    expect(mockCreate).toHaveBeenCalledWith({
      data: { sourceId: "orientation-ch", locale: "fr", status: "running" },
    });
  });
});

describe("completeIngestionLog", () => {
  it("updates log with completed status and counts", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);

    const counts = { scraped: 10, created: 3, updated: 7, embedded: 8, skipped: 2 };
    await completeIngestionLog("log-1", counts);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: {
        status: "completed",
        ...counts,
        completedAt: expect.any(Date),
      },
    });
  });
});

describe("failIngestionLog", () => {
  it("updates log with failed status and error message", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);

    await failIngestionLog("log-1", "Connection refused");

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: {
        status: "failed",
        error: "Connection refused",
        completedAt: expect.any(Date),
      },
    });
  });
});

describe("findLatestIngestionLog", () => {
  it("queries by sourceId and locale ordered by startedAt desc", async () => {
    mockFindFirst.mockResolvedValueOnce(null);

    await findLatestIngestionLog("orientation-ch", "fr");

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { sourceId: "orientation-ch", locale: "fr" },
      orderBy: { startedAt: "desc" },
    });
  });
});

describe("findIngestionLogById", () => {
  it("queries by id", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    await findIngestionLogById("log-1");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "log-1" },
    });
  });
});
