import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CoinDetailProvider } from "@/context/coin-detail-context";
import { CoinDetailSheet } from "@/components/coins/coin-detail-sheet";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CoinDetailProvider>
      <AppShell>{children}</AppShell>
      <CoinDetailSheet />
    </CoinDetailProvider>
  );
}
