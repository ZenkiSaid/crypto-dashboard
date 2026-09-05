import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OverviewLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} size="sm" className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
          </CardHeader>
        </Card>
      ))}
      <Card className="md:col-span-2 xl:col-span-5">
        <CardContent className="pt-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card className="xl:col-span-3">
        <CardContent className="pt-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
