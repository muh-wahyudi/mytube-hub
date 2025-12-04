import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryChips = ({ categories, activeCategory, onCategoryChange }: CategoryChipsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", updateArrows);
      updateArrows();
      return () => ref.removeEventListener("scroll", updateArrows);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center bg-background sticky top-14 z-30 py-3">
      {/* Left Arrow */}
      {showLeftArrow && (
        <div className="absolute left-0 z-10 flex items-center bg-gradient-to-r from-background via-background to-transparent pr-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-mytube-hover"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chips Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 scroll-smooth"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === category
                ? "bg-mytube-chip-active text-mytube-chip-active-foreground"
                : "bg-mytube-chip text-mytube-chip-foreground hover:bg-muted"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <div className="absolute right-0 z-10 flex items-center bg-gradient-to-l from-background via-background to-transparent pl-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-mytube-hover"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryChips;
