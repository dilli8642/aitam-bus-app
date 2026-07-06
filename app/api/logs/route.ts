import { NextResponse } from "next/server";
import { createLogEntry, getLogsByFilters, getLogsForDate } from "@/lib/db";

function toDateString(date: string | null | undefined) {
  if (date) return date;
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = toDateString(searchParams.get("date"));
  const busId = searchParams.get("busId") ?? undefined;
  const driver = searchParams.get("driver") ?? undefined;
  const registration = searchParams.get("registration") ?? undefined;

  if (busId || driver || registration) {
    return NextResponse.json(getLogsByFilters(date, { busId, driver, registration }));
  }

  return NextResponse.json(getLogsForDate(date));
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    busId: string;
    action: "in" | "out";
    date?: string;
  };

  try {
    const result = createLogEntry({
      busId: body.busId,
      action: body.action,
      date: body.date ?? toDateString(null),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
