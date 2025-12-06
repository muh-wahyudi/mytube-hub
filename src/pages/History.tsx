import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Video } from "@/data/videos";

interface HistoryItem {
  id: string;
  video_id: string;
  watched_at: string;
  videos: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string;
    embed_link: string;
    category: string;
    views: number;
    created_at: string;
    profiles: {
      channel_name: string;
      channel_avatar: string | null;
      avatar_bg_color: string;
      avatar_text_color: string;
    };
  };
}

const History = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyVideos, setHistoryVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          id,
          video_id,
          watched_at,
          videos (
            id,
            title,
            description,
            thumbnail_url,
            embed_link,
            category,
            views,
            created_at,
            profiles (
              channel_name,
              channel_avatar,
              avatar_bg_color,
              avatar_text_color
            )
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        setLoading(false);
        return;
      }

      // Remove duplicates (keep most recent)
      const seen = new Set<string>();
      const uniqueHistory = (data as unknown as HistoryItem[])?.filter(item => {
        if (!item.videos || seen.has(item.video_id)) return false;
        seen.add(item.video_id);
        return true;
      }) || [];

      const formattedVideos: Video[] = uniqueHistory.map(item => ({
        videoID: item.videos.id,
        title: item.videos.title,
        channelName: item.videos.profiles.channel_name,
        channelAvatar: item.videos.profiles.channel_avatar || undefined,
        avatarBgColor: item.videos.profiles.avatar_bg_color,
        avatarTextColor: item.videos.profiles.avatar_text_color,
        thumbnail: item.videos.thumbnail_url,
        views: `${item.videos.views} tayangan`,
        uploadDate: getRelativeTime(item.watched_at),
        embedLink: item.videos.embed_link,
        description: item.videos.description || '',
        category: item.videos.category
      }));

      setHistoryVideos(formattedVideos);
      setLoading(false);
    };

    fetchHistory();
  }, [user, navigate]);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const clearHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: 'Gagal menghapus history', variant: 'destructive' });
      return;
    }

    setHistoryVideos([]);
    toast({ title: 'Berhasil', description: 'History berhasil dihapus' });
  };

  const filteredVideos = historyVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-14 transition-all duration-200 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
                <HistoryIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">History</h1>
                <p className="text-sm text-muted-foreground">{historyVideos.length} video ditonton</p>
              </div>
            </div>
            {historyVideos.length > 0 && (
              <Button
                variant="outline"
                className="rounded-xl gap-2"
                onClick={clearHistory}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Semua
              </Button>
            )}
          </div>

          {loading ? (
            <div className={`
              grid gap-x-5 gap-y-10
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              ${sidebarOpen ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'xl:grid-cols-4 2xl:grid-cols-5'}
            `}>
              {Array.from({ length: 8 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Belum ada history</h3>
              <p className="text-muted-foreground">Video yang Anda tonton akan muncul di sini</p>
            </div>
          ) : (
            <div className={`
              grid gap-x-5 gap-y-10
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              ${sidebarOpen ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'xl:grid-cols-4 2xl:grid-cols-5'}
            `}>
              {filteredVideos.map((video, index) => (
                <div key={video.videoID} style={{ animationDelay: `${index * 50}ms` }}>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
