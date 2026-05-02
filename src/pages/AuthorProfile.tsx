import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { StoryCard } from "@/components/StoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoriesByAuthor } from "@/hooks/use-stories";
import { BookOpen, Eye, Star, Users, ArrowLeft, Award, Bell, Gift, Heart, MessageSquare, Send, ThumbsUp, Shield, Flame, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 text-center">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-background">{icon}</div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

// ── Mock wall messages ──
interface WallMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isAuthor: boolean;
}

const MOCK_WALL: WallMessage[] = [
  { id: "w1", user: "Độc Giả Cuồng Nhiệt", avatar: "Đ", text: "Tác giả ơi ra chương mới đi, chờ quá trời rồi! 🔥🔥🔥", time: "2 giờ trước", likes: 24, isAuthor: false },
  { id: "w2", user: "Tác giả", avatar: "★", text: "Cảm ơn mọi người đã ủng hộ! Chương mới sẽ ra vào cuối tuần nhé ❤️", time: "1 giờ trước", likes: 56, isAuthor: true },
  { id: "w3", user: "Fan Cứng", avatar: "F", text: "Đã theo dõi từ chapter 1, không bao giờ thất vọng. Tác giả viết tốt lắm!", time: "5 giờ trước", likes: 18, isAuthor: false },
  { id: "w4", user: "Mọt Sách", avatar: "M", text: "Nhân vật phản diện arc này hay quá, mong có thêm back story", time: "1 ngày trước", likes: 9, isAuthor: false },
];

// ── Mock badges ──
const AUTHOR_BADGES = [
  { icon: <Crown className="h-3.5 w-3.5" />, name: "Đại Thần", color: "text-gold bg-gold/10" },
  { icon: <Flame className="h-3.5 w-3.5" />, name: "100K Lượt đọc", color: "text-imperial bg-imperial/10" },
  { icon: <Shield className="h-3.5 w-3.5" />, name: "Tác giả Uy tín", color: "text-jade bg-jade/10" },
  { icon: <Award className="h-3.5 w-3.5" />, name: "Top 10 tháng", color: "text-gold bg-gold/10" },
];

