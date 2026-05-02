import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { StoryCard } from "@/components/StoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStories } from "@/hooks/use-stories";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";

const GENRES = ["Fantasy", "Romance", "Sci-Fi", "Horror", "Mystery", "Slice of Life", "History"];
const STATUSES = ["ongoing", "completed", "hiatus"] as const;
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Hot nhất", value: "hottest" },
  { label: "Đánh giá cao", value: "top_rated" },
  { label: "Nhiều chữ nhất", value: "most_words" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);
  const { data: stories = [], isLoading } = useStories();

  const toggleGenre = (g: string) => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleStatus = (s: string) => setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const results = useMemo(() => {
    let filtered = stories.filter(s => {
      if (query) {
        const q = query.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.author.toLowerCase().includes(q) && !s.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      if (selectedGenres.length && !selectedGenres.includes(s.genre)) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(s.status)) return false;
      return true;
    });

    switch (sortBy) {
      case "hottest": filtered.sort((a, b) => b.views - a.views); break;
      case "top_rated": filtered.sort((a, b) => b.rating - a.rating); break;
      case "most_words": filtered.sort((a, b) => b.word_count - a.word_count); break;
      default: filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    return filtered;
  }, [stories, query, selectedGenres, selectedStatuses, sortBy]);

  const clearAll = () => { setQuery(""); setSelectedGenres([]); setSelectedStatuses([]); setSortBy("newest"); };

  const content = (
    <main className="container max-w-4xl py-8 px-4">
      <h1 className="mb-6 border-l-4 border-imperial pl-4 text-2xl font-bold">Tìm kiếm truyện</h1>

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm theo tên truyện, tác giả, tag..." className="pl-10 pr-10" />
        {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
      </div>

      <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="mb-4 text-muted-foreground">
        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
      </Button>

      {showFilters && (
        <div className="mb-6 space-y-4 rounded-lg border border-border bg-card p-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Thể loại</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <Badge key={g} variant={selectedGenres.includes(g) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleGenre(g)}>{g}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Trạng thái</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <Badge key={s} variant={selectedStatuses.includes(s) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleStatus(s)}>
                  {s === "completed" ? "Hoàn thành" : s === "hiatus" ? "Tạm dừng" : "Đang ra"}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Sắp xếp</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(o => (
                <Badge key={o.value} variant={sortBy === o.value ? "default" : "outline"} className="cursor-pointer" onClick={() => setSortBy(o.value)}>{o.label}</Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">Xoá tất cả bộ lọc</Button>
        </div>
      )}

      <p className="mb-3 text-sm text-muted-foreground">Tìm thấy {results.length} truyện</p>
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="space-y-4 p-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
        ) : results.length > 0 ? results.map(s => <StoryCard key={s.id} story={s} />) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Không tìm thấy truyện phù hợp.</p>
        )}
      </div>
    </main>
  );

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <Header />
        {content}
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
