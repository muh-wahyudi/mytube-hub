import VideoCardSkeleton from "./VideoCardSkeleton";

interface VideoGridSkeletonProps {
  sidebarOpen: boolean;
  count?: number;
}

const VideoGridSkeleton = ({ sidebarOpen, count = 12 }: VideoGridSkeletonProps) => {
  return (
    <div className={`
      grid gap-x-5 gap-y-10 px-4 py-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      ${sidebarOpen ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'xl:grid-cols-4 2xl:grid-cols-5'}
    `}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default VideoGridSkeleton;
