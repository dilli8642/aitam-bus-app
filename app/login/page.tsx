"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { getStoredAuth, saveStoredAuth } from "@/lib/client-storage";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getStoredAuth()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (username === "admin" && password === "admin123") {
      saveStoredAuth({ username, role: "admin" });
      router.push("/dashboard");
      return;
    }

    setError("Invalid credentials. Use admin / admin123.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-700 via-cyan-600 to-slate-900 px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">AITAM Smart Bus</p>
          <h1 className="mt-2 text-2xl font-semibold">Watchman Login</h1>
          <p className="mt-2 text-sm text-slate-600">Secure digital bus entry and exit management.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <User className="h-4 w-4" /> Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-blue-500"
              placeholder="admin"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lock className="h-4 w-4" /> Password
            </span>
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-blue-500"
                placeholder="admin123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
          <p className="font-semibold">Default credentials</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
