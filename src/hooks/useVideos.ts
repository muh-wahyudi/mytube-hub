import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Video } from "@/data/videos";

interface DBVideo {
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

interface WatchHistoryCategory {
  category: string;
  count: number;
}

export const useVideos = (activeCategory: string = "Semua") => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      // Fetch all videos
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
        .order('created_at', { ascending: false });

      if (activeCategory !== "Semua") {
        query = query.eq('category', activeCategory);
      }

      const { data: allVideos, error } = await query;

      if (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
        return;
      }

      let formattedVideos = formatVideos(allVideos as DBVideo[]);

      // If user is logged in, apply recommendation algorithm
      if (user && activeCategory === "Semua") {
        formattedVideos = await applyRecommendationAlgorithm(formattedVideos, user.id);
      }

      setVideos(formattedVideos);
      setLoading(false);
    };

    fetchVideos();
  }, [activeCategory, user]);

  const formatVideos = (dbVideos: DBVideo[]): Video[] => {
    return (dbVideos || []).map(video => ({
      videoID: video.id,
      title: video.title,
      channelName: video.profiles.channel_name,
      channelAvatar: video.profiles.channel_avatar || undefined,
      avatarBgColor: video.profiles.avatar_bg_color,
      avatarTextColor: video.profiles.avatar_text_color,
      thumbnail: video.thumbnail_url,
      views: formatViews(video.views),
      uploadDate: getRelativeTime(video.created_at),
      embedLink: video.embed_link,
      description: video.description || '',
      category: video.category
    }));
  };

  const applyRecommendationAlgorithm = async (allVideos: Video[], userId: string): Promise<Video[]> => {
    // Get user's watch history to analyze preferences
    const { data: historyData } = await supabase
      .from('watch_history')
      .select(`
        video_id,
        videos (
          category,
          user_id
        )
      `)
      .eq('user_id', userId)
      .order('watched_at', { ascending: false })
      .limit(50);

    if (!historyData || historyData.length === 0) {
      // No history, return videos sorted by views
      return allVideos.sort((a, b) => {
        const viewsA = parseViews(a.views);
        const viewsB = parseViews(b.views);
        return viewsB - viewsA;
      });
    }

    // Count category preferences
    const categoryCount: Record<string, number> = {};
    const channelCount: Record<string, number> = {};
    
    historyData.forEach((item: any) => {
      if (item.videos) {
        const category = item.videos.category;
        const channelId = item.videos.user_id;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
        channelCount[channelId] = (channelCount[channelId] || 0) + 1;
      }
    });

    // Get watched video IDs to deprioritize
    const watchedVideoIds = new Set(historyData.map((item: any) => item.video_id));

    // Score and sort videos
    const scoredVideos = allVideos.map(video => {
      let score = 0;
      
      // Category preference score (max 50 points)
      const catScore = categoryCount[video.category] || 0;
      score += Math.min(catScore * 5, 50);
      
      // Popularity score (max 30 points based on views)
      const views = parseViews(video.views);
      score += Math.min(views / 1000, 30);
      
      // Recency score (max 20 points)
      const daysSinceUpload = getDaysSince(video.uploadDate);
      score += Math.max(20 - daysSinceUpload, 0);
      
      // Penalty for already watched videos
      if (watchedVideoIds.has(video.videoID)) {
        score -= 30;
      }

      return { video, score };
    });

    // Sort by score descending
    scoredVideos.sort((a, b) => b.score - a.score);

    return scoredVideos.map(item => item.video);
  };

  return { videos, loading };
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)} Juta`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)} Ribu`;
  }
  return `${views}`;
};

const parseViews = (viewsStr: string): number => {
  const num = parseFloat(viewsStr.replace(/[^0-9.]/g, ''));
  if (viewsStr.includes('Juta')) return num * 1000000;
  if (viewsStr.includes('Ribu')) return num * 1000;
  return num || 0;
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;
  return date.toLocaleDateString('id-ID');
};

const getDaysSince = (relativeTime: string): number => {
  // Parse relative time back to days
  const match = relativeTime.match(/(\d+)/);
  if (!match) return 0;
  const num = parseInt(match[1]);
  
  if (relativeTime.includes('menit') || relativeTime.includes('jam')) return 0;
  if (relativeTime.includes('hari')) return num;
  if (relativeTime.includes('minggu')) return num * 7;
  if (relativeTime.includes('bulan')) return num * 30;
  return 365; // Very old
};
