import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trophy, TrendingUp, Sparkles } from "lucide-react";
import type { Story } from "@/lib/mock-data";

const tabs = [
  { id: "weekly", label: "TOP WEEKLY", icon: Trophy },
  { id: "trending", label: "TRENDING", icon: TrendingUp },
  { id: "new", label: "NEW", icon: Sparkles },
] as const;

export function RankingSidebar({ stories = [] }: { stories?: Story[] }) {
  const [activeTab, setActiveTab] = useState<string>("weekly");

  const rankings = [...stories].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <aside className="w-72 shrink-0 space-y-6">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {rankings.map((story, i) => (
            <Link key={story.id} to={`/story/${story.id}`} className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-muted/30">
              <span className="mt-0.5 text-sm font-bold text-muted-foreground">{i + 1}</span>
              <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-sm border border-border font-story text-sm font-bold text-foreground/30" style={{ backgroundColor: story.cover_color }}>
                {story.title.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{story.title}</p>
                <p className="text-[10px] text-muted-foreground">{story.author}</p>
              </div>
              <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3" /> {story.rating}
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t border-border px-3 py-2 text-center">
          <Link to="/rankings" className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
            VIEW ALL RANKINGS →
          </Link>
        </div>
      </div>
    </aside>
  );
}
