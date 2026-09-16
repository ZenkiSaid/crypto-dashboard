"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  TIME_RANGES,
  type CoinMarket,
  type MarketChart,
  type TimeRange,
} from "@/lib/coingecko";
import { formatChartTick, formatCurrency, type Currency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/currency-context";
import { fetchMarketChartAction } from "@/actions/market-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BitcoinPriceChart } from "@/components/dashboard/overview-charts";

export type BitcoinPriceCardProps = {
  initialChart: MarketChart;
  initialRange: TimeRange;
  bitcoin?: CoinMarket;
  currency?: Currency;
};

export function BitcoinPriceCard({
  initialChart,
  initialRange,
  bitcoin,
  currency,
}: BitcoinPriceCardProps) {
  const { currency: contextCurrency } = useCurrency();
  const activeCurrency = currency ?? contextCurrency;
  const [activeRange, setActiveRange] = useState<TimeRange>(initialRange);
  const [cache, setCache] = useState<Partial<Record<TimeRange, MarketChart>>>(
    () => ({
      [initialRange]: initialChart,
    }),
  );
  const [pendingRange, setPendingRange] = useState<TimeRange | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (range: TimeRange) => {
    if (range === activeRange || isPending) {
      return;
    }

    setErrorMessage(null);

    // Sync URL cleanly without full page re-render
    const syncUrl = () => {
      const url = new URL(window.location.href);
      if (range === "7d") {
        url.searchParams.delete("range");
      } else {
        url.searchParams.set("range", range);
      }
      window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
    };

    // If data is already in client cache, instant 0ms transition
    if (cache[range]) {
      setActiveRange(range);
      syncUrl();
      return;
    }

    // Otherwise fetch via Server Action in a transition
    setPendingRange(range);
    startTransition(async () => {
      const result = await fetchMarketChartAction(
        "bitcoin",
        range,
        activeCurrency,
      );

      if (result.success) {
        setCache((prev) => ({ ...prev, [range]: result.data }));
        setActiveRange(range);
        syncUrl();
      } else {
        setErrorMessage(result.error);
      }

      setPendingRange(null);
    });
  };

  const currentChart = cache[activeRange] ?? initialChart;

  const priceSeries = useMemo(() => {
    return currentChart.prices.map((point) => ({
      timestamp: point.timestamp,
      price: point.value,
      label: formatChartTick(point.timestamp, activeRange),
    }));
  }, [currentChart, activeRange]);

  return (
    <Card className="md:col-span-2 xl:col-span-5">
      <CardHeader className="border-b">
        <div>
          <CardTitle>Bitcoin price</CardTitle>
          <CardDescription>
            {bitcoin
              ? `${formatCurrency(bitcoin.current_price, activeCurrency)} · last ${activeRange}`
              : `Interactive series · last ${activeRange}`}
          </CardDescription>
          {errorMessage && (
            <p className="mt-1 text-xs text-destructive">
              {errorMessage} (showing cached data)
            </p>
          )}
        </div>
        <CardAction>
          <div className="flex items-center gap-1">
            {TIME_RANGES.map((range) => {
              const isCurrent = range === activeRange;
              const isTargetPending = isPending && range === pendingRange;

              return (
                <Button
                  key={range}
                  type="button"
                  size="xs"
                  variant={isCurrent ? "secondary" : "ghost"}
                  aria-pressed={isCurrent}
                  disabled={isPending}
                  onClick={() => handleRangeChange(range)}
                  className="transition-all"
                >
                  {isTargetPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : null}
                  {range.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative">
          <div
            className={cn(
              "transition-opacity duration-300",
              isPending ? "opacity-40" : "opacity-100",
            )}
          >
            <BitcoinPriceChart data={priceSeries} currency={activeCurrency} />
          </div>

          {isPending && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xs">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Updating {pendingRange?.toUpperCase()} data...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
