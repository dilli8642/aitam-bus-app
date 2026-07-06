"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";

interface BusRow {
  id: number;
  bus_id: string;
  registration_number: string;
  driver_name: string;
  route: string;
  capacity: number;
  status: string;
}

export default function BusMasterPage() {
  const [buses, setBuses] = useState<BusRow[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/buses")
      .then((response) => response.json())
      .then((payload) => setBuses(payload))
      .catch(() => undefined);
  }, []);

  const filteredBuses = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return buses;

    return buses.filter((bus) => {
      return [bus.bus_id, bus.registration_number, bus.driver_name, bus.route].some((value) => value.toLowerCase().includes(search));
    });
  }, [buses, query]);

  return (
    <AppShell title="Bus Master">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Bus Inventory</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">All 50 sample buses are available and ready for scanning.</p>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none sm:w-64" placeholder="Search bus, driver, route..." />
          </label>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Bus ID</th>
                  <th className="px-4 py-3">Registration</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus) => (
                  <tr key={bus.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3 font-semibold">{bus.bus_id}</td>
                    <td className="px-4 py-3">{bus.registration_number}</td>
                    <td className="px-4 py-3">{bus.driver_name}</td>
                    <td className="px-4 py-3">{bus.route}</td>
                    <td className="px-4 py-3">{bus.capacity}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{bus.status}</span>
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
