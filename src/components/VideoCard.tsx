import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/data/videos";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "list";
}

const VideoCard = ({ video, layout = "grid" }: VideoCardProps) => {
  if (layout === "list") {
    return (
      <Link
        to={`/watch?v=${video.videoID}`}
        className="flex gap-2 group animate-fade-in"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-1 right-1 bg-mytube-overlay/80 text-primary-foreground text-xs font-medium px-1 rounded">
            {video.duration}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-foreground">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {video.channelName}
          </p>
          <p className="text-xs text-muted-foreground">
            {video.views} • {video.uploadDate}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group animate-fade-in">
      <Link to={`/watch?v=${video.videoID}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-mytube-overlay/80 text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
          {/* Progress bar placeholder */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
            <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-[3000ms]" />
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="w-9 h-9 rounded-full"
          />
        </Link>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/watch?v=${video.videoID}`}>
              <h3 className="text-sm font-medium line-clamp-2 leading-snug group-hover:text-foreground">
                {video.title}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <Link to="/" className="block mt-1">
            <p className="text-sm text-muted-foreground hover:text-foreground">
              {video.channelName}
            </p>
          </Link>
          <p className="text-sm text-muted-foreground">
            {video.views} tayangan • {video.uploadDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
