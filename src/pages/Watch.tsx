import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp,
  Check,
  Bookmark
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";

const Watch = () => {
  const [searchParams] = useSearchParams();
  const videoID = searchParams.get("v");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);

  const currentVideo = useMemo(() => {
    return videos.find((v) => v.videoID === videoID);
  }, [videoID]);

  const recommendedVideos = useMemo(() => {
    return videos.filter((v) => v.videoID !== videoID).slice(0, 8);
  }, [videoID]);

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] mt-16">
          <div className="text-center px-4">
            <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
              <span className="text-4xl">🎬</span>
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">Video tidak ditemukan</h1>
            <p className="text-muted-foreground mb-6">Video yang Anda cari tidak tersedia</p>
            <Link to="/">
              <Button className="rounded-xl gradient-bg text-primary-foreground hover:opacity-90 px-6">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1800px] mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0 animate-fade-in">
            {/* Video Player */}
            <div className="relative aspect-video bg-stream-overlay rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={currentVideo.embedLink}
                title={currentVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="mt-5">
              <h1 className="text-xl md:text-2xl font-display font-bold leading-snug">{currentVideo.title}</h1>

              {/* Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                {/* Channel Info */}
                <div className="flex items-center gap-4">
                  <Link to="/">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <img
                        src={currentVideo.channelAvatar}
                        alt={currentVideo.channelName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/" className="font-semibold hover:text-primary transition-colors">
                      {currentVideo.channelName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {currentVideo.subscriberCount} subscriber
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`rounded-xl px-5 transition-all duration-300 ${
                      isSubscribed
                        ? "bg-secondary text-secondary-foreground hover:bg-muted"
                        : "gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
                    }`}
                  >
                    {isSubscribed && <Check className="w-4 h-4 mr-1.5" />}
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-secondary/70 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      className={`rounded-none px-4 gap-2 h-10 ${liked === "like" ? "bg-primary/20 text-primary" : ""}`}
                      onClick={() => setLiked(liked === "like" ? null : "like")}
                    >
                      <ThumbsUp className={`w-4 h-4 ${liked === "like" ? "fill-current" : ""}`} />
                      <span className="text-sm font-medium">{currentVideo.likes}</span>
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button
                      variant="ghost"
                      className={`rounded-none px-4 h-10 ${liked === "dislike" ? "bg-accent/20 text-accent" : ""}`}
                      onClick={() => setLiked(liked === "dislike" ? null : "dislike")}
                    >
                      <ThumbsDown className={`w-4 h-4 ${liked === "dislike" ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <Button variant="secondary" className="rounded-xl gap-2 h-10">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Share</span>
                  </Button>

                  <Button variant="secondary" className="rounded-xl gap-2 h-10">
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Save</span>
                  </Button>

                  <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 p-4 bg-secondary/50 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3 text-sm font-medium mb-3">
                  <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary">{currentVideo.views} tayangan</span>
                  <span className="text-muted-foreground">{currentVideo.uploadDate}</span>
                </div>
                <div className={`text-sm leading-relaxed ${!descriptionExpanded && "line-clamp-2"}`}>
                  <p>{currentVideo.description}</p>
                  {descriptionExpanded && (
                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">#{currentVideo.category}</span>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">#StreamVibe</span>
                        <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">#Video</span>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="mt-3 p-0 h-auto font-semibold text-sm hover:text-primary"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? (
                    <>
                      Tampilkan lebih sedikit <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Tampilkan lebih banyak <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Comments Section Placeholder */}
              <div className="mt-6 p-5 bg-secondary/30 rounded-2xl border border-border/50">
                <h3 className="font-display font-semibold mb-4">Komentar</h3>
                <p className="text-sm text-muted-foreground">
                  Komentar dinonaktifkan untuk video ini.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="lg:w-[400px] xl:w-[420px] flex-shrink-0 animate-slide-up">
            <h3 className="font-display font-semibold mb-4 px-1 hidden lg:block">Rekomendasi</h3>
            <div className="space-y-2">
              {recommendedVideos.map((video) => (
                <VideoCard key={video.videoID} video={video} layout="list" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
