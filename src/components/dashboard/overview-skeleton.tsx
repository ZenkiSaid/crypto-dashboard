import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewBentoSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
      {/* 4 KPI Cards */}
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} size="sm" className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-1 h-7 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}

      {/* Bitcoin Price Chart (5 cols) */}
      <Card className="md:col-span-2 xl:col-span-5">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <CardAction>
            <div className="flex items-center gap-1">
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-md" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Volume Leaders (3 cols) */}
      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Top Markets (5 cols) */}
      <Card className="md:col-span-2 xl:col-span-5">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <CardAction>
            <Skeleton className="h-5 w-12 rounded-full" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {/* Toolbar Skeleton */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-7 w-full sm:w-56 rounded-md" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
          </div>

          {/* 6 Asset Rows */}
          <div className="divide-border/40 divide-y">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="-mx-2 flex items-center gap-3 px-2 py-2 first:pt-1 last:pb-0"
              >
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="shrink-0 space-y-1.5 text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                  <Skeleton className="ml-auto h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Dominance (3 cols) */}
      <Card className="xl:col-span-3">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-44" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-64 items-center justify-center gap-4">
            <Skeleton className="size-40 rounded-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-2.5 rounded-full" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
