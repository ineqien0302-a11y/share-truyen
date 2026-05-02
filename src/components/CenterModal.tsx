import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VirtualCover } from "@/components/VirtualCover";
import { mockStories, mockAuthors } from "@/lib/mock-data";
import { Sparkles, CalendarCheck, ShoppingBag, Heart, Crown, Gift, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const shopItems = [
  { id: "s1", name: "Bó Hoa Sương", price: 50, icon: "🌸", desc: "Tặng cho tác giả yêu thích" },
  { id: "s2", name: "Vương Miện Vàng", price: 200, icon: "👑", desc: "Quà VIP cho tác giả xuất sắc" },
  { id: "s3", name: "Trái Tim Pha Lê", price: 100, icon: "💎", desc: "Thể hiện sự ủng hộ đặc biệt" },
  { id: "s4", name: "Ngôi Sao May Mắn", price: 30, icon: "⭐", desc: "Tặng may mắn cho tác giả" },
];

export function CenterModal() {
  const [checkedDays, setCheckedDays] = useState([0, 1, 2]); // Mon-Wed checked
  const today = 3; // Thursday

  const handleCheckIn = () => {
    if (!checkedDays.includes(today)) {
      setCheckedDays(prev => [...prev, today]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-imperial" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-gold" /> Trung Tâm</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="checkin" className="mt-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="checkin" className="text-xs gap-1"><CalendarCheck className="h-3 w-3" /> Điểm danh</TabsTrigger>
            <TabsTrigger value="shop" className="text-xs gap-1"><ShoppingBag className="h-3 w-3" /> Cửa hàng</TabsTrigger>
            <TabsTrigger value="foryou" className="text-xs gap-1"><Heart className="h-3 w-3" /> Dành cho bạn</TabsTrigger>
            <TabsTrigger value="topauthors" className="text-xs gap-1"><Crown className="h-3 w-3" /> Đại thần</TabsTrigger>
          </TabsList>

          {/* Check-in */}
          <TabsContent value="checkin" className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-semibold">Điểm danh tuần này</p>
              <p className="text-xs text-muted-foreground mt-1">Mỗi ngày nhận 10 🌸 Sương Hoa</p>
              <div className="mt-4 flex justify-center gap-2">
                {WEEK_DAYS.map((d, i) => (
                  <div key={d} className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg text-xs font-medium ${checkedDays.includes(i) ? "bg-jade text-white" : i === today ? "border-2 border-jade bg-background" : "bg-muted text-muted-foreground"}`}>
                    {checkedDays.includes(i) ? <Check className="h-3.5 w-3.5" /> : d}
                  </div>
                ))}
              </div>
              <Button onClick={handleCheckIn} disabled={checkedDays.includes(today)} className="mt-4 bg-jade text-white hover:bg-jade/90" size="sm">
                {checkedDays.includes(today) ? "Đã điểm danh ✓" : "Điểm danh hôm nay (+10 🌸)"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">Số dư: <span className="font-semibold text-gold">🌸 {checkedDays.length * 10} Sương Hoa</span></p>
            </div>
          </TabsContent>

          {/* Shop */}
          <TabsContent value="shop" className="space-y-3">
            <p className="text-xs text-muted-foreground">Mua quà tặng cho tác giả yêu thích</p>
            {shopItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  <Gift className="h-3 w-3" /> 🌸 {item.price}
                </Button>
              </div>
            ))}
          </TabsContent>

          {/* For You */}
          <TabsContent value="foryou" className="space-y-3">
            <p className="text-xs text-muted-foreground">Gợi ý dựa trên sở thích của bạn</p>
            {mockStories.slice(0, 4).map(s => (
              <Link key={s.id} to={`/story/${s.id}`} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                <VirtualCover title={s.title} color={s.cover_color} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    <span className="text-xs text-gold">{s.rating}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">{s.genre}</Badge>
              </Link>
            ))}
          </TabsContent>

          {/* Top Authors */}
          <TabsContent value="topauthors" className="space-y-3">
            <p className="text-xs text-muted-foreground">Vinh danh các tác giả xuất sắc</p>
            {mockAuthors.map((a, i) => (
              <Link key={a.id} to={`/author/${encodeURIComponent(a.name)}`} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm" style={{ backgroundColor: a.color }}>
                  {a.initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && <Crown className="h-4 w-4 text-gold" />}
                    <p className="text-sm font-semibold">{a.name}</p>
                  </div>
                  {a.badge && <Badge variant="secondary" className="text-[10px] mt-0.5">{a.badge}</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{a.lastActive}</span>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
