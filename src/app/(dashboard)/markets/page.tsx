import { Suspense } from "react";
import { getCoinsMarkets } from "@/lib/coingecko";
import { MarketsTable } from "@/components/markets/markets-table";
import { MarketsSkeleton } from "@/components/markets/markets-skeleton";

export const revalidate = 60;

export default function MarketsPage() {
  return (
    <Suspense fallback={<MarketsSkeleton />}>
      <MarketsContent />
    </Suspense>
  );
}

async function MarketsContent() {
  const coins = await getCoinsMarkets({
    perPage: 50,
    sparkline: true,
  });

  if (!coins || coins.length === 0) {
    throw new Error("CoinGecko returned an empty list of market assets.");
  }

  return <MarketsTable coins={coins} />;
}
