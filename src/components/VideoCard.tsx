import { Link } from "react-router-dom";
import { MoreVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
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
        className="flex gap-3 group animate-fade-in p-2 rounded-xl hover:bg-secondary/50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-44 aspect-video rounded-xl overflow-hidden bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stream-overlay/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-stream-overlay/90 text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm">
              {video.duration}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-glow">
              <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            {video.channelName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
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
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted card-hover">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stream-overlay/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-stream-overlay/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
              {video.duration}
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-glow transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-3 mt-4">
        {/* Channel Avatar */}
        <Link to="/" className="flex-shrink-0">
          {video.channelAvatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
              <img
                src={video.channelAvatar}
                alt={video.channelName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <UserAvatar
              avatar={null}
              channelName={video.channelName}
              bgColor={video.avatarBgColor || '#6366f1'}
              textColor={video.avatarTextColor || '#ffffff'}
              size="md"
              className="ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
            />
          )}
        </Link>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/watch?v=${video.videoID}`}>
              <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {video.title}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/" className="block mt-1.5">
            <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {video.channelName}
            </p>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">
            {video.views} tayangan • {video.uploadDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
