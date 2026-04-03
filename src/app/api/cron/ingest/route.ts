import { NextRequest, NextResponse } from "next/server";
import { runIngestion } from "@/infrastructure/ingestion";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sourceId, locale, limit } = body as {
    sourceId?: string;
    locale?: string;
    limit?: number;
  };

  if (!sourceId) {
    return NextResponse.json(
      { error: "sourceId is required" },
      { status: 400 }
    );
  }

  const result = await runIngestion({
    sourceId,
    locale: locale ?? "fr",
    scrapeOptions: limit ? { limit } : undefined,
  });

  const statusCode = result.status === "completed" ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}
