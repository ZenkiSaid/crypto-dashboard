"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "crypto_dashboard_watchlist";
const LISTENERS = new Set<() => void>();
const EMPTY_WATCHLIST: string[] = [];

let cachedRaw: string | null = null;
let cachedWatchlist: string[] = [];

function getSnapshot(): string[] {
  if (typeof window === "undefined") {
    return cachedWatchlist;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedWatchlist = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      cachedWatchlist = [];
    }
  }
  return cachedWatchlist;
}

function getServerSnapshot(): string[] {
  return EMPTY_WATCHLIST;
}

function subscribe(listener: () => void): () => void {
  LISTENERS.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedRaw = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    LISTENERS.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function emitChange() {
  cachedRaw = null;
  LISTENERS.forEach((listener) => listener());
}

function updateStorage(next: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Failed to save watchlist to localStorage:", error);
  }
  emitChange();
}

export function useWatchlist() {
  const [mounted, setMounted] = useState(false);
  const watchlist = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = useCallback(
    (id: string) => watchlist.includes(id),
    [watchlist],
  );

  const addFavorite = useCallback(
    (id: string) => {
      if (!watchlist.includes(id)) {
        updateStorage([...watchlist, id]);
      }
    },
    [watchlist],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (watchlist.includes(id)) {
        updateStorage(watchlist.filter((item) => item !== id));
      }
    },
    [watchlist],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (watchlist.includes(id)) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    },
    [watchlist, addFavorite, removeFavorite],
  );

  return {
    watchlist,
    isLoaded: mounted,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
