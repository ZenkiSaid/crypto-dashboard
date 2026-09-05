import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketsPage() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Markets</CardTitle>
        <CardDescription>
          Ranked assets from CoinGecko — table wiring comes next
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
