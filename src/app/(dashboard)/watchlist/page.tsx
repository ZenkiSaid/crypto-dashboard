import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WatchlistPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>
          Track selected assets here once live market data is connected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No assets yet. This view will reuse the CoinGecko client in{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
            src/lib/coingecko
          </code>
          .
        </p>
      </CardContent>
    </Card>
  );
}
