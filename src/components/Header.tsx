import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Mic, Video, Bell, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ onMenuClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    navigate("/");
  };

  const clearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-background px-4 border-b border-border">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-mytube-hover"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="flex items-center gap-1">
          <div className="flex items-center">
            <div className="bg-primary rounded-lg p-1 mr-1">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground fill-current">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">MyTube</span>
          </div>
        </Link>
      </div>

      {/* Center Section - Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
        <div className={`flex items-center flex-1 border rounded-l-full ${isSearchFocused ? 'border-blue-500 shadow-inner' : 'border-border'}`}>
          {isSearchFocused && (
            <Search className="h-5 w-5 ml-4 text-muted-foreground" />
          )}
          <Input
            type="text"
            placeholder="Cari"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-4 h-10"
          />
          {localSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-1"
              onClick={clearSearch}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="rounded-r-full rounded-l-none h-10 px-6 border border-l-0 border-border"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2 rounded-full bg-secondary hover:bg-mytube-hover"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full hover:bg-mytube-hover"
        >
          <Search className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-mytube-hover hidden sm:flex"
        >
          <Video className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-mytube-hover hidden sm:flex"
        >
          <Bell className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-mytube-hover ml-2"
        >
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;
