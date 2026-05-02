import { useState } from "react";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useStories } from "@/hooks/use-stories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Heart, Bookmark, BookOpen, Clock, Trash2, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import type { Story } from "@/lib/mock-data";

function ReadingProgressCard({ story }: { story: Story }) {
  const progress = Math.floor(Math.random() * 80) + 10;
  const lastChapter = Math.floor(story.chapter_count * progress / 100);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded border border-border text-lg font-bold text-foreground/20" style={{ backgroundColor: story.cover_color }}>
        {story.title.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <Link to={`/story/${story.id}`} className="text-sm font-semibold hover:text-jade truncate block">{story.title}</Link>
        <p className="text-xs text-muted-foreground">{story.author}</p>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-[10px] text-muted-foreground">{progress}%</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>Ch.{lastChapter}/{story.chapter_count}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <Button asChild size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1 text-xs h-7">
          <Link to={`/read/${story.id}/${lastChapter + 1}`}><Play className="h-3 w-3" /> Tiếp</Link>
        </Button>
      </div>
    </div>
  );
}

const Library = () => {
  const { data: stories = [], isLoading } = useStories();
  const [searchQuery, setSearchQuery] = useState("");

  const filterStories = (list: Story[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(s => s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q));
  };

  // Simulate user collections using subsets of real stories
  const followed = stories.slice(0, 3);
  const favorites = stories.slice(1, 4);
  const bookmarked = stories.slice(2, 5);
  const reading = stories.slice(0, 4);

  const content = (
    <main className="container max-w-4xl py-8 px-4">
      <h1 className="mb-2 border-l-4 border-jade pl-4 text-2xl font-bold">Tủ truyện của tôi</h1>
      <p className="mb-6 pl-4 text-sm text-muted-foreground">Quản lý truyện theo dõi, yêu thích và tiến trình đọc</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm trong tủ truyện..." className="pl-9 h-9" />
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none overflow-x-auto">
            <TabsTrigger value="history" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BookOpen className="h-3.5 w-3.5" /> Đang đọc
              <Badge variant="secondary" className="ml-1 text-[10px]">{reading.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Bell className="h-3.5 w-3.5" /> Theo dõi
              <Badge variant="secondary" className="ml-1 text-[10px]">{followed.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-imperial data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Heart className="h-3.5 w-3.5" /> Yêu thích
              <Badge variant="secondary" className="ml-1 text-[10px]">{favorites.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Bookmark className="h-3.5 w-3.5" /> Đánh dấu
              <Badge variant="secondary" className="ml-1 text-[10px]">{bookmarked.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <div className="space-y-3">
              {reading.map(story => <ReadingProgressCard key={story.id} story={story} />)}
            </div>
          </TabsContent>

          {[
            { value: "following", data: filterStories(followed), empty: "Bạn chưa theo dõi truyện nào." },
            { value: "favorites", data: filterStories(favorites), empty: "Bạn chưa yêu thích truyện nào." },
            { value: "bookmarks", data: filterStories(bookmarked), empty: "Bạn chưa đánh dấu truyện nào." },
          ].map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="rounded-lg border border-border bg-card">
                {tab.data.length > 0 ? tab.data.map(s => <StoryCard key={s.id} story={s} />) : (
                  <div className="py-16 text-center">
                    <p className="text-sm text-muted-foreground">{tab.empty}</p>
                    <Button asChild variant="link" className="mt-2"><Link to="/">Khám phá truyện →</Link></Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
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

export default Library;
