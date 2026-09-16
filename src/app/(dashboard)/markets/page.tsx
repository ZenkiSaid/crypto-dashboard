import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCoinsMarkets } from "@/lib/coingecko";
import { SUPPORTED_CURRENCIES, type Currency } from "@/lib/format";
import { MarketsTable } from "@/components/markets/markets-table";
import { MarketsSkeleton } from "@/components/markets/markets-skeleton";

export const revalidate = 60;

export default async function MarketsPage() {
  const cookieStore = await cookies();
  const rawCurrency = cookieStore.get("crypto_currency")?.value;
  const currency: Currency =
    rawCurrency && SUPPORTED_CURRENCIES.includes(rawCurrency as Currency)
      ? (rawCurrency as Currency)
      : "usd";

  return (
    <Suspense fallback={<MarketsSkeleton />}>
      <MarketsContent currency={currency} />
    </Suspense>
  );
}

async function MarketsContent({ currency }: { currency: Currency }) {
  const coins = await getCoinsMarkets({
    perPage: 50,
    sparkline: true,
    vsCurrency: currency,
  });

  if (!coins || coins.length === 0) {
    throw new Error("CoinGecko returned an empty list of market assets.");
  }

  return <MarketsTable coins={coins} currency={currency} />;
}
