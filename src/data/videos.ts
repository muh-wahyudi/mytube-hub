export interface Video {
  title: string;
  channelName: string;
  channelAvatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  embedLink: string;
  videoID: string;
  description: string;
  subscriberCount: string;
  likes: string;
  category: string;
}

export const videos: Video[] = [
  {
    title: "Eksplorasi Alam Semesta: Rahasia Galaksi yang Menakjubkan",
    channelName: "Sains Keren",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=SK&backgroundColor=FF0000",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=480&h=270&fit=crop",
    duration: "15:45",
    views: "1.2 Juta",
    uploadDate: "2 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoID: "eksplorasi-alam-semesta-1",
    description: "Video ini mengajak Anda untuk menjelajahi keajaiban alam semesta, dari galaksi-galaksi jauh hingga nebula yang memukau. Kita akan membahas penemuan-penemuan terbaru dalam astronomi dan bagaimana teknologi modern membantu kita memahami kosmos.",
    subscriberCount: "2.5 Juta",
    likes: "125 Ribu",
    category: "Sains"
  },
  {
    title: "Tutorial Memasak Nasi Goreng Spesial ala Restoran",
    channelName: "Dapur Ibu",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=DI&backgroundColor=4CAF50",
    thumbnail: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=480&h=270&fit=crop",
    duration: "12:30",
    views: "850 Ribu",
    uploadDate: "3 Minggu Lalu",
    embedLink: "https://www.youtube.com/embed/jNQXAC9IVRw",
    videoID: "nasi-goreng-spesial-2",
    description: "Pelajari cara membuat nasi goreng spesial dengan bumbu rahasia yang akan membuat masakan Anda terasa seperti di restoran bintang lima. Tips dan trik dari chef profesional!",
    subscriberCount: "1.8 Juta",
    likes: "95 Ribu",
    category: "Makanan"
  },
  {
    title: "Review iPhone 15 Pro Max: Apakah Worth It?",
    channelName: "Tech Indo",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=TI&backgroundColor=2196F3",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=480&h=270&fit=crop",
    duration: "25:18",
    views: "2.3 Juta",
    uploadDate: "1 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/8dZMlX9LWVk",
    videoID: "iphone-15-review-3",
    description: "Review lengkap iPhone 15 Pro Max dengan semua fitur baru, performa kamera, dan apakah upgrade dari model sebelumnya worth it. Benchmark, gaming test, dan perbandingan dengan kompetitor.",
    subscriberCount: "3.2 Juta",
    likes: "180 Ribu",
    category: "Teknologi"
  },
  {
    title: "Musik Lo-Fi untuk Belajar dan Fokus - 3 Jam Nonstop",
    channelName: "Chill Beats ID",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CB&backgroundColor=9C27B0",
    thumbnail: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=480&h=270&fit=crop",
    duration: "3:00:00",
    views: "5.7 Juta",
    uploadDate: "6 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoID: "lofi-belajar-4",
    description: "Kumpulan musik lo-fi beats yang sempurna untuk menemani belajar, bekerja, atau sekadar bersantai. Nikmati 3 jam musik tanpa iklan untuk produktivitas maksimal.",
    subscriberCount: "890 Ribu",
    likes: "320 Ribu",
    category: "Musik"
  },
  {
    title: "Highlights Liga Indonesia: Persib vs Persija",
    channelName: "Bola Mania",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=BM&backgroundColor=FF5722",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=480&h=270&fit=crop",
    duration: "10:25",
    views: "3.1 Juta",
    uploadDate: "5 Hari Lalu",
    embedLink: "https://www.youtube.com/embed/LXb3EKWsInQ",
    videoID: "persib-persija-5",
    description: "Cuplikan gol dan momen terbaik pertandingan klasik antara Persib Bandung vs Persija Jakarta. Pertandingan seru dengan drama hingga menit akhir!",
    subscriberCount: "4.5 Juta",
    likes: "250 Ribu",
    category: "Olahraga"
  },
  {
    title: "Minecraft Survival Series #47: Membangun Castle Epic",
    channelName: "Gamer Kece",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GK&backgroundColor=E91E63",
    thumbnail: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=480&h=270&fit=crop",
    duration: "45:20",
    views: "980 Ribu",
    uploadDate: "1 Minggu Lalu",
    embedLink: "https://www.youtube.com/embed/MmB9b5njVbA",
    videoID: "minecraft-castle-6",
    description: "Lanjutan series Minecraft survival mode! Kali ini kita akan membangun castle megah dengan interior lengkap. Tutorial step by step untuk pemula hingga pro!",
    subscriberCount: "2.1 Juta",
    likes: "89 Ribu",
    category: "Game"
  },
  {
    title: "Berita Pagi: Update Ekonomi Indonesia 2024",
    channelName: "Kabar Terkini",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=KT&backgroundColor=607D8B",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=480&h=270&fit=crop",
    duration: "8:15",
    views: "450 Ribu",
    uploadDate: "12 Jam Lalu",
    embedLink: "https://www.youtube.com/embed/BtN-goy9VOY",
    videoID: "berita-ekonomi-7",
    description: "Update terbaru kondisi ekonomi Indonesia di tahun 2024. Pembahasan inflasi, nilai tukar rupiah, dan prediksi pertumbuhan ekonomi dari para ahli.",
    subscriberCount: "5.8 Juta",
    likes: "35 Ribu",
    category: "Berita"
  },
  {
    title: "Workout 30 Menit untuk Pemula - Bakar Lemak Efektif",
    channelName: "Fit & Sehat",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=FS&backgroundColor=00BCD4",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&h=270&fit=crop",
    duration: "32:45",
    views: "1.5 Juta",
    uploadDate: "2 Minggu Lalu",
    embedLink: "https://www.youtube.com/embed/UItWltVZZmE",
    videoID: "workout-pemula-8",
    description: "Program workout lengkap 30 menit yang cocok untuk pemula. Tidak perlu alat, bisa dilakukan di rumah. Ikuti gerakan trainer profesional untuk hasil maksimal!",
    subscriberCount: "1.2 Juta",
    likes: "110 Ribu",
    category: "Olahraga"
  },
  {
    title: "Vlog: Liburan ke Bali - Hidden Gems yang Jarang Dikunjungi",
    channelName: "Travel Santai",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=8BC34A",
    thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=480&h=270&fit=crop",
    duration: "18:50",
    views: "2.8 Juta",
    uploadDate: "3 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/LxOvESgYP60",
    videoID: "bali-hidden-gems-9",
    description: "Eksplorasi tempat-tempat tersembunyi di Bali yang belum banyak dikunjungi turis. Pantai sepi, air terjun indah, dan kuliner lokal yang wajib dicoba!",
    subscriberCount: "980 Ribu",
    likes: "165 Ribu",
    category: "Travel"
  },
  {
    title: "Stand Up Comedy: Curhat Anak Kos - Lucu Banget!",
    channelName: "Ketawa Bareng",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=KB&backgroundColor=FFC107",
    thumbnail: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=480&h=270&fit=crop",
    duration: "15:00",
    views: "4.2 Juta",
    uploadDate: "1 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/oHg5SJYRHA0",
    videoID: "standup-anak-kos-10",
    description: "Kompilasi stand up comedy terbaik tentang kehidupan anak kos. Dari masalah dapur bersama sampai drama tetangga, dijamin ngakak!",
    subscriberCount: "3.5 Juta",
    likes: "290 Ribu",
    category: "Hiburan"
  },
  {
    title: "Tutorial Editing Video Cinematic di DaVinci Resolve",
    channelName: "Creator Academy",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CA&backgroundColor=795548",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=480&h=270&fit=crop",
    duration: "42:15",
    views: "620 Ribu",
    uploadDate: "2 Minggu Lalu",
    embedLink: "https://www.youtube.com/embed/0JgF4CMXU9M",
    videoID: "davinci-tutorial-11",
    description: "Panduan lengkap membuat video cinematic menggunakan DaVinci Resolve (gratis). Dari color grading hingga transisi smooth, cocok untuk pemula!",
    subscriberCount: "750 Ribu",
    likes: "58 Ribu",
    category: "Edukasi"
  },
  {
    title: "ASMR: Suara Hujan dan Petir untuk Tidur Nyenyak",
    channelName: "Relax Zone ID",
    channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=RZ&backgroundColor=3F51B5",
    thumbnail: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=480&h=270&fit=crop",
    duration: "8:00:00",
    views: "8.9 Juta",
    uploadDate: "8 Bulan Lalu",
    embedLink: "https://www.youtube.com/embed/mPZkdNFkNps",
    videoID: "asmr-hujan-12",
    description: "8 jam suara hujan lebat dengan petir untuk membantu tidur lebih nyenyak dan rileks. Sempurna untuk white noise, meditasi, atau background saat bekerja.",
    subscriberCount: "1.5 Juta",
    likes: "450 Ribu",
    category: "ASMR"
  }
];

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
