-- CreateTable
CREATE TABLE "IngestionLog" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scraped" INTEGER NOT NULL DEFAULT 0,
    "created" INTEGER NOT NULL DEFAULT 0,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "embedded" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "IngestionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IngestionLog_sourceId_locale_idx" ON "IngestionLog"("sourceId", "locale");
