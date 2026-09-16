"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  CURRENCY_CONFIG,
  SUPPORTED_CURRENCIES,
  formatCompactCurrency,
  formatCurrency,
  type Currency,
} from "@/lib/format";

const STORAGE_KEY = "crypto_dashboard_currency";
const COOKIE_NAME = "crypto_currency";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  config: (typeof CURRENCY_CONFIG)[Currency];
  formatPrice: (value: number) => string;
  formatCompact: (value: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({
  children,
  initialCurrency = "usd",
}: {
  children: ReactNode;
  initialCurrency?: Currency;
}) {
  const router = useRouter();
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  // Sync from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (stored && SUPPORTED_CURRENCIES.includes(stored)) {
        setCurrencyState(stored);
        // Ensure cookie matches
        document.cookie = `${COOKIE_NAME}=${stored}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = useCallback(
    (newCurrency: Currency) => {
      if (!SUPPORTED_CURRENCIES.includes(newCurrency)) return;

      setCurrencyState(newCurrency);

      try {
        localStorage.setItem(STORAGE_KEY, newCurrency);
        document.cookie = `${COOKIE_NAME}=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.error("Failed to persist currency preference:", e);
      }

      // Refresh Server Components to fetch with the new vs_currency
      router.refresh();
    },
    [router],
  );

  const config = useMemo(() => CURRENCY_CONFIG[currency], [currency]);

  const formatPrice = useCallback(
    (value: number) => formatCurrency(value, currency),
    [currency],
  );

  const formatCompact = useCallback(
    (value: number) => formatCompactCurrency(value, currency),
    [currency],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        config,
        formatPrice,
        formatCompact,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
