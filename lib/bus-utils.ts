export interface CsvLogRow {
  bus_id: string;
  registration_number: string;
  driver_name: string;
  route: string;
  date: string;
  in_time?: string | null;
  out_time?: string | null;
  status: string;
}

export function normalizeBusId(value: string) {
  return value.trim().toUpperCase();
}

export function buildCsvContent(rows: CsvLogRow[], date: string) {
  const headers = [
    "Bus ID",
    "Registration Number",
    "Driver Name",
    "Route",
    "Date",
    "In Time",
    "Out Time",
    "Status",
  ];

  const lines = rows.map((row) => {
    return [
      row.bus_id,
      row.registration_number,
      row.driver_name,
      row.route,
      row.date || date,
      row.in_time || "",
      row.out_time || "",
      row.status,
    ].join(",");
  });

  return [headers.join(","), ...lines].join("\n");
}
