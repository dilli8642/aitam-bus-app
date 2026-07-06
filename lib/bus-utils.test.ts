import { describe, expect, it } from "vitest";
import { buildCsvContent, normalizeBusId } from "./bus-utils";

describe("bus utilities", () => {
  it("normalizes bus IDs to uppercase", () => {
    expect(normalizeBusId("bus001")).toBe("BUS001");
  });

  it("builds CSV content with headers and a log row", () => {
    const rows = [
      {
        bus_id: "BUS001",
        registration_number: "AP39TB1001",
        driver_name: "Driver 1",
        route: "Route 1",
        date: "2026-07-06",
        in_time: "08:00",
        out_time: "17:00",
        status: "Outside Campus",
      },
    ];

    const csv = buildCsvContent(rows, "2026-07-06");

    expect(csv).toContain("Bus ID,Registration Number,Driver Name,Route,Date,In Time,Out Time,Status");
    expect(csv).toContain("BUS001,AP39TB1001,Driver 1,Route 1,2026-07-06,08:00,17:00,Outside Campus");
  });
});
