import VideoCard from "./VideoCard";
import type { Video } from "@/data/videos";

interface VideoGridProps {
  videos: Video[];
  sidebarOpen: boolean;
}

const VideoGrid = ({ videos, sidebarOpen }: VideoGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Tidak ada hasil</h3>
        <p className="text-muted-foreground">Coba kata kunci lain atau hapus filter</p>
      </div>
    );
  }

  return (
    <div className={`
      grid gap-x-4 gap-y-8 px-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      ${sidebarOpen ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'xl:grid-cols-4 2xl:grid-cols-5'}
    `}>
      {videos.map((video) => (
        <VideoCard key={video.videoID} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
