import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketsSkeleton } from "@/components/markets/markets-skeleton";

export function WatchlistSkeleton() {
  return (
    <div className="space-y-4">
      {/* 4 KPI Metric Skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="mt-1.5 h-7 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <MarketsSkeleton />
    </div>
  );
}
