import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsDashboardLoading() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="bg-card rounded-lg shadow-sm border">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <Skeleton className="size-8 w-40 mb-2" />
            <Skeleton className="size-8 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-32 ml-4" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mt-2">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-32 mt-2 md:mt-0" />
          </div>
        </div>
        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Table Header Skeleton */}
            <div className="flex items-center bg-muted px-4 py-2 rounded-t-md">
              <Skeleton className="size-5 mr-4" />
              <Skeleton className="size-5 mr-4" />
              <Skeleton className="size-5 mr-4" />
              <Skeleton className="size-5" />
            </div>
            {/* Table Rows Skeleton */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center px-4 py-3 border-b border-border"
              >
                <Skeleton className="size-5 mr-4" />
                <div className="flex items-center gap-3 min-w-0 mr-4">
                  <Skeleton className="size-5" />
                  <Skeleton className="size-5" />
                </div>
                <Skeleton className="h-5 w-24 mr-4" />
                <Skeleton className="h-5 w-24 mr-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
