"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, ScanLine } from "lucide-react";

interface QRScannerProps {
  onScanResult: (value: string) => void;
}

export function QRScanner({ onScanResult }: QRScannerProps) {
  const scannerId = useRef(`scanner-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState("Preparing camera...");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(scannerId.current);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            setStatus("QR scanned successfully");
            onScanResult(decodedText);
            scanner.stop().catch(() => undefined);
          },
          () => undefined,
        );
        setStatus("Camera ready. Point the phone at the QR code.");
      } catch {
        setStatus("Camera access was blocked or unavailable.");
      }
    };

    startScanner();

    return () => {
      scannerRef.current?.stop().catch(() => undefined);
      scannerRef.current?.clear();
    };
  }, [onScanResult]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center gap-2 text-blue-600">
        <ScanLine className="h-5 w-5" />
        <p className="font-semibold">Live QR Scanner</p>
      </div>
      <div id={scannerId.current} className="min-h-[320px] overflow-hidden rounded-2xl bg-black" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}
