const AUTH_KEY = "aitam-bus-auth";
const CACHE_KEY = "aitam-bus-offline-cache";

export interface StoredAuth {
  username: string;
  role: string;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function saveStoredAuth(auth: StoredAuth) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

export function loadOfflineCache<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveOfflineCache(data: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}
