import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CategoryChips from "@/components/CategoryChips";
import VideoGrid from "@/components/VideoGrid";
import { videos, categories } from "@/data/videos";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredVideos = useMemo(() => {
    let result = videos;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.channelName.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (activeCategory !== "Semua") {
      result = result.filter((video) => video.category === activeCategory);
    }

    return result;
  }, [searchQuery, activeCategory]);

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
          <VideoGrid videos={filteredVideos} sidebarOpen={sidebarOpen} />
        </div>
      </main>
    </div>
  );
};

export default Index;
