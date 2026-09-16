import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/app-shell";
import { CoinDetailProvider } from "@/context/coin-detail-context";
import { CoinDetailSheet } from "@/components/coins/coin-detail-sheet";
import { CurrencyProvider } from "@/context/currency-context";
import { SUPPORTED_CURRENCIES, type Currency } from "@/lib/format";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const rawCurrency = cookieStore.get("crypto_currency")?.value;
  const initialCurrency: Currency =
    rawCurrency && SUPPORTED_CURRENCIES.includes(rawCurrency as Currency)
      ? (rawCurrency as Currency)
      : "usd";

  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      <CoinDetailProvider>
        <AppShell>{children}</AppShell>
        <CoinDetailSheet />
      </CoinDetailProvider>
    </CurrencyProvider>
  );
}
