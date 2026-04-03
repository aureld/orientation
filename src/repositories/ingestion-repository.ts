import { prisma } from "@/infrastructure/db";
import type { IngestionCounts } from "@/domain/ingestion";

export function createIngestionLog(sourceId: string, locale: string) {
  return prisma.ingestionLog.create({
    data: { sourceId, locale, status: "running" },
  });
}

export function completeIngestionLog(id: string, counts: IngestionCounts) {
  return prisma.ingestionLog.update({
    where: { id },
    data: {
      status: "completed",
      ...counts,
      completedAt: new Date(),
    },
  });
}

export function failIngestionLog(id: string, error: string) {
  return prisma.ingestionLog.update({
    where: { id },
    data: {
      status: "failed",
      error,
      completedAt: new Date(),
    },
  });
}

export function findLatestIngestionLog(sourceId: string, locale: string) {
  return prisma.ingestionLog.findFirst({
    where: { sourceId, locale },
    orderBy: { startedAt: "desc" },
  });
}

export function findIngestionLogById(id: string) {
  return prisma.ingestionLog.findUnique({
    where: { id },
  });
}
