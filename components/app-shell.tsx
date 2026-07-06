"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bus,
  ChartColumn,
  ClipboardList,
  History,
  LayoutGrid,
  LogOut,
  MoonStar,
  QrCode,
  ScanLine,
  SunMedium,
} from "lucide-react";
import { clearStoredAuth } from "@/lib/client-storage";

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/scan", label: "Scan Bus", icon: ScanLine },
  { href: "/today-logs", label: "Today Logs", icon: ClipboardList },
  { href: "/history", label: "History", icon: History },
  { href: "/bus-master", label: "Bus Master", icon: Bus },
  { href: "/qr-generator", label: "Generate QR", icon: QrCode },
];

export function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("aitam-dark-mode");
    const enabled = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    router.push("/login");
  };

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("aitam-dark-mode", next ? "dark" : "light");
  };

  const currentLabel = useMemo(() => {
    return navItems.find((item) => item.href === pathname)?.label ?? title;
  }, [pathname, title]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">AITAM Smart Bus Entry</p>
            <h1 className="text-xl font-semibold">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDarkMode}
              className="rounded-full border border-slate-200 p-2 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700"
              type="button"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 p-2 transition hover:border-red-500 hover:text-red-600 dark:border-slate-700"
              type="button"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 lg:flex-row lg:px-6">
        <aside className="w-full rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-72">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3">
                <ChartColumn className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Watchman Console</p>
                <p className="text-xs opacity-90">Fast QR-based bus movement tracking</p>
              </div>
            </div>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