const AuthorProfile = () => {
  const { authorName } = useParams<{ authorName: string }>();
  const decodedName = decodeURIComponent(authorName || "");
  const { data: authorStories = [], isLoading } = useStoriesByAuthor(decodedName);
  const { toast } = useToast();

  const [isFollowing, setIsFollowing] = useState(false);
  const [wallMessages, setWallMessages] = useState(MOCK_WALL);
  const [newWallMsg, setNewWallMsg] = useState("");

  const totalViews = authorStories.reduce((sum, s) => sum + s.views, 0);
  const totalChapters = authorStories.reduce((sum, s) => sum + s.chapter_count, 0);
  const avgRating = authorStories.length > 0
    ? authorStories.reduce((sum, s) => sum + s.rating, 0) / authorStories.length : 0;

  const initial = decodedName.charAt(0).toUpperCase();
  const followers = Math.floor(totalViews / 50) + 120;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Đã bỏ theo dõi" : "Đã theo dõi!",
      description: isFollowing ? `Bạn đã bỏ theo dõi ${decodedName}` : `Bạn đang theo dõi ${decodedName}`,
    });
  };

  const handleWallPost = () => {
    if (!newWallMsg.trim()) return;
    setWallMessages(prev => [{
      id: `w-${Date.now()}`,
      user: "Bạn",
      avatar: "B",
      text: newWallMsg,
      time: "Vừa xong",
      likes: 0,
      isAuthor: false,
    }, ...prev]);
    setNewWallMsg("");
  };

  const handleGift = () => {
    toast({ title: "🌸 Tặng quà", description: `Đã tặng 10 Sương Hoa cho ${decodedName}!` });
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-3xl py-6 px-4">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Trang chủ
          </Link>

          {/* Author header */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-jade text-2xl font-bold text-white shadow-md">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-foreground">{decodedName}</h1>
                <p className="mt-1 text-sm text-foreground/70">
                  Tác giả của {authorStories.length} tác phẩm trên mStories.
                </p>

                {/* Badges */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {AUTHOR_BADGES.map((badge, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}>
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleFollow}
                    className={isFollowing ? "bg-jade text-white hover:bg-jade/90" : "border-jade text-jade hover:bg-jade/10"}
                    variant={isFollowing ? "default" : "outline"}>
                    <Bell className={`mr-1.5 h-3.5 w-3.5 ${isFollowing ? "fill-current" : ""}`} />
                    {isFollowing ? `Đang theo dõi` : "Theo dõi"}
                  </Button>
                  <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold/10 gap-1" onClick={handleGift}>
                    <Gift className="h-3.5 w-3.5" /> Tặng Sương Hoa
                  </Button>
                  <Button size="sm" variant="outline" className="border-imperial text-imperial hover:bg-imperial/10 gap-1">
                    <Heart className="h-3.5 w-3.5" /> Yêu thích
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <StatCard icon={<BookOpen className="h-4 w-4 text-jade" />} label="Tác phẩm" value={String(authorStories.length)} />
              <StatCard icon={<Eye className="h-4 w-4 text-jade" />} label="Lượt xem" value={formatNumber(totalViews)} />
              <StatCard icon={<Star className="h-4 w-4 text-gold" />} label="Đánh giá TB" value={avgRating.toFixed(1)} />
              <StatCard icon={<Users className="h-4 w-4 text-imperial" />} label="Người theo dõi" value={formatNumber(followers)} />
              <StatCard icon={<MessageSquare className="h-4 w-4 text-jade" />} label="Chương" value={formatNumber(totalChapters)} />
            </div>
          </div>

          {/* Tabs: Stories + Wall */}
          <Tabs defaultValue="stories" className="mt-6">
            <TabsList className="w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
              <TabsTrigger value="stories" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <BookOpen className="h-3.5 w-3.5" /> Tác phẩm ({authorStories.length})
              </TabsTrigger>
              <TabsTrigger value="wall" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <MessageSquare className="h-3.5 w-3.5" /> Tường nhà ({wallMessages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories" className="mt-4">
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
              ) : authorStories.length > 0 ? (
                <div className="rounded-lg border border-border bg-card">
                  {authorStories.map(story => <StoryCard key={story.id} story={story} />)}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card py-16 text-center">
                  <p className="text-sm text-muted-foreground">Tác giả chưa có tác phẩm nào.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wall" className="mt-4">
              {/* Post form */}
              <div className="mb-4 flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade/10 text-sm font-bold text-jade">B</div>
                <div className="flex-1">
                  <Textarea value={newWallMsg} onChange={e => setNewWallMsg(e.target.value)}
                    placeholder={`Để lại lời nhắn cho ${decodedName}...`} className="min-h-[60px] resize-none" />
                  <div className="mt-2 flex justify-end">
                    <Button onClick={handleWallPost} size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1">
                      <Send className="h-3.5 w-3.5" /> Đăng
                    </Button>
                  </div>
                </div>
              </div>

              {/* Wall messages */}
              <div className="space-y-3">
                {wallMessages.map(msg => (
                  <div key={msg.id} className={`rounded-lg border p-4 ${msg.isAuthor ? "border-jade/30 bg-jade/5" : "border-border bg-card"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        msg.isAuthor ? "bg-jade text-white" : "bg-muted text-foreground"
                      }`}>{msg.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{msg.user}</span>
                          {msg.isAuthor && <Badge className="bg-jade text-white text-[10px] h-4">Tác giả</Badge>}
                          <span className="text-xs text-muted-foreground ml-auto">{msg.time}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-foreground/80">{msg.text}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-jade transition-colors">
                            <ThumbsUp className="h-3 w-3" /> {msg.likes}
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trả lời</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ResponsiveLayout>
  );
};

export default AuthorProfile;
