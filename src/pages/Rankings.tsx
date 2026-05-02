import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { VirtualCover } from "@/components/VirtualCover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStories } from "@/hooks/use-stories";
import { Eye, Heart, Star, Trophy, TrendingUp } from "lucide-react";
import type { Story } from "@/lib/mock-data";

function formatNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

const rankColors = [
  "bg-gold/10 border-gold/40 ring-2 ring-gold/20",
  "bg-muted/50 border-border",
  "bg-muted/30 border-border",
];

const TIME_PERIODS = [
  { label: "Hôm nay", value: "today" },
  { label: "Tuần này", value: "week" },
  { label: "Tháng này", value: "month" },
  { label: "Tất cả", value: "all" },
];

function RankList({ stories, metric }: { stories: Story[]; metric: "views" | "rating" | "comments" }) {
  const sorted = [...stories].sort((a, b) => b[metric] - a[metric]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 0, 2].map(idx => {
          const s = sorted[idx];
          if (!s) return null;
          const rank = idx + 1;
          const isFirst = idx === 0;
          return (
            <Link key={s.id} to={`/story/${s.id}`}
              className={`flex flex-col items-center rounded-lg border p-3 md:p-4 transition-all hover:shadow-md ${isFirst ? "order-first col-span-3 sm:col-span-1 sm:order-none " + rankColors[0] : rankColors[rank === 2 ? 1 : 2]} ${isFirst ? "sm:-mt-4" : ""}`}>
              <div className="relative">
                <VirtualCover title={s.title} color={s.cover_color} size="sm" />
                <div className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${rank === 1 ? "bg-gold" : "bg-muted-foreground"}`}>
                  {rank}
                </div>
              </div>
              <p className="mt-2 text-center text-xs font-semibold truncate w-full">{s.title}</p>
              <p className="text-[10px] text-muted-foreground">{s.author}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] gap-0.5">
                {metric === "views" && <><Eye className="h-2.5 w-2.5" /> {formatNum(s.views)}</>}
                {metric === "rating" && <><Star className="h-2.5 w-2.5 fill-gold text-gold" /> {s.rating}</>}
                {metric === "comments" && <><Heart className="h-2.5 w-2.5" /> {formatNum(s.comments)}</>}
              </Badge>
            </Link>
          );
        })}
      </div>

      {sorted.slice(3).map((s, i) => (
        <Link key={s.id} to={`/story/${s.id}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 md:p-4 transition-colors hover:bg-muted/50">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold text-muted-foreground">#{i + 4}</span>
          <VirtualCover title={s.title} color={s.cover_color} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.author}</p>
            <div className="mt-1 flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs gap-1">
                {metric === "views" && <><Eye className="h-3 w-3" /> {formatNum(s.views)}</>}
                {metric === "rating" && <><Star className="h-3 w-3 fill-gold text-gold" /> {s.rating}</>}
                {metric === "comments" && <><Heart className="h-3 w-3" /> {formatNum(s.comments)}</>}
              </Badge>
              <Badge variant="outline" className="text-xs">{s.genre}</Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const Rankings = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  const { data: stories = [], isLoading } = useStories();

  const content = (
    <main className="container max-w-3xl py-8 px-4">
      <div className="mb-6 text-center">
        <Trophy className="mx-auto mb-2 h-10 w-10 text-gold" />
        <h1 className="text-2xl font-bold">Bảng Xếp Hạng</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vinh danh những tác phẩm xuất sắc nhất</p>
      </div>

      <div className="mb-6 flex items-center justify-center gap-1.5 flex-wrap">
        {TIME_PERIODS.map(p => (
          <button key={p.value} onClick={() => setTimePeriod(p.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${timePeriod === p.value ? "bg-gold text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <Tabs defaultValue="views" className="w-full">
          <TabsList className="mb-6 w-full justify-center">
            <TabsTrigger value="views" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Top Lượt Xem</TabsTrigger>
            <TabsTrigger value="likes" className="gap-1.5"><Star className="h-3.5 w-3.5" /> Top Đánh Giá</TabsTrigger>
            <TabsTrigger value="follows" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Xu Hướng</TabsTrigger>
          </TabsList>

          <TabsContent value="views"><RankList stories={stories} metric="views" /></TabsContent>
          <TabsContent value="likes"><RankList stories={stories} metric="rating" /></TabsContent>
          <TabsContent value="follows"><RankList stories={stories} metric="comments" /></TabsContent>
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

export default Rankings;
