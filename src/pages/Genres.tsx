import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { Badge } from "@/components/ui/badge";
import { mockStories } from "@/lib/mock-data";
import { Layers, BookOpen, Swords, Heart, Rocket, Ghost, Search, Sparkles, Globe, Wand2, Crown, Flame, Shield } from "lucide-react";

const GENRE_DATA = [
  { name: "Fantasy", icon: <Wand2 className="h-5 w-5" />, color: "bg-jade/10 text-jade border-jade/30", desc: "Thế giới phép thuật & tu tiên" },
  { name: "Romance", icon: <Heart className="h-5 w-5" />, color: "bg-imperial/10 text-imperial border-imperial/30", desc: "Tình yêu & lãng mạn" },
  { name: "Sci-Fi", icon: <Rocket className="h-5 w-5" />, color: "bg-primary/10 text-primary border-primary/30", desc: "Khoa học viễn tưởng" },
  { name: "Horror", icon: <Ghost className="h-5 w-5" />, color: "bg-foreground/10 text-foreground border-border", desc: "Kinh dị & rùng rợn" },
  { name: "Mystery", icon: <Search className="h-5 w-5" />, color: "bg-gold/10 text-gold border-gold/30", desc: "Trinh thám & bí ẩn" },
  { name: "Slice of Life", icon: <Sparkles className="h-5 w-5" />, color: "bg-jade/10 text-jade border-jade/30", desc: "Đời thường & cảm xúc" },
];

const POPULAR_TAGS = [
  "Xianxia", "Action", "Adventure", "Reincarnation", "System", "Apocalypse",
  "Dark", "Anti-hero", "Cyberpunk", "Magic", "Drama", "Slice of Life",
  "Huyền Huyễn", "Đô Thị", "Xuyên Không", "Trọng Sinh", "Cung Đấu", "Võng Du",
];

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = mockStories.filter(s => {
    if (selectedGenre && s.genre !== selectedGenre) return false;
    if (selectedTag && !s.tags.includes(selectedTag)) return false;
    return true;
  });

  const genreCounts = GENRE_DATA.map(g => ({
    ...g,
    count: mockStories.filter(s => s.genre === g.name).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Layers className="h-6 w-6 text-jade" /> Thể loại truyện
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Khám phá kho truyện phong phú theo thể loại yêu thích</p>
        </div>

        {/* Genre cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {genreCounts.map(g => (
            <button key={g.name}
              onClick={() => setSelectedGenre(selectedGenre === g.name ? null : g.name)}
              className={`rounded-lg border p-4 text-center transition-all hover:shadow-md ${selectedGenre === g.name ? g.color + " ring-2 ring-offset-2 ring-offset-background" : "border-border bg-card hover:bg-muted/50"}`}>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {g.icon}
              </div>
              <p className="text-sm font-semibold">{g.name}</p>
              <p className="text-[10px] text-muted-foreground">{g.desc}</p>
              <Badge variant="secondary" className="mt-2 text-[10px]">{g.count} truyện</Badge>
            </button>
          ))}
        </div>

        {/* Popular tags */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Tags phổ biến</h2>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map(tag => (
              <button key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${selectedTag === tag ? "bg-jade text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {(selectedGenre || selectedTag) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Đang lọc:</span>
            {selectedGenre && (
              <Badge variant="secondary" className="gap-1 text-xs cursor-pointer" onClick={() => setSelectedGenre(null)}>
                {selectedGenre} ✕
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1 text-xs cursor-pointer" onClick={() => setSelectedTag(null)}>
                {selectedTag} ✕
              </Badge>
            )}
            <button onClick={() => { setSelectedGenre(null); setSelectedTag(null); }} className="text-xs text-jade hover:underline">
              Xoá tất cả
            </button>
          </div>
        )}

        {/* Results */}
        <p className="mb-3 text-sm text-muted-foreground">{filtered.length} truyện</p>
        <div className="rounded-lg border border-border bg-card">
          {filtered.length > 0 ? (
            filtered.map(s => <StoryCard key={s.id} story={s} />)
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">Không tìm thấy truyện nào trong thể loại này.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Genres;
