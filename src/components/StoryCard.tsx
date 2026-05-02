import { Link } from "react-router-dom";
import { Eye, MessageSquare, Star } from "lucide-react";
import type { Story } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const statusStyles: Record<string, { label: string; className: string }> = {
  ongoing: { label: "Ongoing", className: "bg-jade text-white" },
  completed: { label: "Completed", className: "bg-imperial text-white" },
  hiatus: { label: "Hiatus", className: "bg-muted text-muted-foreground" },
};

export function StoryCard({ story }: { story: Story }) {
  const st = statusStyles[story.status] ?? statusStyles.ongoing;

  return (
    <Link
      to={`/story/${story.id}`}
      className="group flex gap-4 border-b border-border px-4 py-5 transition-colors hover:bg-muted/30"
    >
      {/* CSS Cover */}
      <div
        className="flex h-16 w-14 shrink-0 items-center justify-center rounded-sm border border-border font-story text-2xl font-bold text-foreground/30 transition-colors group-hover:text-foreground/50"
        style={{ backgroundColor: story.cover_color }}
      >
        {story.title.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
            {story.title}
          </h3>
          <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${st.className}`}>
            {st.label}
          </span>
        </div>
        <Link
          to={`/author/${encodeURIComponent(story.author)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-muted-foreground hover:text-jade hover:underline"
        >
          {story.author}
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/80">
          {story.description}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-jade hover:underline"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" /> {formatCount(story.views)}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" /> {formatCount(story.comments)}c
            </span>
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3" /> {story.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
