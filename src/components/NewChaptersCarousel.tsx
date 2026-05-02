import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Story } from "@/lib/mock-data";

export function NewChaptersCarousel({ stories = [] }: { stories?: Story[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  const items = stories.length > 0 ? [...stories, ...stories.slice(0, 2)] : [];

  if (items.length === 0) return null;

  return (
    <section className="border-b border-border bg-card">
      <div className="container py-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-imperial">🏠</span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Tân Chương - Tân Phẩm
          </h2>
          <span className="text-sm">🐾</span>
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 bg-card/80" onClick={() => scroll("left")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-8 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {items.map((story, i) => (
              <Link key={`${story.id}-${i}`} to={`/story/${story.id}`} className="group flex min-w-[200px] flex-col items-center text-center">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-sm border border-border font-story text-2xl font-bold text-foreground/30 transition-colors group-hover:text-foreground/60" style={{ backgroundColor: story.cover_color }}>
                  {story.title.charAt(0)}
                </div>
                <p className="w-full truncate text-xs font-semibold text-foreground group-hover:text-primary">{story.title}</p>
                <p className="text-[10px] text-jade">Chương {story.chapter_count} · {new Date(story.updated_at).toLocaleDateString("vi-VN")}</p>
              </Link>
            ))}
          </div>

          <Button variant="ghost" size="icon" className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 bg-card/80" onClick={() => scroll("right")}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
