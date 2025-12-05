import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CategoryChips from '@/components/CategoryChips';
import VideoCard from '@/components/VideoCard';
import { supabase } from '@/integrations/supabase/client';
import { categories } from '@/data/videos';

interface ExploreVideo {
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

const Explore = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [videos, setVideos] = useState<ExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [activeCategory]);

  const fetchVideos = async () => {
    setLoading(true);
    let query = supabase
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
          channel_name,
          channel_avatar,
          avatar_bg_color,
          avatar_text_color
        )
      `)
      .order('views', { ascending: false });

    if (activeCategory !== 'Semua') {
      query = query.eq('category', activeCategory);
    }

    const { data, error } = await query;

    if (!error && data) {
      setVideos(data as ExploreVideo[]);
    }
    setLoading(false);
  };

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return video.title.toLowerCase().includes(query) || 
           video.profiles.channel_name.toLowerCase().includes(query);
  });

  const formatVideo = (video: ExploreVideo) => ({
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
        <CategoryChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <div className="p-4">
          <h1 className="text-2xl font-display font-bold mb-6">Jelajahi</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Tidak ada video</h2>
              <p className="text-muted-foreground">Coba kategori atau kata kunci lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={formatVideo(video)} layout="grid" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
