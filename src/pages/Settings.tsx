import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelName, setChannelName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (profile) {
      setChannelName(profile.channel_name);
    }
  }, [user, profile, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);

    try {
      let avatarUrl = profile.channel_avatar;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          avatarUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          channel_name: channelName,
          channel_avatar: avatarUrl
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({ title: 'Profil berhasil diperbarui!' });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memperbarui profil',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-14 transition-all duration-200 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}>
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-display font-bold mb-6">Pengaturan Channel</h1>

          <div className="glass-effect rounded-2xl p-6 border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <UserAvatar
                      avatar={profile.channel_avatar}
                      channelName={profile.channel_name}
                      bgColor={profile.avatar_bg_color}
                      textColor={profile.avatar_text_color}
                      size="xl"
                    />
                  )}
                </div>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/70 hover:bg-secondary transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    Ganti Avatar
                  </div>
                </label>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="mt-1 bg-secondary/30 border-border/50 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="mt-1 bg-secondary/30 border-border/50 rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">Username tidak dapat diubah</p>
              </div>

              <div>
                <Label htmlFor="channelName">Nama Channel</Label>
                <Input
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-primary-foreground hover:opacity-90 rounded-xl h-11 font-semibold"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
