"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import type { CoinMarket } from "@/lib/coingecko";
import {
  changeToneClass,
  formatCompactUsd,
  formatPercent,
  formatUsd,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkline } from "@/components/markets/sparkline";
import { FavoriteButton } from "@/components/watchlist/favorite-button";
import { useCoinDetail } from "@/context/coin-detail-context";

export type MarketsTableProps = {
  coins: CoinMarket[];
};

type SortColumn =
  | "rank"
  | "name"
  | "price"
  | "change_24h"
  | "change_7d"
  | "volume"
  | "market_cap";

type SortDirection = "asc" | "desc";

export function MarketsTable({ coins }: MarketsTableProps) {
  const { openCoinDetail } = useCoinDetail();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortColumn(column);
      setSortDirection(
        column === "rank" || column === "name" ? "asc" : "desc",
      );
    }
    setCurrentPage(1);
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

      switch (sortColumn) {
        case "rank": {
          const aRank = a.market_cap_rank ?? 9999;
          const bRank = b.market_cap_rank ?? 9999;
          diff = aRank - bRank;
          break;
        }
        case "name": {
          diff = a.name.localeCompare(b.name);
          break;
        }
        case "price": {
          diff = (a.current_price ?? 0) - (b.current_price ?? 0);
          break;
        }
        case "change_24h": {
          diff =
            (a.price_change_percentage_24h ?? 0) -
            (b.price_change_percentage_24h ?? 0);
          break;
        }
        case "change_7d": {
          const a7d =
            a.price_change_percentage_7d_in_currency ??
            a.price_change_percentage_24h ??
            0;
          const b7d =
            b.price_change_percentage_7d_in_currency ??
            b.price_change_percentage_24h ??
            0;
          diff = a7d - b7d;
          break;
        }
        case "volume": {
          diff = (a.total_volume ?? 0) - (b.total_volume ?? 0);
          break;
        }
        case "market_cap": {
          diff = (a.market_cap ?? 0) - (b.market_cap ?? 0);
          break;
        }
      }

      return sortDirection === "desc" ? -diff : diff;
    });
  }, [coins, searchQuery, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedCoins.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCoins = filteredAndSortedCoins.slice(
    startIndex,
    startIndex + pageSize,
  );

  const renderSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <ArrowUpDown className="size-3 opacity-30 group-hover:opacity-80 transition-opacity" />
      );
    }

    return sortDirection === "desc" ? (
      <ArrowDown className="size-3 text-foreground" />
    ) : (
      <ArrowUp className="size-3 text-foreground" />
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Crypto Markets</CardTitle>
            <CardDescription>
              Live prices, volume, market cap, and 7-day price trajectories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {coins.length} Assets
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Controls Bar: Search + Page size */}
      <div className="flex flex-col gap-3 border-b bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search coin by name or symbol..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 pr-7 pl-8 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-0.5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <span>Rows per page:</span>
          <div className="flex items-center gap-1">
            {[10, 25, 50].map((size) => (
              <Button
                key={size}
                type="button"
                size="xs"
                variant={pageSize === size ? "secondary" : "ghost"}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className="h-7 px-2 text-xs"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground font-medium select-none">
              <tr>
                <th className="py-3 pl-3 pr-1 w-8 text-center">
                  <span className="sr-only">Watchlist</span>
                </th>
                <th className="py-3 px-2 w-10 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort("rank")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium"
                  >
                    <span>#</span>
                    {renderSortIndicator("rank")}
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium"
                  >
                    <span>Asset</span>
                    {renderSortIndicator("name")}
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort("price")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium ml-auto"
                  >
                    <span>Price</span>
                    {renderSortIndicator("price")}
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort("change_24h")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium ml-auto"
                  >
                    <span>24h %</span>
                    {renderSortIndicator("change_24h")}
                  </button>
                </th>
                <th className="py-3 px-3 text-right hidden md:table-cell">
                  <button
                    type="button"
                    onClick={() => handleSort("change_7d")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium ml-auto"
                  >
                    <span>7d %</span>
                    {renderSortIndicator("change_7d")}
                  </button>
                </th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">
                  <button
                    type="button"
                    onClick={() => handleSort("volume")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium ml-auto"
                  >
                    <span>24h Volume</span>
                    {renderSortIndicator("volume")}
                  </button>
                </th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">
                  <button
                    type="button"
                    onClick={() => handleSort("market_cap")}
                    className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium ml-auto"
                  >
                    <span>Market Cap</span>
                    {renderSortIndicator("market_cap")}
                  </button>
                </th>
                <th className="py-3 pr-4 pl-3 text-center w-36">
                  <span className="font-medium">Last 7 Days</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedCoins.length > 0 ? (
                paginatedCoins.map((coin) => {
                  const change24h = coin.price_change_percentage_24h ?? 0;
                  const change7d =
                    coin.price_change_percentage_7d_in_currency ??
                    coin.price_change_percentage_24h ??
                    0;

                  return (
                    <tr
                      key={coin.id}
                      onClick={() => openCoinDetail(coin)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      {/* Watchlist Favorite Toggle */}
                      <td className="py-3.5 pl-3 pr-1 text-center">
                        <FavoriteButton coinId={coin.id} coinName={coin.name} />
                      </td>

                      {/* Rank */}
                      <td className="py-3.5 px-2 text-center font-mono text-xs text-muted-foreground">
                        {coin.market_cap_rank ?? "-"}
                      </td>

                      {/* Asset Name + Symbol */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={28}
                            height={28}
                            className="size-7 rounded-full shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium leading-none">
                              {coin.name}
                            </p>
                            <p className="font-mono text-xs uppercase text-muted-foreground mt-1 leading-none">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="py-3.5 px-3 text-right font-medium tabular-nums text-sm">
                        {formatUsd(coin.current_price)}
                      </td>

                      {/* 24h Change */}
                      <td
                        className={cn(
                          "py-3.5 px-3 text-right font-mono text-xs tabular-nums font-medium",
                          changeToneClass(change24h),
                        )}
                      >
                        {formatPercent(change24h)}
                      </td>

                      {/* 7d Change */}
                      <td
                        className={cn(
                          "py-3.5 px-3 text-right font-mono text-xs tabular-nums font-medium hidden md:table-cell",
                          changeToneClass(change7d),
                        )}
                      >
                        {formatPercent(change7d)}
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-3 text-right font-mono text-xs tabular-nums text-muted-foreground hidden lg:table-cell">
                        {formatCompactUsd(coin.total_volume)}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-3 text-right font-mono text-xs tabular-nums text-muted-foreground hidden sm:table-cell">
                        {formatCompactUsd(coin.market_cap)}
                      </td>

                      {/* Sparkline */}
                      <td className="py-3.5 pr-4 pl-3 text-center">
                        <div className="flex justify-center">
                          <Sparkline
                            data={coin.sparkline_in_7d?.price}
                            width={110}
                            height={32}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <p className="text-sm">
                      No assets found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="mt-3 text-xs"
                    >
                      Clear search
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Pagination Footer */}
      {filteredAndSortedCoins.length > 0 && (
        <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(
                startIndex + pageSize,
                filteredAndSortedCoins.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredAndSortedCoins.length}
            </span>{" "}
            assets
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 gap-1"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>

            <span className="font-mono text-xs px-2">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="h-7 gap-1"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
