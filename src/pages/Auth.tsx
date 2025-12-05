import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [channelName, setChannelName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login gagal',
            description: error.message === 'Invalid login credentials' 
              ? 'Email atau password salah' 
              : error.message,
            variant: 'destructive'
          });
        } else {
          toast({ title: 'Berhasil masuk!' });
          navigate('/');
        }
      } else {
        if (!username || !channelName) {
          toast({
            title: 'Error',
            description: 'Username dan nama channel wajib diisi',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, username, channelName, avatarFile || undefined);
        if (error) {
          const errorMsg = error.message.includes('duplicate key') 
            ? 'Username sudah digunakan' 
            : error.message;
          toast({
            title: 'Registrasi gagal',
            description: errorMsg,
            variant: 'destructive'
          });
        } else {
          toast({ title: 'Akun berhasil dibuat!' });
          navigate('/');
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">SV</span>
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">StreamVibe</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/50 border-border/50 rounded-xl pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="channelName">Nama Channel</Label>
                  <Input
                    id="channelName"
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Channel Saya"
                    className="mt-1 bg-secondary/50 border-border/50 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label>Avatar Channel (Opsional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary/70 flex items-center justify-center border-2 border-dashed border-border">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
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
                        Upload Gambar
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Jika tidak upload, avatar akan dibuat otomatis dari inisial nama channel
                  </p>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-primary-foreground hover:opacity-90 rounded-xl h-11 font-semibold"
            >
              {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:underline font-semibold"
              >
                {isLogin ? 'Daftar' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
