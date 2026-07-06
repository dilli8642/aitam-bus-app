import { NextResponse } from "next/server";
import { getDashboardSummary, getLogsForDate } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  return NextResponse.json({
    summary: getDashboardSummary(date),
    logs: getLogsForDate(date),
  });
}
