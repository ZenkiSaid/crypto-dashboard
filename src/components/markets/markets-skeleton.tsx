import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketsSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-3 border-b bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-full sm:w-72 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-7 w-8 rounded-md" />
            <Skeleton className="h-7 w-8 rounded-md" />
            <Skeleton className="h-7 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="py-3 pl-3 pr-1 w-8 text-center">
                  <Skeleton className="mx-auto size-3.5 rounded" />
                </th>
                <th className="py-3 px-2 w-10 text-center">#</th>
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">24h %</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">7d %</th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">24h Volume</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-3 pr-4 pl-3 text-center w-36">Last 7 Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {Array.from({ length: 10 }, (_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 pl-3 pr-1 text-center">
                    <Skeleton className="mx-auto size-3.5 rounded" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Skeleton className="mx-auto h-3.5 w-4" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="size-7 rounded-full shrink-0" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-2.5 w-10" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <Skeleton className="ml-auto h-3.5 w-16" />
                  </td>
                  <td className="py-4 px-3 text-right">
                    <Skeleton className="ml-auto h-3.5 w-12" />
                  </td>
                  <td className="py-4 px-3 text-right hidden md:table-cell">
                    <Skeleton className="ml-auto h-3.5 w-12" />
                  </td>
                  <td className="py-4 px-3 text-right hidden lg:table-cell">
                    <Skeleton className="ml-auto h-3.5 w-16" />
                  </td>
                  <td className="py-4 px-3 text-right hidden sm:table-cell">
                    <Skeleton className="ml-auto h-3.5 w-20" />
                  </td>
                  <td className="py-4 pr-4 pl-3 text-center">
                    <Skeleton className="mx-auto h-7 w-24 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Pagination Skeleton */}
      <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-44" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
