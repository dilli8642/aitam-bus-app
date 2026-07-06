import { NextResponse } from "next/server";
import { getBusById, listBuses } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const busId = searchParams.get("busId");

  if (busId) {
    return NextResponse.json(getBusById(busId));
  }

  return NextResponse.json(listBuses());
}
