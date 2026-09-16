import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  getCoinsMarkets,
  getGlobalMarket,
  getMarketChart,
  TIME_RANGES,
  type TimeRange,
} from "@/lib/coingecko";
import { SUPPORTED_CURRENCIES, type Currency } from "@/lib/format";
import { OverviewBento } from "@/components/dashboard/overview-bento";
import { OverviewBentoSkeleton } from "@/components/dashboard/overview-skeleton";

export const revalidate = 60;

const DEFAULT_RANGE: TimeRange = "7d";

export type OverviewPageProps = {
  searchParams?: Promise<{ range?: string }>;
};

export default function OverviewPage({ searchParams }: OverviewPageProps) {
  return (
    <Suspense fallback={<OverviewBentoSkeleton />}>
      <OverviewDashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function OverviewDashboard({ searchParams }: OverviewPageProps) {
  const cookieStore = await cookies();
  const rawCurrency = cookieStore.get("crypto_currency")?.value;
  const currency: Currency =
    rawCurrency && SUPPORTED_CURRENCIES.includes(rawCurrency as Currency)
      ? (rawCurrency as Currency)
      : "usd";

  const resolvedParams = searchParams ? await searchParams : undefined;
  const requestedRange = resolvedParams?.range;
  const chartRange: TimeRange =
    requestedRange && TIME_RANGES.includes(requestedRange as TimeRange)
      ? (requestedRange as TimeRange)
      : DEFAULT_RANGE;

  const [global, coins, bitcoinChart] = await Promise.all([
    getGlobalMarket(),
    getCoinsMarkets({ perPage: 12, vsCurrency: currency }),
    getMarketChart({
      coinId: "bitcoin",
      range: chartRange,
      vsCurrency: currency,
    }),
  ]);

  if (!global.data || coins.length === 0 || bitcoinChart.prices.length === 0) {
    throw new Error("CoinGecko returned an incomplete or empty payload.");
  }

  return (
    <OverviewBento
      global={global.data}
      coins={coins}
      bitcoinChart={bitcoinChart}
      chartRange={chartRange}
      currency={currency}
    />
  );
}
