import Image from "next/image";
import type {
  CoinMarket,
  GlobalMarketData,
  MarketChart,
  TimeRange,
} from "@/lib/coingecko";
import { TIME_RANGES } from "@/lib/coingecko";
import {
  changeToneClass,
  formatChartTick,
  formatCompactUsd,
  formatInteger,
  formatPercent,
  formatSharePercent,
  formatUsd,
} from "@/lib/format";
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
import {
  BitcoinPriceChart,
  MarketDominanceChart,
  VolumeLeadersChart,
} from "@/components/dashboard/overview-charts";

export type OverviewBentoProps = {
  global: GlobalMarketData;
  coins: CoinMarket[];
  bitcoinChart: MarketChart;
  chartRange: TimeRange;
};

function buildDominanceSlices(percentages: Record<string, number>) {
  const ranked = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 5);
  const rest = ranked.slice(5).reduce((sum, [, value]) => sum + value, 0);

  return [
    ...top.map(([name, value]) => ({ name, value })),
    ...(rest > 0 ? [{ name: "others", value: rest }] : []),
  ];
}

export function OverviewBento({
  global,
  coins,
  bitcoinChart,
  chartRange,
}: OverviewBentoProps) {
  const marketCapUsd = global.total_market_cap.usd ?? 0;
  const volumeUsd = global.total_volume.usd ?? 0;
  const btcDominance = global.market_cap_percentage.btc ?? 0;
  const bitcoin = coins.find((coin) => coin.id === "bitcoin");

  const kpis = [
    {
      title: "Market Cap",
      hint: "Global USD",
      value: formatCompactUsd(marketCapUsd),
      change: global.market_cap_change_percentage_24h_usd,
    },
    {
      title: "24h Volume",
      hint: "Spot markets",
      value: formatCompactUsd(volumeUsd),
    },
    {
      title: "BTC Dominance",
      hint: "Share of cap",
      value: formatSharePercent(btcDominance),
    },
    {
      title: "Active Coins",
      hint: "Listed assets",
      value: formatInteger(global.active_cryptocurrencies),
    },
  ] as const;

  const priceSeries = bitcoinChart.prices.map((point) => ({
    timestamp: point.timestamp,
    price: point.value,
    label: formatChartTick(point.timestamp, chartRange),
  }));

  const volumeSeries = [...coins]
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 8)
    .map((coin) => ({
      symbol: coin.symbol.toUpperCase(),
      volume: coin.total_volume,
    }));

  const dominanceSlices = buildDominanceSlices(global.market_cap_percentage);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
      {kpis.map((kpi) => (
        <Card key={kpi.title} size="sm" className="xl:col-span-2">
          <CardHeader>
            <CardDescription>{kpi.title}</CardDescription>
            <CardTitle className="font-heading text-2xl tracking-tight tabular-nums">
              {kpi.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {"change" in kpi ? (
              <p className={`text-xs tabular-nums ${changeToneClass(kpi.change)}`}>
                {formatPercent(kpi.change)} 24h
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{kpi.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 xl:col-span-5">
        <CardHeader className="border-b">
          <CardTitle>Bitcoin price</CardTitle>
          <CardDescription>
            {bitcoin
              ? `${formatUsd(bitcoin.current_price)} · last ${chartRange}`
              : `Interactive series · last ${chartRange}`}
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-1">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range}
                  type="button"
                  size="xs"
                  variant={range === chartRange ? "secondary" : "ghost"}
                  aria-pressed={range === chartRange}
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          <BitcoinPriceChart data={priceSeries} />
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <CardTitle>Volume leaders</CardTitle>
          <CardDescription>24h spot volume by asset</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <VolumeLeadersChart data={volumeSeries} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 xl:col-span-5">
        <CardHeader className="border-b">
          <CardTitle>Top markets</CardTitle>
          <CardDescription>Price, volume, and market cap</CardDescription>
          <CardAction>
            <Badge variant="secondary">USD</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {coins.slice(0, 6).map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;

              return (
                <li key={coin.id} className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{coin.name}</p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {coin.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm tabular-nums">{formatUsd(coin.current_price)}</p>
                    <p className={`text-xs tabular-nums ${changeToneClass(change)}`}>
                      {formatPercent(change)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <CardTitle>Market dominance</CardTitle>
          <CardDescription>Share of global market cap</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <MarketDominanceChart data={dominanceSlices} />
        </CardContent>
      </Card>
    </div>
  );
}
