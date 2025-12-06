export interface Video {
  title: string;
  channelName: string;
  channelAvatar?: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
  thumbnail: string;
  duration?: string;
  views: string;
  uploadDate: string;
  embedLink: string;
  videoID: string;
  description: string;
  subscriberCount?: string;
  likes?: string;
  category: string;
}

// Video data now comes from database only
export const videos: Video[] = [];

export const categories = [
  "Semua",
  "Musik",
  "Game",
  "Berita",
  "Olahraga",
  "Hiburan",
  "Edukasi",
  "Teknologi",
  "Sains",
  "Travel",
  "Makanan",
  "ASMR"
];
