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
  { icon: ThumbsUp, label: "Disukai", path: "/liked" },
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
          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
          isOpen ? "justify-start" : "flex-col gap-1 px-2 py-3",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className={cn(
          "flex-shrink-0 transition-transform group-hover:scale-110",
          isOpen ? "h-5 w-5" : "h-5 w-5",
          isActive && "text-primary"
        )} />
        <span className={cn(
          "font-medium transition-colors",
          isOpen ? "text-sm" : "text-[10px]",
          isActive && "text-primary"
        )}>
          {label}
        </span>
      </Link>
    );
  };

  // Mini sidebar for collapsed state
  if (!isOpen) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-20 bg-background/50 backdrop-blur-md overflow-y-auto scrollbar-hide hidden md:block border-r border-border/50">
        <nav className="flex flex-col py-4 px-2 gap-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-background/50 backdrop-blur-md overflow-y-auto scrollbar-hide border-r border-border/50 hidden md:block z-40">
      <nav className="flex flex-col py-4 px-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Library */}
        <div className="space-y-1">
          <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Library</h3>
          {libraryItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Explore */}
        <div className="space-y-1">
          <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jelajahi</h3>
          {exploreItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer */}
        <div className="px-4 py-4 text-xs text-muted-foreground space-y-3">
          <p className="font-medium">© 2024 StreamVibe</p>
          <p className="text-[10px] leading-relaxed opacity-70">
            Tentang • Pers • Hak Cipta • Hubungi • Kreator
          </p>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
