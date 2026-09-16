import type {
  CoinMarket,
  GlobalMarketData,
  MarketChart,
  TimeRange,
} from "@/lib/coingecko";
import {
  changeToneClass,
  formatCompactCurrency,
  formatInteger,
  formatPercent,
  formatSharePercent,
  type Currency,
} from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BitcoinPriceCard } from "@/components/dashboard/bitcoin-price-card";
import { TopMarketsCard } from "@/components/dashboard/top-markets-card";
import {
  MarketDominanceChart,
  VolumeLeadersChart,
} from "@/components/dashboard/overview-charts";

export type OverviewBentoProps = {
  global: GlobalMarketData;
  coins: CoinMarket[];
  bitcoinChart: MarketChart;
  chartRange: TimeRange;
  currency?: Currency;
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
  currency = "usd",
}: OverviewBentoProps) {
  const marketCap =
    global.total_market_cap[currency] ?? global.total_market_cap.usd ?? 0;
  const volume =
    global.total_volume[currency] ?? global.total_volume.usd ?? 0;
  const btcDominance = global.market_cap_percentage.btc ?? 0;
  const bitcoin = coins.find((coin) => coin.id === "bitcoin");

  const kpis = [
    {
      title: "Market Cap",
      hint: `Global ${currency.toUpperCase()}`,
      value: formatCompactCurrency(marketCap, currency),
      change: global.market_cap_change_percentage_24h_usd,
    },
    {
      title: "24h Volume",
      hint: "Spot markets",
      value: formatCompactCurrency(volume, currency),
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

      <BitcoinPriceCard
        initialChart={bitcoinChart}
        initialRange={chartRange}
        bitcoin={bitcoin}
        currency={currency}
      />

      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <CardTitle>Volume leaders</CardTitle>
          <CardDescription>24h spot volume by asset</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <VolumeLeadersChart data={volumeSeries} currency={currency} />
        </CardContent>
      </Card>

      <TopMarketsCard coins={coins} currency={currency} />

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
