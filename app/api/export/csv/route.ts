import { NextResponse } from "next/server";
import { buildCsvContent } from "@/lib/bus-utils";
import { getLogsForDate } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const logs = getLogsForDate(date) as Array<{
    bus_id: string;
    registration_number: string;
    driver_name: string;
    route: string;
    date: string;
    in_time: string | null;
    out_time: string | null;
    status: string;
  }>;
  const csv = buildCsvContent(
    logs.map((row) => ({
      bus_id: row.bus_id,
      registration_number: row.registration_number,
      driver_name: row.driver_name,
      route: row.route,
      date: row.date,
      in_time: row.in_time,
      out_time: row.out_time,
      status: row.status,
    })),
    date,
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="AITAM_Bus_Log_${date}.csv"`,
    },
  });
}
