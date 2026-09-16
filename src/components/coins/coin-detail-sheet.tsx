"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  Calendar,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  TIME_RANGES,
  type MarketChart,
  type TimeRange,
} from "@/lib/coingecko";
import {
  changeToneClass,
  formatChartTick,
  formatCompactUsd,
  formatPercent,
  formatUsd,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCoinDetail } from "@/context/coin-detail-context";
import { fetchMarketChartAction } from "@/actions/market-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "@/components/watchlist/favorite-button";
import { CoinPriceChart } from "@/components/dashboard/overview-charts";

export function CoinDetailSheet() {
  const { selectedCoin, isOpen, closeCoinDetail } = useCoinDetail();
  const [activeRange, setActiveRange] = useState<TimeRange>("7d");
  const [chartCache, setChartCache] = useState<
    Record<string, Partial<Record<TimeRange, MarketChart>>>
  >({});
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const coinId = selectedCoin?.id;

  // Fetch chart when coin changes or activeRange changes
  useEffect(() => {
    if (!coinId || !isOpen) return;

    // Check if already cached in memory for this coin + range
    if (chartCache[coinId]?.[activeRange]) {
      return;
    }

    let isMounted = true;
    setIsLoadingChart(true);
    setChartError(null);

    fetchMarketChartAction(coinId, activeRange).then((result) => {
      if (!isMounted) return;
      setIsLoadingChart(false);

      if (result.success) {
        setChartCache((prev) => ({
          ...prev,
          [coinId]: {
            ...prev[coinId],
            [activeRange]: result.data,
          },
        }));
      } else {
        setChartError(result.error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [coinId, activeRange, isOpen, chartCache]);

  const currentChart = coinId ? chartCache[coinId]?.[activeRange] : undefined;

  const priceSeries = useMemo(() => {
    if (!currentChart?.prices) return [];
    return currentChart.prices.map((point) => ({
      timestamp: point.timestamp,
      price: point.value,
      label: formatChartTick(point.timestamp, activeRange),
    }));
  }, [currentChart, activeRange]);

  if (!selectedCoin) return null;

  const change24h = selectedCoin.price_change_percentage_24h ?? 0;
  const isPositive24h = change24h >= 0;

  // 24h Range calculation
  const low24h = selectedCoin.low_24h ?? selectedCoin.current_price;
  const high24h = selectedCoin.high_24h ?? selectedCoin.current_price;
  const rangeSpan = high24h - low24h || 1;
  const rangeProgress = Math.min(
    100,
    Math.max(0, ((selectedCoin.current_price - low24h) / rangeSpan) * 100),
  );

  // Supply calculation
  const maxSupply = selectedCoin.max_supply ?? selectedCoin.total_supply;
  const supplyPercent = maxSupply
    ? Math.min(100, (selectedCoin.circulating_supply / maxSupply) * 100)
    : null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCoinDetail()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-0"
      >
        {/* Sheet Header */}
        <div className="border-b bg-card/50 p-6 pb-5">
          <SheetHeader className="p-0">
            <div className="flex items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full shrink-0 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-lg font-bold">
                      {selectedCoin.name}
                    </SheetTitle>
                    {selectedCoin.market_cap_rank && (
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] px-1.5 py-0"
                      >
                        #{selectedCoin.market_cap_rank}
                      </Badge>
                    )}
                  </div>
                  <SheetDescription className="font-mono text-xs uppercase text-muted-foreground">
                    {selectedCoin.symbol}
                  </SheetDescription>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <FavoriteButton
                  coinId={selectedCoin.id}
                  coinName={selectedCoin.name}
                  size="icon-sm"
                />
              </div>
            </div>

            {/* Price & 24h Change */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {formatUsd(selectedCoin.current_price)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-medium",
                  isPositive24h
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative",
                )}
              >
                {isPositive24h ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {formatPercent(change24h)}
              </span>
            </div>
          </SheetHeader>
        </div>

        <div className="space-y-6 p-6">
          {/* Interactive Chart Section */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                Price Performance
              </p>
              <div className="flex items-center gap-1">
                {TIME_RANGES.map((range) => (
                  <Button
                    key={range}
                    type="button"
                    size="xs"
                    variant={activeRange === range ? "secondary" : "ghost"}
                    onClick={() => {
                      startTransition(() => {
                        setActiveRange(range);
                      });
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    {range.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chart Frame / Skeleton */}
            <div className="relative min-h-[208px]">
              {isLoadingChart && !currentChart ? (
                <div className="flex h-[208px] flex-col items-center justify-center gap-2">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Loading {activeRange.toUpperCase()} chart...
                  </span>
                </div>
              ) : chartError && !currentChart ? (
                <div className="flex h-[208px] flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-destructive">
                    Chart rate-limited or unavailable.
                  </p>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setIsLoadingChart(true);
                      fetchMarketChartAction(selectedCoin.id, activeRange).then(
                        (res) => {
                          setIsLoadingChart(false);
                          if (res.success) {
                            setChartCache((prev) => ({
                              ...prev,
                              [selectedCoin.id]: {
                                ...prev[selectedCoin.id],
                                [activeRange]: res.data,
                              },
                            }));
                          }
                        },
                      );
                    }}
                    className="mt-2 text-xs"
                  >
                    Retry chart
                  </Button>
                </div>
              ) : priceSeries.length > 0 ? (
                <div
                  className={cn(
                    "transition-opacity duration-200",
                    isPending || isLoadingChart ? "opacity-40" : "opacity-100",
                  )}
                >
                  <CoinPriceChart data={priceSeries} height={208} />
                </div>
              ) : (
                <Skeleton className="h-[208px] w-full rounded-lg" />
              )}
            </div>
          </div>

          {/* 24h Trading Range Bar */}
          <div className="space-y-2 rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                24h Low / High
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {rangeProgress.toFixed(0)}% of range
              </span>
            </div>

            {/* Visual Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-negative via-amber-500 to-positive transition-all duration-500"
                style={{ width: "100%" }}
              />
              <div
                className="absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full bg-foreground shadow-xs"
                style={{ left: `${rangeProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="text-left">
                <span className="text-muted-foreground text-[11px] block">Low</span>
                <span className="font-medium">{formatUsd(low24h)}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-[11px] block">High</span>
                <span className="font-medium">{formatUsd(high24h)}</span>
              </div>
            </div>
          </div>

          {/* Key Market Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <p className="text-[11px] font-medium text-muted-foreground">
                Market Cap
              </p>
              <p className="mt-1 font-heading text-base font-semibold tabular-nums">
                {formatCompactUsd(selectedCoin.market_cap)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                Rank #{selectedCoin.market_cap_rank ?? "-"}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <p className="text-[11px] font-medium text-muted-foreground">
                24h Volume
              </p>
              <p className="mt-1 font-heading text-base font-semibold tabular-nums">
                {formatCompactUsd(selectedCoin.total_volume)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                Vol / MCap:{" "}
                {(
                  selectedCoin.total_volume / (selectedCoin.market_cap || 1)
                ).toFixed(3)}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <p className="text-[11px] font-medium text-muted-foreground">
                Fully Diluted (FDV)
              </p>
              <p className="mt-1 font-heading text-base font-semibold tabular-nums">
                {selectedCoin.fully_diluted_valuation
                  ? formatCompactUsd(selectedCoin.fully_diluted_valuation)
                  : "N/A"}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Est. theoretical cap
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <p className="text-[11px] font-medium text-muted-foreground">
                Circulating Supply
              </p>
              <p className="mt-1 font-heading text-base font-semibold tabular-nums truncate">
                {formatCompactUsd(selectedCoin.circulating_supply).replace("$", "")}{" "}
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {selectedCoin.symbol}
                </span>
              </p>
              {supplyPercent !== null ? (
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {supplyPercent.toFixed(1)}% of total
                </p>
              ) : (
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Unlimited supply
                </p>
              )}
            </div>
          </div>

          {/* Supply Progress Bar */}
          {supplyPercent !== null && (
            <div className="rounded-xl border bg-card p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  Supply Emitted
                </span>
                <span className="font-mono text-xs tabular-nums font-medium">
                  {supplyPercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${supplyPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>
                  Max:{" "}
                  {maxSupply
                    ? formatCompactUsd(maxSupply).replace("$", "")
                    : "None"}{" "}
                  {selectedCoin.symbol.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* All-Time Records (ATH & ATL) */}
          <div className="rounded-xl border bg-card p-4 shadow-xs space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              All-Time Records
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* ATH */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium">All-Time High</span>
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      changeToneClass(selectedCoin.ath_change_percentage),
                    )}
                  >
                    {formatPercent(selectedCoin.ath_change_percentage)}
                  </span>
                </div>
                <p className="font-heading text-lg font-semibold tabular-nums">
                  {formatUsd(selectedCoin.ath)}
                </p>
                <p className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>
                    {selectedCoin.ath_date
                      ? new Date(selectedCoin.ath_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>

              {/* ATL */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium">All-Time Low</span>
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      changeToneClass(selectedCoin.atl_change_percentage),
                    )}
                  >
                    {formatPercent(selectedCoin.atl_change_percentage)}
                  </span>
                </div>
                <p className="font-heading text-lg font-semibold tabular-nums">
                  {formatUsd(selectedCoin.atl)}
                </p>
                <p className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>
                    {selectedCoin.atl_date
                      ? new Date(selectedCoin.atl_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
