import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserAvatar from '@/components/UserAvatar';
import VideoCard from '@/components/VideoCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Channel {
  id: string;
  channel_name: string;
  channel_avatar: string | null;
  avatar_bg_color: string;
  avatar_text_color: string;
}

interface SubVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  embed_link: string;
  category: string;
  views: number;
  created_at: string;
  user_id: string;
  profiles: Channel;
}

const Subscriptions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<SubVideo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSubscriptions();
  }, [user, navigate]);

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    // Get subscribed channels
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select(`
        channel_id,
        profiles:channel_id (
          id,
          channel_name,
          channel_avatar,
          avatar_bg_color,
          avatar_text_color
        )
      `)
      .eq('subscriber_id', user.id);

    if (!subsError && subs) {
      const channelsList = subs.map((s: any) => s.profiles).filter((c: any) => c !== null);
      setChannels(channelsList);

      // Get videos from subscribed channels
      if (channelsList.length > 0) {
        const channelIds = channelsList.map((c: Channel) => c.id);
        const { data: vids, error: vidsError } = await supabase
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
          .in('user_id', channelIds)
          .order('created_at', { ascending: false });

        if (!vidsError && vids) {
          setVideos(vids as SubVideo[]);
        }
      }
    }
    setLoading(false);
  };

  const formatVideo = (video: SubVideo) => ({
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
          <h1 className="text-2xl font-display font-bold mb-6">Subscription</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : channels.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📺</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Belum ada subscription</h2>
              <p className="text-muted-foreground">Subscribe channel untuk melihat video terbaru mereka</p>
            </div>
          ) : (
            <>
              {/* Subscribed Channels */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Channel yang Disubscribe</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {channels.map((channel) => (
                    <Link 
                      key={channel.id} 
                      to={`/channel/${channel.id}`}
                      className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                      <UserAvatar
                        avatar={channel.channel_avatar}
                        channelName={channel.channel_name}
                        bgColor={channel.avatar_bg_color}
                        textColor={channel.avatar_text_color}
                        size="lg"
                      />
                      <span className="text-xs text-center truncate w-full">{channel.channel_name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Videos from Subscribed Channels */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Video Terbaru</h2>
                {videos.length === 0 ? (
                  <p className="text-muted-foreground">Channel yang kamu subscribe belum upload video</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={formatVideo(video)} layout="grid" />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Subscriptions;
