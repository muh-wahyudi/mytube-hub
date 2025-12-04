import { Link, useLocation } from "react-router-dom";
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Film, Flame, ShoppingBag, Music2, Gamepad2, Newspaper, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const mainItems = [
  { icon: Home, label: "Beranda", path: "/" },
  { icon: Compass, label: "Jelajahi", path: "/explore" },
  { icon: PlaySquare, label: "Subscription", path: "/subscriptions" },
];

const libraryItems = [
  { icon: Clock, label: "Histori", path: "/history" },
  { icon: ThumbsUp, label: "Video Disukai", path: "/liked" },
];

const exploreItems = [
  { icon: Flame, label: "Trending", path: "/trending" },
  { icon: ShoppingBag, label: "Belanja", path: "/shopping" },
  { icon: Music2, label: "Musik", path: "/music" },
  { icon: Film, label: "Film", path: "/movies" },
  { icon: Gamepad2, label: "Gaming", path: "/gaming" },
  { icon: Newspaper, label: "Berita", path: "/news" },
  { icon: Trophy, label: "Olahraga", path: "/sports" },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link
        to={path}
        className={cn(
          "flex items-center gap-6 px-3 py-2.5 rounded-lg transition-colors",
          isOpen ? "justify-start" : "flex-col gap-1 px-1 py-4",
          isActive ? "bg-mytube-hover font-medium" : "hover:bg-mytube-hover"
        )}
      >
        <Icon className={cn("h-6 w-6 flex-shrink-0", !isOpen && "h-5 w-5")} />
        <span className={cn(
          "text-sm",
          !isOpen && "text-[10px]"
        )}>
          {label}
        </span>
      </Link>
    );
  };

  // Mini sidebar for collapsed state
  if (!isOpen) {
    return (
      <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[72px] bg-background overflow-y-auto scrollbar-hide hidden md:block">
        <nav className="flex flex-col py-2 px-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-60 bg-background overflow-y-auto scrollbar-hide border-r border-border hidden md:block z-40">
      <nav className="flex flex-col py-3 px-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-3 h-px bg-border" />

        {/* Library */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-sm font-medium">Library</h3>
          {libraryItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-3 h-px bg-border" />

        {/* Explore */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-sm font-medium">Jelajahi</h3>
          {exploreItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-3 h-px bg-border" />

        {/* Footer */}
        <div className="px-3 py-4 text-xs text-muted-foreground space-y-2">
          <p>© 2024 MyTube</p>
          <p className="text-[10px] leading-relaxed">
            Tentang Pers Hak Cipta Hubungi kami Kreator Iklan Developer
          </p>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
