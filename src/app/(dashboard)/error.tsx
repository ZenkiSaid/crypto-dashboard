"use client";

import { useEffect } from "react";
import { AlertTriangle, Clock, Key, RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  const errorMessage = error.message ?? "";
  const isRateLimited =
    errorMessage.includes("429") ||
    errorMessage.toLowerCase().includes("rate limit") ||
    errorMessage.toLowerCase().includes("too many requests");

  const isNetworkError =
    errorMessage.toLowerCase().includes("failed to fetch") ||
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("econnrefused") ||
    errorMessage.toLowerCase().includes("enotfound");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border/80 shadow-lg">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${
                isRateLimited
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : isNetworkError
                    ? "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {isRateLimited ? (
                <Clock className="size-5" />
              ) : isNetworkError ? (
                <WifiOff className="size-5" />
              ) : (
                <AlertTriangle className="size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold">
                {isRateLimited
                  ? "CoinGecko API Rate Limit Reached"
                  : isNetworkError
                    ? "Connection to CoinGecko Failed"
                    : "Unable to load market dashboard"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isRateLimited
                  ? "Public Demo tier has a 10–30 req/min threshold"
                  : isNetworkError
                    ? "Could not establish connection with CoinGecko servers"
                    : "An unexpected error occurred while processing market data"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0 text-sm">
          {isRateLimited ? (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">
                Why is this happening?
              </p>
              <p className="mt-1">
                The public CoinGecko API strictly throttles requests. Please wait
                about 60 seconds before retrying.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <Key className="size-3.5 shrink-0" />
                <span>
                  Tip: Add <code className="text-foreground">COINGECKO_API_KEY</code> in{" "}
                  <code className="text-foreground">.env.local</code> for higher limits.
                </span>
              </div>
            </div>
          ) : isNetworkError ? (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">
                Network connection issue
              </p>
              <p className="mt-1">
                Verify that your device is connected to the internet and that
                firewall or ad-blocker rules are not blocking api.coingecko.com.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs font-mono text-muted-foreground">
              {errorMessage || "Unknown error encountered."}
            </div>
          )}

          {error.digest && (
            <p className="font-mono text-[10px] text-muted-foreground/70">
              Digest: {error.digest}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            Full reload
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => reset()}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Try again</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
