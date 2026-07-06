"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";

interface LogEntry {
  id: number;
  bus_id: string;
  registration_number: string;
  driver_name: string;
  route: string;
  date: string;
  in_time: string | null;
  out_time: string | null;
  status: string;
}

export default function TodayLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [query, setQuery] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch(`/api/logs?date=${today}`)
      .then((response) => response.json())
      .then((payload) => setLogs(payload))
      .catch(() => undefined);
  }, [today]);

  const filteredLogs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return logs;

    return logs.filter((entry) => [entry.bus_id, entry.registration_number, entry.driver_name, entry.route].some((value) => value.toLowerCase().includes(search)));
  }, [logs, query]);

  return (
    <AppShell title="Today's Logs">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Today's Entries</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Search and review today's bus movement logs.</p>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none sm:w-72" placeholder="Search by bus, driver or registration" />
          </label>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Bus</th>
                  <th className="px-4 py-3">Registration</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">IN</th>
                  <th className="px-4 py-3">OUT</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3 font-semibold">{entry.bus_id}</td>
                    <td className="px-4 py-3">{entry.registration_number}</td>
                    <td className="px-4 py-3">{entry.driver_name}</td>
                    <td className="px-4 py-3">{entry.in_time ?? "—"}</td>
                    <td className="px-4 py-3">{entry.out_time ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.status === "Outside Campus" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{entry.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
