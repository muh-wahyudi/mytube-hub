-- Create watch_history table
CREATE TABLE public.watch_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_video FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own history" 
ON public.watch_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" 
ON public.watch_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" 
ON public.watch_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX idx_watch_history_video_id ON public.watch_history(video_id);
CREATE INDEX idx_watch_history_watched_at ON public.watch_history(watched_at DESC);