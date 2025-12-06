import { Skeleton } from "@/components/ui/skeleton";

interface VideoCardSkeletonProps {
  layout?: "grid" | "list";
}

const VideoCardSkeleton = ({ layout = "grid" }: VideoCardSkeletonProps) => {
  if (layout === "list") {
    return (
      <div className="flex gap-3 p-2">
        <Skeleton className="flex-shrink-0 w-44 aspect-video rounded-xl" />
        <div className="flex-1 py-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2 mt-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <Skeleton className="aspect-video rounded-2xl" />

      {/* Video Info */}
      <div className="flex gap-3 mt-4">
        {/* Channel Avatar */}
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

        {/* Text Info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
