import { Link, useLocation } from "react-router-dom";
import { Home, Search, BookOpen, Trophy, User, Bell, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { CenterModal } from "@/components/CenterModal";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Trang chủ" },
  { path: "/search", icon: Search, label: "Tìm kiếm" },
  { path: "/library", icon: BookOpen, label: "Tủ truyện" },
  { path: "/rankings", icon: Trophy, label: "Xếp hạng" },
  { path: "/profile", icon: User, label: "Cá nhân" },
];

export function MobileHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex h-12 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-1.5">
          <BookOpen className="h-4.5 w-4.5 text-imperial" />
          <span className="text-base font-semibold tracking-tight">
            <span className="text-imperial">m</span>Stories
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <CenterModal />
          <Link to="/notifications" className="relative p-2">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-imperial" />
          </Link>
          <button onClick={toggleTheme} className="p-2">
            {theme === "light" ? <Moon className="h-4.5 w-4.5 text-muted-foreground" /> : <Sun className="h-4.5 w-4.5 text-muted-foreground" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                isActive ? "text-imperial" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-imperial" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden min-h-screen bg-background pb-16">
      <MobileHeader />
      {children}
      <MobileBottomNav />
    </div>
  );
}
