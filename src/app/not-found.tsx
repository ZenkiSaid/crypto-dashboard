import Link from "next/link";
import { ArrowLeft, Compass, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center bg-background">
      <div className="relative mb-6 flex size-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/5 shadow-inner">
        <Hexagon className="size-10 text-primary animate-pulse" />
        <span className="absolute font-mono text-sm font-bold text-primary">404</span>
      </div>

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The market asset, analytical report, or page you are looking for doesn&apos;t
        exist or has been moved to another route.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" size="sm" className="gap-2">
          <Link href="/">
            <ArrowLeft className="size-4" />
            <span>Return to Dashboard</span>
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/markets">
            <Compass className="size-4" />
            <span>Explore Markets</span>
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-xs text-muted-foreground">
        <span>Crypto Analytics · Powered by CoinGecko API</span>
      </div>
    </div>
  );
}
