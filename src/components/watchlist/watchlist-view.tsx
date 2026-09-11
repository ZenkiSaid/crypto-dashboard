"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Star, TrendingDown, TrendingUp } from "lucide-react";
import type { CoinMarket } from "@/lib/coingecko";
import {
  changeToneClass,
  formatCompactUsd,
  formatPercent,
  formatUsd,
} from "@/lib/format";
import { useWatchlist } from "@/hooks/use-watchlist";
import { fetchWatchlistCoinsAction } from "@/actions/watchlist";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketsTable } from "@/components/markets/markets-table";
import { WatchlistSkeleton } from "@/components/watchlist/watchlist-skeleton";

export function WatchlistView() {
  const { watchlist, isLoaded } = useWatchlist();
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (watchlist.length === 0) {
      setCoins([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    fetchWatchlistCoinsAction(watchlist).then((result) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (result.success) {
        setCoins(result.data);
      } else {
        setErrorMessage(result.error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [watchlist, isLoaded]);

  // Keep displayed coins in sync if an asset is unstarred
  const activeCoins = useMemo(() => {
    return coins.filter((coin) => watchlist.includes(coin.id));
  }, [coins, watchlist]);

  // Consolidated portfolio metrics
  const metrics = useMemo(() => {
    if (activeCoins.length === 0) return null;

    const topGainer = activeCoins.reduce((best, current) => {
      const bestChange = best.price_change_percentage_24h ?? -Infinity;
      const currentChange = current.price_change_percentage_24h ?? -Infinity;
      return currentChange > bestChange ? current : best;
    }, activeCoins[0]);

    const totalChange = activeCoins.reduce(
      (acc, c) => acc + (c.price_change_percentage_24h ?? 0),
      0,
    );
    const averageChange = totalChange / activeCoins.length;

    const totalTrackedCap = activeCoins.reduce(
      (acc, c) => acc + (c.market_cap ?? 0),
      0,
    );

    return {
      topGainer,
      averageChange,
      totalTrackedCap,
    };
  }, [activeCoins]);

  // Loading state
  if (!isLoaded || (isLoading && coins.length === 0)) {
    return <WatchlistSkeleton />;
  }

  // Empty state
  if (watchlist.length === 0 || activeCoins.length === 0) {
    return (
      <Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center border-dashed">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-xs">
          <Star className="size-7 fill-amber-400/30" />
        </div>
        <CardTitle className="font-heading text-xl font-semibold">
          Your Watchlist is Empty
        </CardTitle>
        <CardDescription className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Track your favorite cryptocurrencies in real time. Click the star icon
          (⭐) next to any coin in Markets or the Overview dashboard to monitor
          them here.
        </CardDescription>
        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/markets">
              <span>Explore Markets</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // Error state
  if (errorMessage && activeCoins.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="text-base text-destructive">
          Failed to load watchlist
        </CardTitle>
        <CardDescription className="mt-1 text-xs">{errorMessage}</CardDescription>
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => {
            setIsLoading(true);
            fetchWatchlistCoinsAction(watchlist).then((res) => {
              setIsLoading(false);
              if (res.success) setCoins(res.data);
            });
          }}
          className="mt-4 gap-1.5 text-xs"
        >
          <RotateCcw className="size-3" />
          <span>Retry</span>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Consolidated Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tracked */}
          <Card size="sm">
            <CardHeader>
              <CardDescription>Tracked Assets</CardDescription>
              <CardTitle className="font-heading text-2xl tracking-tight tabular-nums">
                {activeCoins.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">In your custom list</p>
            </CardContent>
          </Card>

          {/* Top 24h Gainer */}
          <Card size="sm">
            <CardHeader>
              <CardDescription>Top 24h Gainer</CardDescription>
              <CardTitle className="flex items-center gap-2 font-heading text-2xl tracking-tight tabular-nums">
                <span className="truncate">{metrics.topGainer.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`flex items-center gap-1 text-xs font-mono font-medium tabular-nums ${changeToneClass(
                  metrics.topGainer.price_change_percentage_24h ?? 0,
                )}`}
              >
                {(metrics.topGainer.price_change_percentage_24h ?? 0) >= 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {formatPercent(metrics.topGainer.price_change_percentage_24h ?? 0)}{" "}
                · {formatUsd(metrics.topGainer.current_price)}
              </p>
            </CardContent>
          </Card>

          {/* 24h Watchlist Average */}
          <Card size="sm">
            <CardHeader>
              <CardDescription>Average 24h Move</CardDescription>
              <CardTitle
                className={`font-heading text-2xl tracking-tight tabular-nums ${changeToneClass(
                  metrics.averageChange,
                )}`}
              >
                {formatPercent(metrics.averageChange)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Across all tracked assets</p>
            </CardContent>
          </Card>

          {/* Total Tracked Market Cap */}
          <Card size="sm">
            <CardHeader>
              <CardDescription>Tracked Market Cap</CardDescription>
              <CardTitle className="font-heading text-2xl tracking-tight tabular-nums">
                {formatCompactUsd(metrics.totalTrackedCap)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Combined market share</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dedicated Watchlist Table */}
      <MarketsTable coins={activeCoins} />
    </div>
  );
}
