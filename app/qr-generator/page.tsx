"use client";

import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import QRCode from "qrcode";
import { Download, Printer } from "lucide-react";
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

export default function QRGeneratorPage() {
  const [buses, setBuses] = useState<BusRow[]>([]);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/buses")
      .then((response) => response.json())
      .then((payload) => setBuses(payload))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!buses.length) return;

    const loadQrImages = async () => {
      const images = await Promise.all(
        buses.map(async (bus) => {
          const dataUrl = await QRCode.toDataURL(bus.bus_id, {
            width: 200,
            margin: 1,
            color: {
              dark: "#0f172a",
              light: "#ffffff",
            },
          });
          return [bus.bus_id, dataUrl] as const;
        }),
      );

      setQrImages(Object.fromEntries(images));
    };

    loadQrImages();
  }, [buses]);

  const handleDownloadSingle = async (busId: string) => {
    const dataUrl = qrImages[busId];
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${busId}.png`;
    link.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("AITAM-QR-Codes");

    for (const bus of buses) {
      const dataUrl = qrImages[bus.bus_id];
      if (!dataUrl) continue;
      const base64 = dataUrl.split(",")[1];
      folder?.file(`${bus.bus_id}.png`, base64, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "AITAM_QR_Codes.zip";
    link.click();
  };

  const printableBuses = useMemo(() => buses.slice(0, 24), [buses]);

  return (
    <AppShell title="Generate QR">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">QR Generator</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Download individual QR codes or package all bus QR codes as a ZIP file.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleDownloadAll} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" type="button">
              <Download className="h-4 w-4" /> Download All ZIP
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {buses.map((bus) => (
            <div key={bus.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{bus.bus_id}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{bus.registration_number}</p>
                </div>
                <button onClick={() => handleDownloadSingle(bus.bus_id)} className="rounded-2xl border border-slate-200 p-2 text-blue-600" type="button">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              {qrImages[bus.bus_id] ? <img alt={bus.bus_id} src={qrImages[bus.bus_id]} className="mx-auto rounded-2xl border border-slate-200 p-2" /> : <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Printer className="h-4 w-4" />
            <p className="font-semibold">Printable A4 Sheet Preview</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {printableBuses.map((bus) => (
              <div key={`sheet-${bus.id}`} className="rounded-2xl border border-slate-200 p-3 text-center">
                {qrImages[bus.bus_id] ? <img alt={bus.bus_id} src={qrImages[bus.bus_id]} className="mx-auto" /> : <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />}
                <p className="mt-2 text-sm font-semibold">{bus.bus_id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
