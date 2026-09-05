import { TIME_RANGES, type TimeRange } from "@/lib/coingecko";
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
import { Skeleton } from "@/components/ui/skeleton";

const KPI_CARDS = [
  { title: "Market Cap", hint: "Global USD" },
  { title: "24h Volume", hint: "Spot markets" },
  { title: "BTC Dominance", hint: "Share of cap" },
  { title: "Active Coins", hint: "Listed assets" },
] as const;

const DEFAULT_RANGE: TimeRange = "24h";

export function OverviewBento() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
      {KPI_CARDS.map((kpi) => (
        <Card key={kpi.title} size="sm" className="xl:col-span-2">
          <CardHeader>
            <CardDescription>{kpi.title}</CardDescription>
            <CardTitle className="font-heading text-2xl tracking-tight">
              <Skeleton className="h-8 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{kpi.hint}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 xl:col-span-5">
        <CardHeader className="border-b">
          <CardTitle>Bitcoin price</CardTitle>
          <CardDescription>
            Interactive series — CoinGecko market chart
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-1">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range}
                  type="button"
                  size="xs"
                  variant={range === DEFAULT_RANGE ? "secondary" : "ghost"}
                  aria-pressed={range === DEFAULT_RANGE}
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-64 flex-col justify-end gap-3 rounded-lg bg-muted/40 p-4">
            <Skeleton className="h-40 w-full rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <CardTitle>Volume leaders</CardTitle>
          <CardDescription>24h spot volume by asset</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-64 items-end gap-2 rounded-lg bg-muted/40 p-4">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton
                key={index}
                className="w-full rounded-sm"
                style={{ height: `${36 + ((index * 17) % 48)}%` }}
              />
            ))}
          </div>
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
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <CardTitle>Market dominance</CardTitle>
          <CardDescription>Share of global market cap</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-64 items-center justify-center rounded-lg bg-muted/40">
            <Skeleton className="size-40 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
