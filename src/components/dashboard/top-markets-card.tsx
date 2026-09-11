"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Search, X } from "lucide-react";
import type { CoinMarket } from "@/lib/coingecko";
import { changeToneClass, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type TopMarketsCardProps = {
  coins: CoinMarket[];
};

type SortField = "market_cap" | "price" | "change_24h";
type SortDirection = "asc" | "desc";

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "market_cap", label: "Cap" },
  { field: "price", label: "Price" },
  { field: "change_24h", label: "24h %" },
];

export function TopMarketsCard({ coins }: TopMarketsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedCoins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = coins.filter((coin) => {
      if (!query) return true;
      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      let diff = 0;

      if (sortField === "market_cap") {
        diff = (a.market_cap ?? 0) - (b.market_cap ?? 0);
      } else if (sortField === "price") {
        diff = (a.current_price ?? 0) - (b.current_price ?? 0);
      } else if (sortField === "change_24h") {
        diff =
          (a.price_change_percentage_24h ?? 0) -
          (b.price_change_percentage_24h ?? 0);
      }

      return sortDirection === "desc" ? -diff : diff;
    });
  }, [coins, searchQuery, sortField, sortDirection]);

  return (
    <Card className="md:col-span-2 xl:col-span-5">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-0.5">
          <CardTitle>Top markets</CardTitle>
          <CardDescription>
            {searchQuery
              ? `${filteredAndSortedCoins.length} of ${coins.length} assets`
              : "Price, volume, and market cap"}
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="secondary">USD</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {/* Controls Toolbar: Search & Sort */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by coin or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pr-7 pl-8 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-0.5"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
            <span className="text-muted-foreground mr-1 text-[11px] font-medium">
              Sort:
            </span>
            {SORT_OPTIONS.map((opt) => {
              const isActive = sortField === opt.field;
              return (
                <Button
                  key={opt.field}
                  type="button"
                  size="xs"
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => handleSort(opt.field)}
                  className="gap-1 text-xs"
                >
                  <span>{opt.label}</span>
                  {isActive &&
                    (sortDirection === "desc" ? (
                      <ArrowDown className="size-3" />
                    ) : (
                      <ArrowUp className="size-3" />
                    ))}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Assets List */}
        {filteredAndSortedCoins.length > 0 ? (
          <ul className="divide-border/40 divide-y">
            {filteredAndSortedCoins.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;

              return (
                <li
                  key={coin.id}
                  className="hover:bg-muted/40 -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors first:pt-1 last:pb-0"
                >
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium">{coin.name}</p>
                      {coin.market_cap_rank && (
                        <span className="text-muted-foreground bg-muted rounded px-1 py-0.2 text-[10px] font-mono">
                          #{coin.market_cap_rank}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground font-mono text-xs uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatUsd(coin.current_price)}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-mono tabular-nums",
                        changeToneClass(change),
                      )}
                    >
                      {formatPercent(change)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            <p className="text-sm">
              No assets match &ldquo;{searchQuery}&rdquo;
            </p>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs"
            >
              Clear filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
