import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image, X } from 'lucide-react';
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

const Upload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

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
    
    if (!thumbnailFile) {
      toast({
        title: 'Error',
        description: 'Thumbnail wajib diupload',
        variant: 'destructive'
      });
      return;
    }

    if (!user || !profile) return;
    
    setLoading(true);

    try {
      // Upload thumbnail
      const fileExt = thumbnailFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, thumbnailFile);
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      // Insert video
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title,
          embed_link: embedLink,
          description,
          category,
          thumbnail_url: urlData.publicUrl
        });

      if (insertError) throw insertError;

      toast({ title: 'Video berhasil diupload!' });
      navigate('/my-videos');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal mengupload video',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat !== 'Semua');

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
          <h1 className="text-2xl font-display font-bold mb-6">Upload Video</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail Upload */}
            <div>
              <Label>Thumbnail (Wajib)</Label>
              <div className="mt-2">
                {thumbnailPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/50">
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
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
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <div className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 bg-secondary/30 transition-colors">
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <span className="text-muted-foreground">Klik untuk upload thumbnail</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Judul Video (Wajib)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul video"
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="embedLink">Embed Link (Wajib)</Label>
              <Input
                id="embedLink"
                value={embedLink}
                onChange={(e) => setEmbedLink(e.target.value)}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Contoh: https://www.youtube.com/embed/dQw4w9WgXcQ
              </p>
            </div>

            <div>
              <Label htmlFor="category">Kategori (Wajib)</Label>
              <Select value={category} onValueChange={setCategory} required>
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
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi video..."
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-primary-foreground hover:opacity-90 rounded-xl h-11 font-semibold"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {loading ? 'Mengupload...' : 'Upload Video'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;
