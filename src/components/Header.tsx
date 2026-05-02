import { Link } from "react-router-dom";
import { Moon, Sun, BookOpen, User, Search, Bell, Layers, Users, Trophy, MessageSquare, Award } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/CenterModal";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-5 w-5 text-imperial" />
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-imperial">m</span>Stories
          </span>
        </Link>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-sm">
          <Link to="/search" className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <div className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm text-muted-foreground flex items-center">
              Tìm kiếm...
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="hidden md:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Trang chủ
          </Link>
          <Link to="/genres" className="hidden md:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Thể loại
          </Link>
          <Link to="/rankings" className="hidden md:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Xếp hạng
          </Link>
          <Link to="/community" className="hidden md:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Cộng đồng
          </Link>
          <Link to="/contest" className="hidden lg:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Cuộc thi
          </Link>
          <Link to="/dashboard" className="hidden lg:inline-block px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
            Viết truyện
          </Link>
          <CenterModal />
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/messages">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-jade" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-imperial" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile"><User className="h-4 w-4" /></Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
