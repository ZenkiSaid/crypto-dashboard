import {
  CoinGeckoError,
  getCoinsMarkets,
  getGlobalMarket,
  getMarketChart,
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

const CHART_RANGE = "7d" as const;

export default async function OverviewPage() {
  try {
    const [global, coins, bitcoinChart] = await Promise.all([
      getGlobalMarket(),
      getCoinsMarkets({ perPage: 8 }),
      getMarketChart({ coinId: "bitcoin", range: CHART_RANGE }),
    ]);

    if (!global.data || coins.length === 0 || bitcoinChart.prices.length === 0) {
      throw new Error("CoinGecko returned an incomplete payload.");
    }

    return (
      <OverviewBento
        global={global.data}
        coins={coins}
        bitcoinChart={bitcoinChart}
        chartRange={CHART_RANGE}
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
