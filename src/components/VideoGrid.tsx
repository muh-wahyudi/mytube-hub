import VideoCard from "./VideoCard";
import type { Video } from "@/data/videos";
import { Search } from "lucide-react";

interface VideoGridProps {
  videos: Video[];
  sidebarOpen: boolean;
}

const VideoGrid = ({ videos, sidebarOpen }: VideoGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
        <div className="w-24 h-24 mb-6 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
          <Search className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">Tidak ada hasil</h3>
        <p className="text-muted-foreground">Coba kata kunci lain atau hapus filter</p>
      </div>
    );
  }

  return (
    <div className={`
      grid gap-x-5 gap-y-10 px-4 py-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      ${sidebarOpen ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'xl:grid-cols-4 2xl:grid-cols-5'}
    `}>
      {videos.map((video, index) => (
        <div key={video.videoID} style={{ animationDelay: `${index * 50}ms` }}>
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
