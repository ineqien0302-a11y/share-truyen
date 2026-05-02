import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Users, Star, Flame, Gift, ArrowRight, Calendar, Award, BookOpen, ChevronRight } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description: string;
  prize: string;
  genre: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "active" | "ended";
  entries: { rank: number; title: string; author: string; votes: number }[];
}

const CONTESTS: Contest[] = [
  {
    id: "c1",
    title: "Xuân Về Bút Nở — Cuộc thi truyện ngắn mùa xuân",
    description: "Viết truyện ngắn dưới 20.000 từ với chủ đề mùa xuân, khởi đầu mới, hoặc hy vọng. Tác phẩm xuất sắc nhất sẽ được đăng trang chủ và nhận phần thưởng hấp dẫn.",
    prize: "5.000 🌸 + Huy hiệu Vàng + Đăng trang chủ 1 tuần",
    genre: "Tất cả thể loại",
    startDate: "2026-02-01",
    endDate: "2026-03-15",
    participants: 127,
    maxParticipants: 500,
    status: "active",
    entries: [
      { rank: 1, title: "Hạt Giống Mùa Xuân", author: "Lam Phong", votes: 342 },
      { rank: 2, title: "Ánh Nắng Đầu Tiên", author: "Tiểu Vũ", votes: 298 },
      { rank: 3, title: "Cánh Đào Bay", author: "Nguyệt Hà", votes: 256 },
      { rank: 4, title: "Giấc Mơ Tháng Ba", author: "Minh Ngọc", votes: 201 },
      { rank: 5, title: "Lời Hứa Dưới Mưa", author: "Hải Yến", votes: 189 },
    ],
  },
  {
    id: "c2",
    title: "Huyền Ảo Kỳ Duyên — Fantasy Grand Prix",
    description: "Cuộc thi dành cho các tác phẩm Fantasy/Xianxia. Yêu cầu tối thiểu 3 chương, tối đa 50.000 từ. Đánh giá bởi ban giám khảo và bình chọn của độc giả.",
    prize: "10.000 🌸 + Hợp đồng xuất bản + Huy hiệu Đại Thần",
    genre: "Fantasy / Xianxia",
    startDate: "2026-03-01",
    endDate: "2026-05-01",
    participants: 0,
    maxParticipants: 300,
    status: "upcoming",
    entries: [],
  },
  {
    id: "c3",
    title: "Tình Yêu Trong Trang Sách — Romance Writing Contest",
    description: "Cuộc thi viết truyện ngôn tình hay nhất năm. Tác phẩm phải là truyện gốc, chưa từng đăng ở bất kỳ nền tảng nào.",
    prize: "3.000 🌸 + Huy hiệu Bạc + Feature 3 ngày",
    genre: "Romance",
    startDate: "2025-12-01",
    endDate: "2026-01-31",
    participants: 89,
    maxParticipants: 200,
    status: "ended",
    entries: [
      { rank: 1, title: "Nếu Lần Đầu Là Cuối", author: "Tuyết Mai", votes: 512 },
      { rank: 2, title: "Hẹn Ước Sao Đêm", author: "An Nhiên", votes: 445 },
      { rank: 3, title: "Mùi Hương Cũ", author: "Vân Anh", votes: 398 },
    ],
  },
];

function statusLabel(s: Contest["status"]) {
  if (s === "active") return <Badge className="bg-jade text-white text-[10px]">Đang diễn ra</Badge>;
  if (s === "upcoming") return <Badge variant="outline" className="text-[10px] border-gold text-gold">Sắp diễn ra</Badge>;
  return <Badge variant="secondary" className="text-[10px]">Đã kết thúc</Badge>;
}

function daysRemaining(endDate: string) {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const ContestPage = () => {
  const [tab, setTab] = useState("active");

  const filtered = tab === "all" ? CONTESTS :
    tab === "active" ? CONTESTS.filter(c => c.status === "active") :
    tab === "upcoming" ? CONTESTS.filter(c => c.status === "upcoming") :
    CONTESTS.filter(c => c.status === "ended");

  const content = (
    <main className="container max-w-4xl py-8 px-4">
      <div className="mb-8 text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-gold" />
        <h1 className="text-2xl font-bold">Cuộc Thi Sáng Tạo</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Tham gia các cuộc thi viết truyện để thể hiện tài năng, giành giải thưởng hấp dẫn và được cộng đồng công nhận.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <Trophy className="mx-auto mb-1 h-5 w-5 text-gold" />
          <p className="text-lg font-bold">{CONTESTS.length}</p>
          <p className="text-[10px] text-muted-foreground">Cuộc thi</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-jade" />
          <p className="text-lg font-bold">{CONTESTS.reduce((s, c) => s + c.participants, 0)}</p>
          <p className="text-[10px] text-muted-foreground">Thí sinh</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <Gift className="mx-auto mb-1 h-5 w-5 text-imperial" />
          <p className="text-lg font-bold">18.000</p>
          <p className="text-[10px] text-muted-foreground">🌸 Tổng giải</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <Flame className="mx-auto mb-1 h-5 w-5 text-imperial" />
          <p className="text-lg font-bold">{CONTESTS.filter(c => c.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">Đang diễn ra</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
          {[
            { v: "all", l: "Tất cả" },
            { v: "active", l: "Đang diễn ra" },
            { v: "upcoming", l: "Sắp tới" },
            { v: "ended", l: "Đã kết thúc" },
          ].map(t => (
            <TabsTrigger key={t.v} value={t.v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs">
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="space-y-4">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Chưa có cuộc thi nào trong mục này.</p>
          ) : filtered.map(contest => (
            <div key={contest.id} className={`rounded-lg border bg-card p-5 transition-all ${contest.status === "active" ? "border-gold/40 ring-1 ring-gold/20" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {statusLabel(contest.status)}
                    <Badge variant="outline" className="text-[10px]">{contest.genre}</Badge>
                  </div>
                  <h2 className="text-lg font-bold">{contest.title}</h2>
                </div>
                {contest.status === "active" && (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Còn lại</p>
                    <p className="text-lg font-bold text-imperial">{daysRemaining(contest.endDate)} ngày</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3">{contest.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Gift className="h-3 w-3 text-gold" /> {contest.prize}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {contest.startDate} → {contest.endDate}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {contest.participants}/{contest.maxParticipants}</span>
              </div>

              {contest.participants > 0 && (
                <div className="mb-3">
                  <Progress value={(contest.participants / contest.maxParticipants) * 100} className="h-1.5" />
                </div>
              )}

              {/* Leaderboard */}
              {contest.entries.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase flex items-center gap-1">
                    <Award className="h-3 w-3" /> Bảng xếp hạng
                  </p>
                  <div className="space-y-1.5">
                    {contest.entries.slice(0, 5).map(entry => (
                      <div key={entry.rank} className="flex items-center gap-2 text-sm">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          entry.rank === 1 ? "bg-gold text-white" : entry.rank === 2 ? "bg-muted-foreground/20 text-foreground" : entry.rank === 3 ? "bg-imperial/20 text-imperial" : "bg-muted text-muted-foreground"
                        }`}>{entry.rank}</span>
                        <span className="font-medium flex-1 truncate">{entry.title}</span>
                        <span className="text-xs text-muted-foreground">{entry.author}</span>
                        <span className="text-xs text-gold flex items-center gap-0.5"><Star className="h-2.5 w-2.5" /> {entry.votes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {contest.status === "active" && (
                  <Button size="sm" className="bg-gold text-white hover:bg-gold/90 gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> Tham gia cuộc thi
                  </Button>
                )}
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  Xem chi tiết <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
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

export default ContestPage;
