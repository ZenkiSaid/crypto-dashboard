import { Suspense } from "react";
import {
  getCoinsMarkets,
  getGlobalMarket,
  getMarketChart,
  TIME_RANGES,
  type TimeRange,
} from "@/lib/coingecko";
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
  const resolvedParams = searchParams ? await searchParams : undefined;
  const requestedRange = resolvedParams?.range;
  const chartRange: TimeRange =
    requestedRange && TIME_RANGES.includes(requestedRange as TimeRange)
      ? (requestedRange as TimeRange)
      : DEFAULT_RANGE;

  const [global, coins, bitcoinChart] = await Promise.all([
    getGlobalMarket(),
    getCoinsMarkets({ perPage: 12 }),
    getMarketChart({ coinId: "bitcoin", range: chartRange }),
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
    />
  );
}
