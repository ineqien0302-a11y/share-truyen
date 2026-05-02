import { useState } from "react";
import { Header } from "@/components/Header";
import { Marquee } from "@/components/Marquee";
import { HeroBanner } from "@/components/HeroBanner";
import { RecentAuthors } from "@/components/RecentAuthors";
import { NewChaptersCarousel } from "@/components/NewChaptersCarousel";
import { StoryCard } from "@/components/StoryCard";
import { RankingSidebar } from "@/components/RankingSidebar";
import { FilterSidebar, type FilterState } from "@/components/FilterSidebar";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { useStories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Search, BookOpen, TrendingUp, Sparkles, Crown, Eye, Star, Award, Heart } from "lucide-react";
import type { Story } from "@/lib/mock-data";

const FILTER_TABS = ["Xào trộn", "Ngẫu nhiên", "Mới", "Đầu trang", "Thảo luận"] as const;

function applyFilters(stories: Story[], filters: FilterState) {
  return stories.filter((s) => {
    if (filters.genres.length && !filters.genres.includes(s.genre)) return false;
    if (filters.statuses.length) {
      const statusMatch = filters.statuses.some(
        (st) => st.toLowerCase() === s.status
      );
      if (!statusMatch) return false;
    }
    if (filters.wordCounts.length) {
      const match = filters.wordCounts.some((wc) => {
        if (wc === "< 50k") return s.word_count < 50000;
        if (wc === "50k - 100k") return s.word_count >= 50000 && s.word_count < 100000;
        if (wc === "100k - 200k") return s.word_count >= 100000 && s.word_count < 200000;
        if (wc === "200k+") return s.word_count >= 200000;
        return true;
      });
      if (!match) return false;
    }
    return true;
  });
}

// ── Top Authors Component ──
function TopAuthors({ stories }: { stories: Story[] }) {
  // Aggregate authors from stories
  const authorMap = new Map<string, { name: string; views: number; stories: number; rating: number; ratingsCount: number }>();
  stories.forEach(s => {
    const existing = authorMap.get(s.author);
    if (existing) {
      existing.views += s.views;
      existing.stories += 1;
      existing.rating += s.rating;
      existing.ratingsCount += 1;
    } else {
      authorMap.set(s.author, { name: s.author, views: s.views, stories: 1, rating: s.rating, ratingsCount: 1 });
    }
  });
  const topAuthors = Array.from(authorMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const AUTHOR_COLORS = ["hsl(15 80% 55%)", "hsl(200 60% 50%)", "hsl(160 50% 45%)", "hsl(280 50% 50%)", "hsl(40 70% 50%)"];

  return (
    <section className="border-b border-border bg-muted/20">
      <div className="container py-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Crown className="h-4 w-4 text-gold" /> Top tác giả
          </h2>
          <Link to="/rankings" className="text-xs text-jade hover:underline">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topAuthors.map((author, i) => (
            <Link key={author.name} to={`/author/${encodeURIComponent(author.name)}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: AUTHOR_COLORS[i % AUTHOR_COLORS.length] }}>
                  {author.name.charAt(0).toUpperCase()}
                </div>
                {i < 3 && (
                  <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${
                    i === 0 ? "bg-gold" : i === 1 ? "bg-muted-foreground" : "bg-imperial/70"
                  }`}>{i + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{author.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" /> {(author.views / 1000).toFixed(0)}K</span>
                  <span className="flex items-center gap-0.5"><BookOpen className="h-2.5 w-2.5" /> {author.stories}</span>
                  <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-gold" /> {(author.rating / author.ratingsCount).toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── "Dành cho bạn" Section ──
function ForYouSection({ stories }: { stories: Story[] }) {
  // Simulate personalized recommendations based on genre preference
  const genreWeights: Record<string, number> = { "Fantasy": 3, "Romance": 2, "Sci-Fi": 1 };
  const recommended = [...stories]
    .sort((a, b) => (genreWeights[b.genre] || 0) - (genreWeights[a.genre] || 0) + (b.rating - a.rating))
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-gold" /> Dành cho bạn
        </h3>
        <span className="text-[10px] text-muted-foreground">Dựa trên sở thích đọc</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recommended.map(story => (
          <Link key={story.id} to={`/story/${story.id}`}
            className="group rounded-lg border border-border bg-card p-3 transition-all hover:border-jade/30 hover:shadow-sm">
            <div className="flex h-16 w-full items-center justify-center rounded border border-border text-2xl font-bold text-foreground/15 group-hover:text-foreground/25 transition-colors"
              style={{ backgroundColor: story.cover_color }}>
              {story.title.charAt(0)}
            </div>
            <p className="mt-2 text-xs font-semibold truncate">{story.title}</p>
            <p className="text-[10px] text-muted-foreground truncate">{story.author}</p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-gold" /> {story.rating}</span>
              <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" /> {(story.views / 1000).toFixed(0)}K</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileHome({ stories, isLoading }: { stories: Story[]; isLoading: boolean }) {
  return (
    <div className="px-4 py-3 space-y-4">
      <Link to="/search" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Tìm truyện, tác giả...</span>
      </Link>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {["🔥 Hot", "✨ Mới", "📖 Hoàn thành", "💜 Romance", "⚔️ Fantasy"].map(cat => (
          <Link key={cat} to="/genres" className="shrink-0 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">
            {cat}
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-card border border-border p-4">
        <h2 className="text-sm font-bold mb-2">
          <span className="text-imperial">m</span>Stories — Mạng xã hội truyện
        </h2>
        <div className="flex justify-around text-center">
          <div><p className="text-base font-bold text-imperial">17.9K</p><p className="text-[10px] text-muted-foreground">Tác giả</p></div>
          <div><p className="text-base font-bold text-jade">1.4M</p><p className="text-[10px] text-muted-foreground">Điểu bút</p></div>
          <div><p className="text-base font-bold text-gold">12.2M</p><p className="text-[10px] text-muted-foreground">Bình luận</p></div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-imperial" /> Truyện nổi bật
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            {stories.map(story => <StoryCard key={story.id} story={story} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    statuses: [],
    wordCounts: [],
  });
  const [activeTab, setActiveTab] = useState("Xào trộn");
  const { data: stories = [], isLoading } = useStories();
  const filtered = applyFilters(stories, filters);

  return (
    <ResponsiveLayout mobileContent={<MobileHome stories={stories} isLoading={isLoading} />}>
      <div className="min-h-screen bg-background">
        <Header />
        <Marquee />
        <HeroBanner />
        <RecentAuthors />
        <NewChaptersCarousel stories={stories} />
        <TopAuthors stories={stories} />

        <main className="container py-6">
          <div className="flex gap-6">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <span className="mr-2 text-sm font-semibold text-foreground">📝 Bài viết</span>
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? tab === "Xào trộn"
                          ? "bg-jade text-white"
                          : tab === "Ngẫu nhiên"
                          ? "bg-imperial text-white"
                          : "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* "Dành cho bạn" section */}
              <ForYouSection stories={stories} />

              <div className="mt-6 rounded-lg border border-border bg-card">
                {isLoading ? (
                  <div className="space-y-4 p-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
                  </div>
                ) : filtered.length > 0 ? (
                  filtered.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))
                ) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    Không có truyện phù hợp với bộ lọc.
                  </p>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <RankingSidebar stories={stories} />
            </div>
          </div>
        </main>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
