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
  Check
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
        <div className="flex items-center justify-center h-[calc(100vh-56px)] mt-14">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Video tidak ditemukan</h1>
            <p className="text-muted-foreground mb-4">Video yang Anda cari tidak tersedia</p>
            <Link to="/">
              <Button variant="default" className="bg-primary hover:bg-mytube-red-hover">
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

      <main className={`pt-14 transition-all duration-200 ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}`}>
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1800px] mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={currentVideo.embedLink}
                title={currentVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="mt-3">
              <h1 className="text-xl font-bold leading-snug">{currentVideo.title}</h1>

              {/* Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3">
                {/* Channel Info */}
                <div className="flex items-center gap-3">
                  <Link to="/">
                    <img
                      src={currentVideo.channelAvatar}
                      alt={currentVideo.channelName}
                      className="w-10 h-10 rounded-full"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/" className="font-medium hover:underline">
                      {currentVideo.channelName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {currentVideo.subscriberCount} subscriber
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`rounded-full px-4 ${
                      isSubscribed
                        ? "bg-secondary text-secondary-foreground hover:bg-muted"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {isSubscribed && <Check className="w-4 h-4 mr-1" />}
                    {isSubscribed ? "Berlangganan" : "Subscribe"}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-secondary rounded-full">
                    <Button
                      variant="ghost"
                      className={`rounded-l-full px-4 gap-2 ${liked === "like" ? "bg-muted" : ""}`}
                      onClick={() => setLiked(liked === "like" ? null : "like")}
                    >
                      <ThumbsUp className={`w-5 h-5 ${liked === "like" ? "fill-current" : ""}`} />
                      <span>{currentVideo.likes}</span>
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button
                      variant="ghost"
                      className={`rounded-r-full px-4 ${liked === "dislike" ? "bg-muted" : ""}`}
                      onClick={() => setLiked(liked === "dislike" ? null : "dislike")}
                    >
                      <ThumbsDown className={`w-5 h-5 ${liked === "dislike" ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <Button variant="secondary" className="rounded-full gap-2">
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </Button>

                  <Button variant="secondary" className="rounded-full gap-2">
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>

                  <Button variant="secondary" size="icon" className="rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 p-3 bg-secondary rounded-xl">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <span>{currentVideo.views} tayangan</span>
                  <span>•</span>
                  <span>{currentVideo.uploadDate}</span>
                </div>
                <div className={`text-sm ${!descriptionExpanded && "line-clamp-2"}`}>
                  <p>{currentVideo.description}</p>
                  {descriptionExpanded && (
                    <div className="mt-4 space-y-2">
                      <p className="text-muted-foreground">
                        #MyTube #{currentVideo.category} #Video
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="mt-2 p-0 h-auto font-medium text-sm"
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
              <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                <h3 className="font-medium mb-4">Komentar</h3>
                <p className="text-sm text-muted-foreground">
                  Komentar dinonaktifkan untuk video ini.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="lg:w-[400px] xl:w-[420px] flex-shrink-0">
            <h3 className="font-medium mb-4 px-1 hidden lg:block">Video Rekomendasi</h3>
            <div className="space-y-3">
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
