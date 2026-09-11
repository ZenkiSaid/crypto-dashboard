import {
  CoinGeckoError,
  getCoinsMarkets,
  getGlobalMarket,
  getMarketChart,
  TIME_RANGES,
  type TimeRange,
} from "@/lib/coingecko";
import { OverviewBento } from "@/components/dashboard/overview-bento";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 60;

const DEFAULT_RANGE: TimeRange = "7d";

export type OverviewPageProps = {
  searchParams?: Promise<{ range?: string }>;
};

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const requestedRange = resolvedParams?.range;
  const chartRange: TimeRange =
    requestedRange && TIME_RANGES.includes(requestedRange as TimeRange)
      ? (requestedRange as TimeRange)
      : DEFAULT_RANGE;

  try {
    const [global, coins, bitcoinChart] = await Promise.all([
      getGlobalMarket(),
      getCoinsMarkets({ perPage: 8 }),
      getMarketChart({ coinId: "bitcoin", range: chartRange }),
    ]);

    if (!global.data || coins.length === 0 || bitcoinChart.prices.length === 0) {
      throw new Error("CoinGecko returned an incomplete payload.");
    }

    return (
      <OverviewBento
        global={global.data}
        coins={coins}
        bitcoinChart={bitcoinChart}
        chartRange={chartRange}
      />
    );
  } catch (error) {
    const message =
      error instanceof CoinGeckoError
        ? `CoinGecko returned ${error.status} for ${error.path}.`
        : "Market data is unavailable right now.";

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load markets</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The public CoinGecko API is rate-limited. Retry in a minute, or add{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
              COINGECKO_API_KEY
            </code>{" "}
            in <code className="font-mono text-xs">.env.local</code>.
          </p>
        </CardContent>
      </Card>
    );
  }
}
