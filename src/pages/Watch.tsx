import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp,
  Check,
  Bookmark
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import UserAvatar from "@/components/UserAvatar";
import Comments from "@/components/Comments";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DBVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  embed_link: string;
  category: string;
  views: number;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    channel_name: string;
    channel_avatar: string | null;
    avatar_bg_color: string;
    avatar_text_color: string;
  };
}

const Watch = () => {
  const [searchParams] = useSearchParams();
  const videoID = searchParams.get("v");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [dbVideo, setDbVideo] = useState<DBVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!videoID) {
      navigate('/');
      return;
    }

    const fetchVideo = async () => {
      setLoading(true);

      // Fetch from database
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          embed_link,
          category,
          views,
          created_at,
          user_id,
          profiles (
            id,
            channel_name,
            channel_avatar,
            avatar_bg_color,
            avatar_text_color
          )
        `)
        .eq('id', videoID)
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setDbVideo(data as DBVideo);

      // Update views
      await supabase
        .from('videos')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', videoID);

      // Save to watch history if user is logged in
      if (user) {
        await supabase
          .from('watch_history')
          .insert({ video_id: videoID, user_id: user.id });
      }

      // Get like count
      const { count: likes } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoID);
      setLikeCount(likes || 0);

      // Get subscriber count
      const { count: subs } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', data.user_id);
      setSubscriberCount(subs || 0);

      // Check if user liked this video
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('video_id', videoID)
          .eq('user_id', user.id)
          .maybeSingle();
        setIsLiked(!!likeData);

        // Check if user subscribed
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('channel_id', data.user_id)
          .eq('subscriber_id', user.id)
          .maybeSingle();
        setIsSubscribed(!!subData);
      }

      // Fetch recommended videos from DB
      const { data: dbRecs } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          thumbnail_url,
          views,
          created_at,
          profiles (
            channel_name,
            channel_avatar,
            avatar_bg_color,
            avatar_text_color
          )
        `)
        .neq('id', videoID)
        .limit(8);

      const formattedRecs = (dbRecs || []).map((v: any) => ({
        videoID: v.id,
        title: v.title,
        channelName: v.profiles.channel_name,
        thumbnail: v.thumbnail_url,
        channelAvatar: v.profiles.channel_avatar,
        avatarBgColor: v.profiles.avatar_bg_color,
        avatarTextColor: v.profiles.avatar_text_color,
        views: `${v.views}`,
        uploadDate: new Date(v.created_at).toLocaleDateString('id-ID'),
        embedLink: '',
        description: '',
        category: ''
      }));

      setRecommendedVideos(formattedRecs);
      setLoading(false);
    };

    fetchVideo();
  }, [videoID, user, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast({ title: 'Login diperlukan', description: 'Silakan login untuk like video', variant: 'destructive' });
      return;
    }

    if (!dbVideo) return;

    if (isLiked) {
      await supabase.from('likes').delete().eq('video_id', dbVideo.id).eq('user_id', user.id);
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ video_id: dbVideo.id, user_id: user.id });
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({ title: 'Login diperlukan', description: 'Silakan login untuk subscribe', variant: 'destructive' });
      return;
    }

    if (!dbVideo) return;

    if (user.id === dbVideo.user_id) {
      toast({ title: 'Error', description: 'Tidak bisa subscribe channel sendiri', variant: 'destructive' });
      return;
    }

    if (isSubscribed) {
      await supabase.from('subscriptions').delete().eq('channel_id', dbVideo.user_id).eq('subscriber_id', user.id);
      setIsSubscribed(false);
      setSubscriberCount(prev => prev - 1);
    } else {
      await supabase.from('subscriptions').insert({ channel_id: dbVideo.user_id, subscriber_id: user.id });
      setIsSubscribed(true);
      setSubscriberCount(prev => prev + 1);
    }
  };

  // Handle search navigation
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      navigate(`/?search=${encodeURIComponent(value)}`);
    }
  };

  // Video not found
  if (!loading && !dbVideo) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] mt-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Determine which video to display
  const currentVideo = dbVideo ? {
    title: dbVideo.title,
    channelName: dbVideo.profiles.channel_name,
    channelAvatar: dbVideo.profiles.channel_avatar || undefined,
    avatarBgColor: dbVideo.profiles.avatar_bg_color,
    avatarTextColor: dbVideo.profiles.avatar_text_color,
    thumbnail: dbVideo.thumbnail_url,
    views: `${dbVideo.views}`,
    uploadDate: new Date(dbVideo.created_at).toLocaleDateString('id-ID'),
    embedLink: dbVideo.embed_link,
    videoID: dbVideo.id,
    description: dbVideo.description || '',
    subscriberCount: `${subscriberCount}`,
    likes: `${likeCount}`,
    category: dbVideo.category
  } : null;

  if (!currentVideo) return null;

  const isDBVideo = !!dbVideo;

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
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
                    {currentVideo.channelAvatar ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                        <img
                          src={currentVideo.channelAvatar}
                          alt={currentVideo.channelName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <UserAvatar
                        avatar={null}
                        channelName={currentVideo.channelName}
                        bgColor={currentVideo.avatarBgColor || '#6366f1'}
                        textColor={currentVideo.avatarTextColor || '#ffffff'}
                        size="lg"
                      />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/" className="font-semibold hover:text-primary transition-colors">
                      {currentVideo.channelName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {isDBVideo ? `${subscriberCount} subscriber` : currentVideo.subscriberCount + ' subscriber'}
                    </p>
                  </div>
                  {isDBVideo && (
                    <Button
                      onClick={handleSubscribe}
                      className={`rounded-xl px-5 transition-all duration-300 ${
                        isSubscribed
                          ? "bg-secondary text-secondary-foreground hover:bg-muted"
                          : "gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
                      }`}
                    >
                      {isSubscribed && <Check className="w-4 h-4 mr-1.5" />}
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-secondary/70 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      className={`rounded-none px-4 gap-2 h-10 ${isLiked ? "bg-primary/20 text-primary" : ""}`}
                      onClick={isDBVideo ? handleLike : undefined}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm font-medium">
                        {isDBVideo ? likeCount : currentVideo.likes}
                      </span>
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button
                      variant="ghost"
                      className="rounded-none px-4 h-10"
                    >
                      <ThumbsDown className="w-4 h-4" />
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

              {/* Comments Section */}
              {isDBVideo && dbVideo && (
                <Comments videoId={dbVideo.id} />
              )}
              
              {!isDBVideo && (
                <div className="mt-6 p-5 bg-secondary/30 rounded-2xl border border-border/50">
                  <h3 className="font-display font-semibold mb-4">Komentar</h3>
                  <p className="text-sm text-muted-foreground">
                    Komentar hanya tersedia untuk video yang diupload pengguna.
                  </p>
                </div>
              )}
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
