import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CategoryChips from "@/components/CategoryChips";
import VideoGrid from "@/components/VideoGrid";
import VideoGridSkeleton from "@/components/VideoGridSkeleton";
import { categories } from "@/data/videos";
import { useVideos } from "@/hooks/useVideos";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const { videos, loading } = useVideos(activeCategory);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;

    const query = searchQuery.toLowerCase();
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.channelName.toLowerCase().includes(query)
    );
  }, [searchQuery, videos]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`pt-14 transition-all duration-200 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}>
        <CategoryChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="pb-8">
          {loading ? (
            <VideoGridSkeleton sidebarOpen={sidebarOpen} />
          ) : (
            <VideoGrid videos={filteredVideos} sidebarOpen={sidebarOpen} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
