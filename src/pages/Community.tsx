import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStories, mockAuthors } from "@/lib/mock-data";
import {
  MessageSquare, ThumbsUp, Share2, Pin, Flame, Clock, Send, Users,
  BookOpen, Star, TrendingUp, Heart, Eye, Award
} from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  authorColor: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  views: number;
  time: string;
  pinned?: boolean;
  hot?: boolean;
}

const mockPosts: ForumPost[] = [
  { id: "p1", author: "Trợ lý Otto", authorColor: "hsl(15 80% 55%)", title: "📢 Thông báo: Sự kiện Tết Nguyên Đán 2026 — Nhận 500 Sương Hoa miễn phí!", content: "Chào các bạn! Nhân dịp Tết Nguyên Đán, mStories tặng 500 Sương Hoa cho tất cả thành viên...", category: "Thông báo", likes: 234, replies: 45, views: 2100, time: "2 giờ trước", pinned: true },
  { id: "p2", author: "Đọc Truyện 24/7", authorColor: "hsl(200 60% 50%)", title: "Recommend truyện Fantasy hay nhất 2025 — Top 10 không thể bỏ lỡ", content: "Mình đã đọc hơn 200 truyện Fantasy trong năm qua, đây là top 10 pick cá nhân...", category: "Đề xuất", likes: 189, replies: 67, views: 3400, time: "5 giờ trước", hot: true },
  { id: "p3", author: "Tiểu Thư A", authorColor: "hsl(340 50% 50%)", title: "Review: The Villainess Reverses the Hourglass — Tại sao nó lại hay đến vậy?", content: "Nếu bạn chưa đọc truyện này thì hãy dừng mọi thứ lại. Đây là một tuyệt phẩm...", category: "Review", likes: 156, replies: 34, views: 1800, time: "8 giờ trước" },
  { id: "p4", author: "System Admin", authorColor: "hsl(160 40% 45%)", title: "Hỏi: Có ai biết truyện nào giống 'Ascension of the Eternal Emperor' không?", content: "Mình đã đọc hết rồi mà nghiện quá, muốn tìm truyện tương tự...", category: "Hỏi đáp", likes: 42, replies: 23, views: 560, time: "12 giờ trước" },
  { id: "p5", author: "Dark Soul", authorColor: "hsl(0 0% 30%)", title: "Thảo luận: Anti-hero trong truyện Xianxia — Hấp dẫn hay gượng ép?", content: "Gần đây có nhiều truyện Xianxia chuyển sang hướng anti-hero, các bạn nghĩ sao?", category: "Thảo luận", likes: 98, replies: 56, views: 1200, time: "1 ngày trước" },
  { id: "p6", author: "Void Walker", authorColor: "hsl(270 40% 50%)", title: "Tips viết truyện: Cách xây dựng power system hợp lý", content: "Sau 3 năm viết truyện Fantasy, mình rút ra được vài kinh nghiệm về power system...", category: "Sáng tác", likes: 201, replies: 78, views: 2800, time: "1 ngày trước", hot: true },
];

const CATEGORIES = ["Tất cả", "Thông báo", "Đề xuất", "Review", "Hỏi đáp", "Thảo luận", "Sáng tác"];

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState<"hot" | "new">("hot");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const filtered = activeCategory === "Tất cả" ? mockPosts : mockPosts.filter(p => p.category === activeCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === "hot") return b.likes - a.likes;
    return 0; // keep original order for "new"
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Users className="h-6 w-6 text-jade" /> Cộng đồng
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Nơi giao lưu, thảo luận và chia sẻ đam mê đọc truyện</p>
          </div>
          <Button onClick={() => setShowNewPost(!showNewPost)} className="bg-jade text-white hover:bg-jade/90 gap-1.5">
            <Send className="h-3.5 w-3.5" /> Đăng bài
          </Button>
        </div>

        {/* New post form */}
        {showNewPost && (
          <div className="mb-6 rounded-lg border-2 border-jade/30 bg-jade/5 p-5 space-y-3">
            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Tiêu đề bài viết..." className="font-semibold" />
            <Textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Nội dung bài viết..." className="min-h-[100px]" />
            <div className="flex items-center gap-3">
              <Button className="bg-jade text-white hover:bg-jade/90" size="sm">Đăng bài</Button>
              <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>Huỷ</Button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Category tabs */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-jade text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="mb-4 flex items-center gap-2">
              <button onClick={() => setSortBy("hot")} className={`flex items-center gap-1 text-xs font-medium ${sortBy === "hot" ? "text-imperial" : "text-muted-foreground"}`}>
                <Flame className="h-3 w-3" /> Nổi bật
              </button>
              <span className="text-muted-foreground">·</span>
              <button onClick={() => setSortBy("new")} className={`flex items-center gap-1 text-xs font-medium ${sortBy === "new" ? "text-jade" : "text-muted-foreground"}`}>
                <Clock className="h-3 w-3" /> Mới nhất
              </button>
            </div>

            {/* Posts */}
            <div className="space-y-3">
              {sorted.map(post => (
                <div key={post.id} className={`rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30 ${post.pinned ? "border-gold/40 bg-gold/5" : "border-border"}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: post.authorColor }}>
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.pinned && <Badge className="bg-gold text-white text-[10px] gap-0.5"><Pin className="h-2.5 w-2.5" /> Ghim</Badge>}
                        {post.hot && <Badge className="bg-imperial text-white text-[10px] gap-0.5"><Flame className="h-2.5 w-2.5" /> Hot</Badge>}
                        <Badge variant="outline" className="text-[10px]">{post.category}</Badge>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold leading-snug">{post.title}</h3>
                      <p className="mt-1 text-xs text-foreground/70 line-clamp-2">{post.content}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">{post.author}</span>
                        <span>{post.time}</span>
                        <span className="flex items-center gap-0.5"><ThumbsUp className="h-3 w-3" /> {post.likes}</span>
                        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> {post.replies}</span>
                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden w-64 shrink-0 lg:block space-y-4">
            {/* Community stats */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Thống kê cộng đồng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Thành viên</span><span className="font-semibold">12,458</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Bài viết</span><span className="font-semibold">3,241</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Online</span><span className="font-semibold text-jade">156</span></div>
              </div>
            </div>

            {/* Hot topics */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Chủ đề nóng
              </h3>
              <div className="space-y-2">
                {["#SuKienTet2026", "#TopFantasy", "#ReviewTruyen", "#TipsSangTac", "#XianxiaFan"].map(tag => (
                  <button key={tag} className="block text-xs text-jade hover:underline">{tag}</button>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                <Award className="h-3 w-3" /> Cống hiến nhiều nhất
              </h3>
              <div className="space-y-2">
                {mockAuthors.slice(0, 3).map((a, i) => (
                  <Link key={a.id} to={`/author/${encodeURIComponent(a.name)}`} className="flex items-center gap-2 text-xs hover:text-jade">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: a.color }}>{a.initial}</div>
                    <span className="truncate">{a.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
