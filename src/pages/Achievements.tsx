import { useState } from "react";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy, BookOpen, MessageSquare, Star, Heart, Clock, Flame, Zap, Shield, Award,
  Crown, Sparkles, Gift, Eye, Target, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  progress: number;
  max: number;
  current: number;
  unlocked: boolean;
  color: string;
  category: string;
  xpReward: number;
  flowerReward: number;
  claimed: boolean;
}

const achievements: Achievement[] = [
  { id: "a1", icon: <BookOpen className="h-5 w-5" />, title: "Mọt Sách", desc: "Đọc 10 truyện", progress: 70, max: 10, current: 7, unlocked: false, color: "text-jade", category: "Đọc truyện", xpReward: 100, flowerReward: 50, claimed: false },
  { id: "a2", icon: <MessageSquare className="h-5 w-5" />, title: "Nhà Bình Luận", desc: "Viết 50 bình luận", progress: 40, max: 50, current: 20, unlocked: false, color: "text-imperial", category: "Tương tác", xpReward: 150, flowerReward: 80, claimed: false },
  { id: "a3", icon: <Star className="h-5 w-5" />, title: "Người Đánh Giá", desc: "Đánh giá 20 truyện", progress: 100, max: 20, current: 20, unlocked: true, color: "text-gold", category: "Tương tác", xpReward: 120, flowerReward: 60, claimed: false },
  { id: "a4", icon: <Heart className="h-5 w-5" />, title: "Người Hâm Mộ", desc: "Yêu thích 15 truyện", progress: 60, max: 15, current: 9, unlocked: false, color: "text-imperial", category: "Tương tác", xpReward: 80, flowerReward: 40, claimed: false },
  { id: "a5", icon: <Flame className="h-5 w-5" />, title: "Điểm Danh 7 Ngày", desc: "Điểm danh 7 ngày liên tiếp", progress: 100, max: 7, current: 7, unlocked: true, color: "text-gold", category: "Hàng ngày", xpReward: 200, flowerReward: 100, claimed: true },
  { id: "a6", icon: <Clock className="h-5 w-5" />, title: "Đọc Xuyên Đêm", desc: "Đọc truyện sau 12h đêm", progress: 100, max: 1, current: 1, unlocked: true, color: "text-jade", category: "Đặc biệt", xpReward: 50, flowerReward: 30, claimed: true },
  { id: "a7", icon: <Zap className="h-5 w-5" />, title: "Tốc Độ", desc: "Đọc hết 1 truyện trong 1 ngày", progress: 0, max: 1, current: 0, unlocked: false, color: "text-muted-foreground", category: "Đặc biệt", xpReward: 300, flowerReward: 150, claimed: false },
  { id: "a8", icon: <Gift className="h-5 w-5" />, title: "Bảo Trợ", desc: "Tặng quà cho 5 tác giả", progress: 20, max: 5, current: 1, unlocked: false, color: "text-jade", category: "Tương tác", xpReward: 250, flowerReward: 120, claimed: false },
  { id: "a9", icon: <Crown className="h-5 w-5" />, title: "Huyền Thoại", desc: "Đạt tất cả thành tựu", progress: 33, max: 8, current: 3, unlocked: false, color: "text-gold", category: "Đặc biệt", xpReward: 1000, flowerReward: 500, claimed: false },
  { id: "a10", icon: <Eye className="h-5 w-5" />, title: "Nghìn Chương", desc: "Đọc tổng cộng 1000 chương", progress: 89, max: 1000, current: 892, unlocked: false, color: "text-jade", category: "Đọc truyện", xpReward: 500, flowerReward: 250, claimed: false },
  { id: "a11", icon: <Target className="h-5 w-5" />, title: "Streak 30 Ngày", desc: "Điểm danh 30 ngày liên tiếp", progress: 47, max: 30, current: 14, unlocked: false, color: "text-imperial", category: "Hàng ngày", xpReward: 500, flowerReward: 200, claimed: false },
  { id: "a12", icon: <Shield className="h-5 w-5" />, title: "Triệu Chữ", desc: "Đọc tổng cộng 1 triệu từ", progress: 85, max: 1000000, current: 850000, unlocked: false, color: "text-jade", category: "Đọc truyện", xpReward: 800, flowerReward: 400, claimed: false },
];

const CATEGORIES = ["Tất cả", "Đọc truyện", "Tương tác", "Hàng ngày", "Đặc biệt"];

const Achievements = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [items, setItems] = useState(achievements);
  const { toast } = useToast();

  const unlocked = items.filter(a => a.unlocked).length;
  const claimable = items.filter(a => a.unlocked && !a.claimed).length;
  const totalXP = items.filter(a => a.claimed).reduce((s, a) => s + a.xpReward, 0);

  const filtered = activeCategory === "Tất cả" ? items : items.filter(a => a.category === activeCategory);

  const claimReward = (id: string) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, claimed: true } : a));
    const achievement = items.find(a => a.id === id);
    if (achievement) {
      toast({
        title: "🎉 Nhận thưởng thành công!",
        description: `+${achievement.xpReward} XP, +${achievement.flowerReward} 🌸 Sương Hoa`,
      });
    }
  };

  return (
    <ResponsiveLayout>
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="mb-6 text-center">
          <Trophy className="mx-auto mb-2 h-10 w-10 text-gold" />
          <h1 className="text-2xl font-bold">Thành Tựu</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hoàn thành thử thách để nhận huy hiệu, XP và Sương Hoa</p>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-gold">{unlocked}/{items.length}</p>
            <p className="text-xs text-muted-foreground">Đã mở khoá</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-jade">{totalXP}</p>
            <p className="text-xs text-muted-foreground">XP đã nhận</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-imperial">{claimable}</p>
            <p className="text-xs text-muted-foreground">Chờ nhận thưởng</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Progress value={(unlocked / items.length) * 100} className="h-2 mt-1" />
            <p className="text-xs text-muted-foreground mt-1">{Math.round((unlocked / items.length) * 100)}% hoàn thành</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-gold text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(a => (
            <div key={a.id} className={`rounded-lg border p-4 transition-all ${a.unlocked ? "border-gold/40 bg-gold/5" : "border-border bg-card"} ${a.unlocked && !a.claimed ? "ring-2 ring-gold/30 ring-offset-2 ring-offset-background" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${a.unlocked ? "bg-gold/20" : "bg-muted"} ${a.color}`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{a.title}</p>
                    {a.claimed && <CheckCircle2 className="h-3.5 w-3.5 text-jade" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>+{a.xpReward} XP</span>
                    <span>+{a.flowerReward} 🌸</span>
                    <Badge variant="outline" className="text-[10px] h-4">{a.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{a.current >= 1000 ? (a.current/1000).toFixed(0) + "K" : a.current}/{a.max >= 1000 ? (a.max/1000).toFixed(0) + "K" : a.max}</span>
                  <span>{a.progress}%</span>
                </div>
                <Progress value={a.progress} className="h-1.5" />
              </div>
              {a.unlocked && !a.claimed && (
                <Button onClick={() => claimReward(a.id)} size="sm" className="mt-3 w-full bg-gold text-white hover:bg-gold/90 gap-1 text-xs">
                  <Sparkles className="h-3 w-3" /> Nhận thưởng
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
    </ResponsiveLayout>
  );
};

export default Achievements;
