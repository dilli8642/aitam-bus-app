"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bus, CalendarDays, Download, History, LogIn, LogOut, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getStoredAuth, loadOfflineCache, saveOfflineCache } from "@/lib/client-storage";

interface DashboardSummary {
  totalBuses: number;
  todayIn: number;
  todayOut: number;
  currentlyOutside: number;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [summary, setSummary] = useState<DashboardSummary>({ totalBuses: 0, todayIn: 0, todayOut: 0, currentlyOutside: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [offline, setOffline] = useState(false);
  const [dateDisplay, setDateDisplay] = useState("Loading...");

  useEffect(() => {
    if (!getStoredAuth()) {
      router.replace("/login");
      return;
    }

    const date = new Date(today + "T00:00:00Z");
    const formatted = date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    setDateDisplay(formatted);

    const loadDashboard = async () => {
      try {
        const response = await fetch(`/api/dashboard?date=${today}`);
        const payload = await response.json();
        setSummary(payload.summary);
        setLogs(payload.logs);
        saveOfflineCache(payload);
        setOffline(false);
      } catch {
        const cached = loadOfflineCache<{ summary: DashboardSummary; logs: LogEntry[] } | null>(null);
        if (cached) {
          setSummary(cached.summary);
          setLogs(cached.logs);
        }
        setOffline(true);
      }
    };

    loadDashboard();
  }, [router, today]);

  const handleDownloadCsv = async () => {
    const response = await fetch(`/api/export/csv?date=${today}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AITAM_Bus_Log_${today}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Dashboard">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-90">Today</p>
              <h2 className="mt-2 text-2xl font-semibold" suppressHydrationWarning>{dateDisplay}</h2>
            </div>
            <div className="rounded-2xl bg-white/20 p-3">
              <CalendarDays className="h-6 w-6" />
            </div>
          </div>
          {offline ? <p className="rounded-2xl bg-white/20 px-3 py-2 text-sm">Offline mode: showing cached data from the last successful sync.</p> : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Buses", value: summary.totalBuses, icon: Bus },
            { label: "Today's IN", value: summary.todayIn, icon: LogIn },
            { label: "Today's OUT", value: summary.todayOut, icon: LogOut },
            { label: "Currently Outside", value: summary.currentlyOutside, icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/scan", label: "Scan Bus", description: "Scan a QR code and log entry or exit." },
            { href: "/today-logs", label: "Today's Logs", description: "Review all movements for today." },
            { href: "/history", label: "History", description: "Search and filter historical records." },
            { href: "/qr-generator", label: "Generate QR", description: "Print and download bus QR sheets." },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-dark dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{link.label}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{link.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-lg font-semibold">Today's Bus Activity</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Sorted by the latest scan activity.</p>
          </div>
          <button onClick={handleDownloadCsv} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" type="button">
            <Download className="h-4 w-4" /> Download CSV
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <Search className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-medium">Live log feed</p>
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
                {logs.map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium">{entry.bus_id}</td>
                    <td className="px-4 py-3">{entry.registration_number}</td>
                    <td className="px-4 py-3">{entry.driver_name}</td>
                    <td className="px-4 py-3">{entry.in_time ?? "—"}</td>
                    <td className="px-4 py-3">{entry.out_time ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.status === "Outside Campus" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {entry.status}
                      </span>
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
