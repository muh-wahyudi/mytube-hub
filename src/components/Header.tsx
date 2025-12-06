import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Mic, Video, Bell, LogIn, X, Sparkles, LogOut, Settings, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "./UserAvatar";

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ onMenuClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    navigate("/");
  };

  const clearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 glass-effect">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-secondary transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow transition-shadow group-hover:shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xl font-display font-bold hidden sm:block">
            <span className="gradient-text">Stream</span>
            <span className="text-foreground">Vibe</span>
          </span>
        </Link>
      </div>

      {/* Center Section - Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className={`flex items-center flex-1 rounded-2xl bg-secondary/50 border-2 transition-all duration-300 ${
          isSearchFocused ? 'border-primary shadow-glow' : 'border-transparent'
        }`}>
          <Search className="h-4 w-4 ml-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari video..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-3 h-11 text-sm"
          />
          {localSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-1 rounded-full"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            className="rounded-xl rounded-l-none h-11 px-5 gradient-bg text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-3 rounded-xl bg-secondary/50 hover:bg-secondary h-11 w-11"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-xl hover:bg-secondary"
        >
          <Search className="h-5 w-5" />
        </Button>

        {user ? (
          <>
            {/* Upload Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-secondary hidden sm:flex"
              onClick={() => navigate("/upload")}
            >
              <Video className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-secondary hidden sm:flex relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-secondary ml-1"
                >
                  <UserAvatar
                    channelName={profile?.channel_name || "User"}
                    avatar={profile?.channel_avatar || null}
                    bgColor={profile?.avatar_bg_color || '#6366f1'}
                    textColor={profile?.avatar_text_color || '#ffffff'}
                    size="sm"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3">
                  <UserAvatar
                    channelName={profile?.channel_name || "User"}
                    avatar={profile?.channel_avatar || null}
                    bgColor={profile?.avatar_bg_color || '#6366f1'}
                    textColor={profile?.avatar_text_color || '#ffffff'}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.channel_name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/my-videos")}>
                  <Film className="h-4 w-4 mr-2" />
                  Video Saya
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/upload")}>
                  <Video className="h-4 w-4 mr-2" />
                  Upload Video
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            variant="outline"
            className="rounded-xl border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate("/auth")}
          >
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
