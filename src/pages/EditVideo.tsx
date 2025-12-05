import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image, X } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { categories } from '@/data/videos';

const EditVideo = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchVideo();
  }, [user, id, navigate]);

  const fetchVideo = async () => {
    if (!id || !user) return;

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      toast({ title: 'Error', description: 'Video tidak ditemukan', variant: 'destructive' });
      navigate('/my-videos');
      return;
    }

    setTitle(data.title);
    setEmbedLink(data.embed_link);
    setDescription(data.description || '');
    setCategory(data.category);
    setCurrentThumbnail(data.thumbnail_url);
    setFetching(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    setLoading(true);

    try {
      let thumbnailUrl = currentThumbnail;

      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(filePath, thumbnailFile);
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(filePath);
          thumbnailUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase
        .from('videos')
        .update({
          title,
          embed_link: embedLink,
          description,
          category,
          thumbnail_url: thumbnailUrl
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Video berhasil diperbarui!' });
      navigate('/my-videos');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memperbarui video',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat !== 'Semua');

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

      <main className={`pt-14 transition-all duration-200 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-display font-bold mb-6">Edit Video</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail */}
            <div>
              <Label>Thumbnail</Label>
              <div className="mt-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/50">
                  <img 
                    src={thumbnailPreview || currentThumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover" 
                  />
                  {thumbnailPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <label className="cursor-pointer block mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/70 hover:bg-secondary transition-colors text-sm">
                    <Image className="w-4 h-4" />
                    Ganti Thumbnail
                  </div>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Judul Video</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="embedLink">Embed Link</Label>
              <Input
                id="embedLink"
                value={embedLink}
                onChange={(e) => setEmbedLink(e.target.value)}
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 bg-secondary/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl min-h-[120px]"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/my-videos')}
                className="flex-1 rounded-xl h-11"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 gradient-bg text-primary-foreground hover:opacity-90 rounded-xl h-11 font-semibold"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditVideo;
