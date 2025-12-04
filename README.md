# 🎬 MyTube - Platform Berbagi Video

MyTube adalah platform berbagi video berbasis web yang meniru tampilan dan fungsionalitas YouTube modern. Video bersumber dari berbagai platform hosting eksternal (YouTube, Vimeo, DailyMotion, dll.) melalui embed player.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Struktur File](#-struktur-file)
- [Cara Menambah/Mengubah Video](#-cara-menambahubah-video)
- [Format Data Video](#-format-data-video)
- [Cara Mendapatkan Embed Link](#-cara-mendapatkan-embed-link)
- [Cara Mengubah Kategori](#-cara-mengubah-kategori)
- [Kustomisasi Tampilan](#-kustomisasi-tampilan)
- [Alur Aplikasi](#-alur-aplikasi)

---

## ✨ Fitur Utama

### 🏠 Halaman Beranda (`/`)
- **Header** dengan logo MyTube, search bar, dan ikon navigasi
- **Sidebar** yang bisa di-collapse/expand (klik ikon hamburger menu)
- **Filter Kategori** dengan scroll horizontal (chip buttons)
- **Video Grid** responsif (1-5 kolom tergantung ukuran layar)
- **Search** yang memfilter video berdasarkan judul atau nama channel

### 🎥 Halaman Pemutar Video (`/watch?v=videoID`)
- **Video Player** menggunakan iframe embed dari sumber eksternal
- **Info Video**: Judul, views, tanggal upload
- **Channel Info**: Avatar, nama channel, jumlah subscriber
- **Tombol Interaksi**: Like/Dislike, Share, Download, Subscribe
- **Deskripsi** yang bisa di-expand/collapse
- **Video Rekomendasi** di sidebar kanan

### 🔍 Fitur Pencarian
- Pencarian real-time berdasarkan judul video
- Pencarian berdasarkan nama channel
- Filter berdasarkan kategori

---

## 📁 Struktur File

```
src/
├── components/
│   ├── Header.tsx          # Header dengan logo, search bar, ikon
│   ├── Sidebar.tsx         # Sidebar navigasi (Home, Explore, dll)
│   ├── CategoryChips.tsx   # Filter kategori horizontal
│   ├── VideoCard.tsx       # Komponen kartu video (grid & list)
│   ├── VideoGrid.tsx       # Grid container untuk video
│   └── ui/                 # Komponen UI (shadcn)
├── data/
│   └── videos.ts           # ⭐ DATA VIDEO UTAMA (edit di sini!)
├── pages/
│   ├── Index.tsx           # Halaman beranda
│   ├── Watch.tsx           # Halaman pemutar video
│   └── NotFound.tsx        # Halaman 404
├── index.css               # Styling & design system
└── App.tsx                 # Routing aplikasi
```

---

## 🎬 Cara Menambah/Mengubah Video

### Lokasi File Data Video
Semua data video disimpan di: **`src/data/videos.ts`**

### Langkah Menambah Video Baru

1. Buka file `src/data/videos.ts`
2. Tambahkan objek baru ke dalam array `videos`
3. Isi semua properti yang diperlukan

### Contoh Menambah Video:

```typescript
// Di dalam array videos, tambahkan objek baru:
{
  title: "Judul Video Anda",
  channelName: "Nama Channel",
  channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NC&backgroundColor=FF0000",
  thumbnail: "https://link-ke-thumbnail.jpg",
  duration: "10:30",
  views: "500 Ribu",
  uploadDate: "1 Minggu Lalu",
  embedLink: "https://www.youtube.com/embed/VIDEO_ID",
  videoID: "judul-video-anda-unik",
  description: "Deskripsi lengkap video Anda di sini...",
  subscriberCount: "100 Ribu",
  likes: "25 Ribu",
  category: "Hiburan"
}
```

---

## 📝 Format Data Video

| Properti | Tipe | Deskripsi | Contoh |
|----------|------|-----------|--------|
| `title` | string | Judul video | `"Tutorial Memasak Nasi Goreng"` |
| `channelName` | string | Nama channel | `"Dapur Ibu"` |
| `channelAvatar` | string | URL avatar channel | `"https://api.dicebear.com/7.x/initials/svg?seed=DI"` |
| `thumbnail` | string | URL gambar thumbnail | `"https://images.unsplash.com/photo-xxx"` |
| `duration` | string | Durasi video | `"15:30"` atau `"1:30:00"` |
| `views` | string | Jumlah views (format display) | `"1.5 Juta"` atau `"850 Ribu"` |
| `uploadDate` | string | Tanggal upload (relatif) | `"2 Minggu Lalu"` |
| `embedLink` | string | **URL EMBED** dari platform video | `"https://www.youtube.com/embed/dQw4w9WgXcQ"` |
| `videoID` | string | ID unik untuk URL routing (slug) | `"tutorial-nasi-goreng-1"` |
| `description` | string | Deskripsi video | `"Video tutorial lengkap..."` |
| `subscriberCount` | string | Jumlah subscriber channel | `"500 Ribu"` |
| `likes` | string | Jumlah likes | `"25 Ribu"` |
| `category` | string | Kategori video | `"Makanan"` |

### ⚠️ Penting!
- `videoID` harus **UNIK** untuk setiap video
- `videoID` digunakan untuk URL: `/watch?v=videoID`
- Gunakan format slug (huruf kecil, strip pengganti spasi)

---

## 🔗 Cara Mendapatkan Embed Link

### YouTube
1. Buka video di YouTube
2. Klik **Share** → **Embed**
3. Copy URL dari atribut `src` di kode iframe
4. Format: `https://www.youtube.com/embed/VIDEO_ID`

**Contoh:**
- URL Video: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Embed Link: `https://www.youtube.com/embed/dQw4w9WgXcQ`

### Vimeo
1. Buka video di Vimeo
2. Klik **Share** → Copy embed code
3. Format: `https://player.vimeo.com/video/VIDEO_ID`

**Contoh:**
- URL Video: `https://vimeo.com/123456789`
- Embed Link: `https://player.vimeo.com/video/123456789`

### DailyMotion
1. Buka video di DailyMotion
2. Klik **Share** → **Embed**
3. Format: `https://www.dailymotion.com/embed/video/VIDEO_ID`

**Contoh:**
- URL Video: `https://www.dailymotion.com/video/x8abc12`
- Embed Link: `https://www.dailymotion.com/embed/video/x8abc12`

### YourUpload / Platform Lain
Setiap platform memiliki format embed berbeda. Cari tombol "Share" atau "Embed" di platform tersebut.

---

## 🏷️ Cara Mengubah Kategori

### Lokasi
Kategori didefinisikan di file: **`src/data/videos.ts`**

### Mengubah Daftar Kategori

```typescript
// Cari array categories di file videos.ts
export const categories = [
  "Semua",      // Jangan hapus! Untuk menampilkan semua video
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
  // Tambah kategori baru di sini
];
```

### ⚠️ Penting!
- Kategori di video (`category` property) harus **SAMA PERSIS** dengan nama di array `categories`
- "Semua" adalah kategori khusus untuk menampilkan semua video

---

## 🎨 Kustomisasi Tampilan

### Mengubah Warna Brand (Merah YouTube)

Edit file `src/index.css`:

```css
:root {
  /* Ubah warna primary (merah) */
  --primary: 0 100% 50%;        /* HSL: Hue, Saturation, Lightness */
  --mytube-red: 0 100% 50%;
}
```

### Mengubah Warna Background

```css
:root {
  --background: 0 0% 100%;      /* Putih */
  --foreground: 0 0% 6%;        /* Teks gelap */
}

.dark {
  --background: 0 0% 6%;        /* Hitam untuk dark mode */
  --foreground: 0 0% 100%;      /* Teks putih */
}
```

### Mengubah Font

Edit file `src/index.css` bagian `@import`:

```css
@import url('https://fonts.googleapis.com/css2?family=NamaFont:wght@300;400;500;700&display=swap');
```

Dan update di `tailwind.config.ts`:

```typescript
fontFamily: {
  roboto: ['NamaFont', 'sans-serif'],
},
```

---

## 🔄 Alur Aplikasi

### 1. User Membuka Beranda (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  Header (Logo, Search, Icons)                           │
├──────────┬──────────────────────────────────────────────┤
│          │  Category Chips (Semua, Musik, Game, ...)    │
│  Sidebar │──────────────────────────────────────────────│
│  (Nav)   │                                              │
│          │  Video Grid                                  │
│          │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│          │  │ Vid │ │ Vid │ │ Vid │ │ Vid │           │
│          │  └─────┘ └─────┘ └─────┘ └─────┘           │
│          │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│          │  │ Vid │ │ Vid │ │ Vid │ │ Vid │           │
│          │  └─────┘ └─────┘ └─────┘ └─────┘           │
└──────────┴──────────────────────────────────────────────┘
```

### 2. User Mengklik Video Card

```
User Click → Navigate to /watch?v=videoID → Load Watch Page
```

### 3. Halaman Watch Menampilkan Video

```
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├─────────────────────────────────────────┬───────────────┤
│                                         │               │
│  ┌─────────────────────────────────┐   │  Rekomendasi  │
│  │                                 │   │  ┌─────────┐  │
│  │     VIDEO PLAYER (iframe)       │   │  │  Vid 1  │  │
│  │                                 │   │  └─────────┘  │
│  └─────────────────────────────────┘   │  ┌─────────┐  │
│                                         │  │  Vid 2  │  │
│  Judul Video                           │  └─────────┘  │
│  Channel | Subscribe | Like | Share    │  ┌─────────┐  │
│                                         │  │  Vid 3  │  │
│  Deskripsi Video...                    │  └─────────┘  │
│                                         │               │
└─────────────────────────────────────────┴───────────────┘
```

### 4. Alur Data

```
videos.ts (Data) 
    ↓
Index.tsx (Beranda)
    ↓ filter by search & category
VideoGrid.tsx
    ↓
VideoCard.tsx → Click → /watch?v=videoID
    ↓
Watch.tsx → Find video by videoID → Display
```

---

## 📱 Responsivitas

| Ukuran Layar | Kolom Grid | Sidebar |
|--------------|------------|---------|
| Mobile (<640px) | 1 kolom | Hidden |
| Tablet (640-1024px) | 2 kolom | Mini (icon only) |
| Desktop (1024-1280px) | 3 kolom | Full |
| Large (>1280px) | 4-5 kolom | Full |

---

## 🚀 Quick Start - Menambah Video Pertama

1. **Buka** `src/data/videos.ts`

2. **Tambahkan** video baru di array `videos`:

```typescript
{
  title: "Video Pertama Saya",
  channelName: "Channel Saya",
  channelAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=3B82F6",
  thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=480&h=270&fit=crop",
  duration: "5:30",
  views: "100",
  uploadDate: "Baru Saja",
  embedLink: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  videoID: "video-pertama-saya",
  description: "Ini adalah video pertama saya di MyTube!",
  subscriberCount: "10",
  likes: "5",
  category: "Hiburan"
},
```

3. **Simpan** file

4. **Refresh** browser - Video akan muncul di beranda!

---

## ❓ FAQ

### Q: Bagaimana cara menghapus video?
A: Hapus objek video dari array `videos` di file `src/data/videos.ts`

### Q: Video tidak muncul setelah ditambahkan?
A: Pastikan:
- Format JSON benar (ada koma setelah setiap properti)
- `videoID` unik dan tidak ada yang sama
- `category` sesuai dengan yang ada di array `categories`

### Q: Embed video tidak berfungsi?
A: Pastikan:
- URL embed benar (bukan URL biasa)
- Video tidak di-private atau age-restricted
- Platform mendukung embedding

### Q: Cara mengubah thumbnail?
A: Ganti URL di properti `thumbnail`. Bisa menggunakan:
- Unsplash: `https://images.unsplash.com/photo-xxx?w=480&h=270&fit=crop`
- Placeholder: `https://placehold.co/480x270/000000/FFFFFF/png`
- URL gambar custom Anda sendiri

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan demonstrasi.

---

**Dibuat dengan ❤️ menggunakan Lovable**
