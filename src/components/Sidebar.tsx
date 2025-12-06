import { Link, useLocation } from "react-router-dom";
import { Home, Compass, PlaySquare, ThumbsUp, Film, Upload, Settings, Video, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "./UserAvatar";

interface SidebarProps {
  isOpen: boolean;
}

const mainItems = [
  { icon: Home, label: "Beranda", path: "/" },
  { icon: Compass, label: "Jelajahi", path: "/explore" },
  { icon: PlaySquare, label: "Subscription", path: "/subscriptions", requiresAuth: true },
];

const libraryItems = [
  { icon: History, label: "History", path: "/history", requiresAuth: true },
  { icon: ThumbsUp, label: "Disukai", path: "/liked", requiresAuth: true },
  { icon: Film, label: "Video Saya", path: "/my-videos", requiresAuth: true },
];

const creatorItems = [
  { icon: Upload, label: "Upload Video", path: "/upload", requiresAuth: true },
  { icon: Settings, label: "Pengaturan", path: "/settings", requiresAuth: true },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { user, profile } = useAuth();

  const NavItem = ({ icon: Icon, label, path, requiresAuth }: { icon: any; label: string; path: string; requiresAuth?: boolean }) => {
    const isActive = location.pathname === path;
    
    // Hide auth-required items if user is not logged in
    if (requiresAuth && !user) {
      return null;
    }
    
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
        {/* User Profile Section */}
        {user && profile && (
          <>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors mb-2">
              <UserAvatar
                channelName={profile.channel_name}
                avatar={profile.channel_avatar}
                bgColor={profile.avatar_bg_color || '#6366f1'}
                textColor={profile.avatar_text_color || '#ffffff'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile.channel_name}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
              </div>
            </Link>
            <div className="my-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </>
        )}

        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Library - Only show if logged in */}
        {user && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Library</h3>
              {libraryItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </div>

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Creator */}
            <div className="space-y-1">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Creator</h3>
              {creatorItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </div>

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </>
        )}

        {/* Login prompt if not logged in */}
        {!user && (
          <>
            <div className="px-4 py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Login untuk like, subscribe, dan upload video
              </p>
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
              >
                <Video className="h-4 w-4" />
                Login
              </Link>
            </div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </>
        )}

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
