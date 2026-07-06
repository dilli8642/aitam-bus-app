"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Search, TicketCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AppShell } from "@/components/app-shell";
import { QRScanner } from "@/components/qr-scanner";
import { getStoredAuth } from "@/lib/client-storage";

interface BusRecord {
  id: number;
  bus_id: string;
  registration_number: string;
  driver_name: string;
  route: string;
  capacity: number;
  status: string;
}

export default function ScanPage() {
  const router = useRouter();
  const [bus, setBus] = useState<BusRecord | null>(null);
  const [scanValue, setScanValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!getStoredAuth()) {
      router.replace("/login");
    }
  }, [router]);

  const lookupBus = useCallback(async (value: string) => {
    const normalizedValue = (value ?? "").trim().toUpperCase();
    setLoading(true);
    try {
      const response = await fetch(`/api/buses?busId=${encodeURIComponent(normalizedValue)}`);
      const payload = await response.json();
      setBus(payload);
      setScanValue(normalizedValue);
      setMessage("");
      if (!payload) {
        toast.error("Bus not found");
      } else {
        toast.success(`Bus ${normalizedValue} loaded`);
      }
    } catch {
      toast.error("Unable to load bus details");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScanResult = useCallback((value: string) => {
    void lookupBus(value);
  }, [lookupBus]);

  const handleAction = async (action: "in" | "out") => {
    if (!bus) return;

    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        busId: bus.bus_id,
        action,
        date: new Date().toISOString().slice(0, 10),
      }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      toast.error(payload.error ?? "Unable to complete the operation");
      setMessage(payload.error ?? "Unable to complete the operation");
      return;
    }

    const statusLabel = action === "in" ? "Inside Campus" : "Outside Campus";
    setMessage(`${bus.bus_id} marked ${statusLabel}`);
    toast.success(`${bus.bus_id} marked ${statusLabel}`);
  };

  return (
    <AppShell title="Scan Bus">
      <div className="space-y-4">
        <Toaster position="top-center" />
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2 text-blue-600">
            <Search className="h-5 w-5" />
            <p className="font-semibold">Scan or search a bus by QR code</p>
          </div>
          <QRScanner onScanResult={handleScanResult} />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={scanValue}
              onChange={(event) => setScanValue(event.target.value.toUpperCase())}
              placeholder="Enter bus number manually (e.g., BUS001)"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="button"
              onClick={() => lookupBus(scanValue)}
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Load Bus
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-blue-600">
            <TicketCheck className="h-5 w-5" />
            <p className="font-semibold">Detected Bus</p>
          </div>
          {loading ? <p className="mt-3 text-sm text-slate-600">Loading bus details...</p> : null}
          {message ? <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

          {bus ? (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Bus Number</p>
                  <p className="text-lg font-semibold">{bus.bus_id}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Registration</p>
                  <p className="text-lg font-semibold">{bus.registration_number}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Driver</p>
                  <p className="text-lg font-semibold">{bus.driver_name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Route</p>
                  <p className="text-lg font-semibold">{bus.route}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAction("in")} className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white" type="button">
                  <CheckCircle2 className="h-4 w-4" /> IN
                </button>
                <button onClick={() => handleAction("out")} className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white" type="button">OUT</button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No bus has been scanned yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
