"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
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

export default function HistoryPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busFilter, setBusFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("");

  useEffect(() => {
    fetch(`/api/logs?date=${date}`)
      .then((response) => response.json())
      .then((payload) => setLogs(payload))
      .catch(() => undefined);
  }, [date]);

  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      const busMatch = !busFilter || entry.bus_id.toLowerCase().includes(busFilter.toLowerCase());
      const driverMatch = !driverFilter || entry.driver_name.toLowerCase().includes(driverFilter.toLowerCase());
      const registrationMatch = !registrationFilter || entry.registration_number.toLowerCase().includes(registrationFilter.toLowerCase());
      return busMatch && driverMatch && registrationMatch;
    });
  }, [busFilter, driverFilter, logs, registrationFilter]);

  return (
    <AppShell title="History">
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2 text-blue-600">
            <CalendarDays className="h-5 w-5" />
            <p className="font-semibold">Historical Records</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Bus</span>
              <input value={busFilter} onChange={(event) => setBusFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-900" placeholder="BUS001" />
            </label>
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Driver</span>
              <input value={driverFilter} onChange={(event) => setDriverFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-900" placeholder="Driver 1" />
            </label>
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Registration</span>
              <input value={registrationFilter} onChange={(event) => setRegistrationFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-900" placeholder="AP39TB1001" />
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <Search className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-medium">Historical results</p>
          </div>
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
