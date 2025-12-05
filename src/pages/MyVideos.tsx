import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Eye, ThumbsUp } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  views: number;
  created_at: string;
}

const MyVideos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchVideos();
  }, [user, navigate]);

  const fetchVideos = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, views, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Gagal memuat video', variant: 'destructive' });
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Yakin ingin menghapus video ini?')) return;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      toast({ title: 'Error', description: 'Gagal menghapus video', variant: 'destructive' });
    } else {
      toast({ title: 'Video berhasil dihapus' });
      setVideos(videos.filter(v => v.id !== videoId));
    }
  };

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
            <h1 className="text-2xl font-display font-bold">Video Saya</h1>
            <Link to="/upload">
              <Button className="gradient-bg text-primary-foreground hover:opacity-90 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📹</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Belum ada video</h2>
              <p className="text-muted-foreground mb-4">Upload video pertamamu sekarang!</p>
              <Link to="/upload">
                <Button className="gradient-bg text-primary-foreground hover:opacity-90 rounded-xl">
                  Upload Video
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                  <Link to={`/watch?v=${video.id}`} className="flex-shrink-0">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-40 h-24 object-cover rounded-xl"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/watch?v=${video.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {video.views} views
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: id })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/edit-video/${video.id}`}>
                      <Button variant="secondary" size="icon" className="rounded-xl">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="rounded-xl hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
