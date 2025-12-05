import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoCard from '@/components/VideoCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LikedVideo {
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
    channel_name: string;
    channel_avatar: string | null;
    avatar_bg_color: string;
    avatar_text_color: string;
  };
}

const LikedVideos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLikedVideos();
  }, [user, navigate]);

  const fetchLikedVideos = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('likes')
      .select(`
        video_id,
        videos (
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
            channel_name,
            channel_avatar,
            avatar_bg_color,
            avatar_text_color
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const likedVideos = data
        .map((item: any) => item.videos)
        .filter((v: any) => v !== null);
      setVideos(likedVideos);
    }
    setLoading(false);
  };

  const formatVideo = (video: LikedVideo) => ({
    videoID: video.id,
    title: video.title,
    channelName: video.profiles.channel_name,
    thumbnail: video.thumbnail_url,
    channelAvatar: video.profiles.channel_avatar || '',
    avatarBgColor: video.profiles.avatar_bg_color,
    avatarTextColor: video.profiles.avatar_text_color,
    views: `${video.views}`,
    uploadDate: new Date(video.created_at).toLocaleDateString('id-ID'),
    embedLink: video.embed_link,
    description: video.description || '',
    category: video.category
  });

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
          <h1 className="text-2xl font-display font-bold mb-6">Video yang Disukai</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❤️</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Belum ada video yang disukai</h2>
              <p className="text-muted-foreground">Video yang kamu like akan muncul di sini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={formatVideo(video)} layout="grid" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LikedVideos;
