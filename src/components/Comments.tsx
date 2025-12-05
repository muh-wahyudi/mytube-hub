import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    channel_name: string;
    channel_avatar: string | null;
    avatar_bg_color: string;
    avatar_text_color: string;
  };
}

interface CommentsProps {
  videoId: string;
}

const Comments = ({ videoId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          channel_name,
          channel_avatar,
          avatar_bg_color,
          avatar_text_color
        )
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: user.id,
        content: newComment.trim()
      })
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          channel_name,
          channel_avatar,
          avatar_bg_color,
          avatar_text_color
        )
      `)
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Gagal mengirim komentar', variant: 'destructive' });
    } else if (data) {
      setComments([data as Comment, ...comments]);
      setNewComment('');
    }
    
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast({ title: 'Error', description: 'Gagal menghapus komentar', variant: 'destructive' });
    } else {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-display font-semibold mb-4">{comments.length} Komentar</h3>

      {/* Comment Input */}
      {user && profile ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <UserAvatar
            avatar={profile.channel_avatar}
            channelName={profile.channel_name}
            bgColor={profile.avatar_bg_color}
            textColor={profile.avatar_text_color}
            size="md"
          />
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              className="bg-secondary/50 border-border/50 rounded-xl min-h-[80px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="gradient-bg text-primary-foreground hover:opacity-90 rounded-xl"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Mengirim...' : 'Kirim'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-secondary/30 rounded-xl mb-6 text-center">
          <p className="text-muted-foreground">
            <a href="/auth" className="text-primary hover:underline">Login</a> untuk berkomentar
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Belum ada komentar</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <UserAvatar
                avatar={comment.profiles.channel_avatar}
                channelName={comment.profiles.channel_name}
                bgColor={comment.profiles.avatar_bg_color}
                textColor={comment.profiles.avatar_text_color}
                size="md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{comment.profiles.channel_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
              {user?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
