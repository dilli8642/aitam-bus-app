"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, ScanLine, Upload } from "lucide-react";

interface QRScannerProps {
  onScanResult: (value: string) => void;
}

export function QRScanner({ onScanResult }: QRScannerProps) {
  const scannerId = useRef("aitam-qr-scanner");
  const uploadScannerId = useRef("aitam-qr-upload");
  const scannerRef = useRef<any>(null);
  const [status, setStatus] = useState("Preparing camera...");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stopScanner = async () => {
      try {
        await scannerRef.current?.stop?.();
      } catch {
        // ignore cleanup errors
      }
      try {
        scannerRef.current?.clear?.();
      } catch {
        // ignore cleanup errors
      }
    };

    const startScanner = async () => {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(scannerId.current, {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
        scannerRef.current = scanner;

        let cameraId: string | null = null;
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((device) => device.kind === "videoinput");
          const backCamera = videoDevices.find((device) => /back|rear|environment/i.test(device.label));
          cameraId = backCamera?.deviceId ?? videoDevices[0]?.deviceId ?? null;
        }

        const config = { fps: 10, qrbox: { width: 260, height: 260 } };

        const onScanSuccess = (decodedText: string) => {
          const value = (decodedText ?? "").trim();
          if (!value) return;
          setStatus("QR scanned successfully");
          onScanResult(value);
          scanner.stop().catch(() => undefined);
        };

        const onScanFailure = () => undefined;

        if (cameraId) {
          await scanner.start(cameraId, config, onScanSuccess, onScanFailure);
        } else {
          try {
            await scanner.start({ facingMode: { ideal: "environment" } }, config, onScanSuccess, onScanFailure);
          } catch {
            await scanner.start({ facingMode: { ideal: "user" } }, config, onScanSuccess, onScanFailure);
          }
        }

        setStatus("Camera ready. Point the phone at the QR code.");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/already under transition|already running/i.test(message)) {
          return;
        }
        console.error("QR scanner failed to start:", error);
        setStatus("Camera access was blocked or unavailable. You can still type a bus number manually.");
      }
    };

    void startScanner();

    return () => {
      void stopScanner();
    };
  }, [onScanResult]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const uploadScanner = new Html5Qrcode(uploadScannerId.current);
      const decodedText = await uploadScanner.scanFile(file, true);
      const value = (decodedText ?? "").trim();
      if (!value) {
        setStatus("No QR code was detected in the uploaded image.");
        return;
      }
      setStatus("QR image scanned successfully");
      onScanResult(value);
      await uploadScanner.clear();
    } catch (error) {
      console.error("QR image scan failed:", error);
      setStatus("The uploaded image could not be read. Please try another QR image.");
    }
  };

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
        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <Upload className="h-4 w-4" />
          Scan from image
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      <div id={uploadScannerId.current} className="hidden" />
    </div>
  );
}
