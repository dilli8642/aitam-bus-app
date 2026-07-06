"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuth } from "@/lib/client-storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredAuth() ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="text-lg font-semibold">Loading AITAM Smart Bus System...</p>
    </div>
  );
}
