import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { VirtualCover } from "@/components/VirtualCover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStories, useChapters } from "@/hooks/use-stories";
import { BarChart3, BookOpen, FileText, Eye, Star, Clock, Plus, Edit, ExternalLink, Layers } from "lucide-react";

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

const AuthorDashboard = () => {
  const { data: stories = [], isLoading } = useStories();

  const totalViews = stories.reduce((s, st) => s + st.views, 0);
  const totalChapters = stories.reduce((s, st) => s + st.chapter_count, 0);
  const avgRating = stories.length > 0 ? (stories.reduce((s, st) => s + st.rating, 0) / stories.length).toFixed(1) : "0";

  const content = (
    <main className="container max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="border-l-4 border-jade pl-4 text-2xl font-bold">Quản lý tác phẩm</h1>
        <Button asChild className="bg-jade text-white hover:bg-jade/90">
          <Link to="/editor/new"><Plus className="mr-1.5 h-4 w-4" /> Tạo truyện mới</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
            <TabsTrigger value="overview" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BarChart3 className="h-3.5 w-3.5" /> Tổng quan
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BookOpen className="h-3.5 w-3.5" /> Quản lý truyện
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
              {[
                { icon: <BookOpen className="h-4 w-4 text-jade" />, label: "Tổng truyện", value: stories.length },
                { icon: <FileText className="h-4 w-4 text-imperial" />, label: "Tổng chương", value: totalChapters },
                { icon: <Eye className="h-4 w-4 text-jade" />, label: "Lượt đọc", value: formatNum(totalViews) },
                { icon: <Star className="h-4 w-4 text-gold" />, label: "Rating TB", value: avgRating },
              ].map((stat, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted">{stat.icon}</div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">Hoạt động gần đây</h3>
            <div className="space-y-2">
              {stories.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate"><span className="font-medium">{s.title}</span> — cập nhật lần cuối</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.updated_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories">
            <div className="space-y-3">
              {stories.map(s => (
                <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                  <VirtualCover title={s.title} color={s.cover_color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{s.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs">{s.genre}</Badge>
                      <Badge variant={s.status === "completed" ? "default" : "outline"} className="text-xs">
                        {s.status === "completed" ? "Hoàn thành" : s.status === "hiatus" ? "Tạm dừng" : "Đang ra"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{s.chapter_count} chương</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                      <Link to={`/editor/${s.id}`}><Edit className="h-3 w-3" /> Sửa</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
                      <Link to={`/story/${s.id}`}><ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
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

export default AuthorDashboard;
