import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User, Settings, BookOpen, Eye, MessageSquare, Heart, Star, Trophy, Clock,
  Bell, Shield, Palette, Type, Save, Crown, Flame, Calendar
} from "lucide-react";

const UserProfile = () => {
  const [displayName, setDisplayName] = useState("Độc Giả Bí Ẩn");
  const [username, setUsername] = useState("docgia_biman");
  const [bio, setBio] = useState("Mọt sách chuyên nghiệp. Thích Fantasy & Romance.");
  const [fontSize, setFontSize] = useState("18");
  const [autoBookmark, setAutoBookmark] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  // Mock stats
  const stats = {
    level: 12,
    xp: 2400,
    xpNext: 3000,
    storiesRead: 47,
    chaptersRead: 892,
    totalWords: 4250000,
    comments: 156,
    favorites: 23,
    following: 18,
    daysStreak: 14,
    suongHoa: 1250,
    joinedDate: "15/06/2025",
    readingTime: "342 giờ",
  };

  const levelProgress = (stats.xp / stats.xpNext) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        {/* Profile header */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-imperial/10 text-3xl font-bold text-imperial">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{displayName}</h1>
                <Badge className="bg-jade text-white text-[10px]">Lv.{stats.level}</Badge>
                <Badge variant="outline" className="text-[10px] gap-1"><Flame className="h-3 w-3 text-imperial" /> {stats.daysStreak} ngày streak</Badge>
              </div>
              <p className="text-sm text-muted-foreground">@{username}</p>
              <p className="mt-1.5 text-sm text-foreground/80">{bio}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> Tham gia từ {stats.joinedDate}
                <span className="mx-1">·</span>
                <span>🌸 {stats.suongHoa.toLocaleString()} Sương Hoa</span>
              </div>

              {/* Level progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Lv.{stats.level}</span>
                  <span>{stats.xp}/{stats.xpNext} XP</span>
                </div>
                <Progress value={levelProgress} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              { icon: <BookOpen className="h-3.5 w-3.5 text-jade" />, label: "Đã đọc", value: stats.storiesRead },
              { icon: <Eye className="h-3.5 w-3.5 text-jade" />, label: "Chương", value: stats.chaptersRead },
              { icon: <MessageSquare className="h-3.5 w-3.5 text-imperial" />, label: "Bình luận", value: stats.comments },
              { icon: <Heart className="h-3.5 w-3.5 text-imperial" />, label: "Yêu thích", value: stats.favorites },
              { icon: <Bell className="h-3.5 w-3.5 text-jade" />, label: "Theo dõi", value: stats.following },
              { icon: <Clock className="h-3.5 w-3.5 text-gold" />, label: "Thời gian", value: stats.readingTime },
            ].map((s, i) => (
              <div key={i} className="rounded-md border border-border bg-muted/30 p-2.5 text-center">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center">{s.icon}</div>
                <p className="text-sm font-bold">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="settings">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
            <TabsTrigger value="settings" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Settings className="h-3.5 w-3.5" /> Cài đặt
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BookOpen className="h-3.5 w-3.5" /> Đọc truyện
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Shield className="h-3.5 w-3.5" /> Bảo mật
            </TabsTrigger>
          </TabsList>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Thông tin cá nhân</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên hiển thị</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Giới thiệu</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Viết vài dòng về bản thân..." />
              </div>
              <Button className="bg-jade text-white hover:bg-jade/90 gap-1.5">
                <Save className="h-3.5 w-3.5" /> Lưu thay đổi
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Thông báo</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Thông báo chương mới</p>
                    <p className="text-xs text-muted-foreground">Nhận thông báo khi truyện theo dõi ra chương mới</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Thông báo email</p>
                    <p className="text-xs text-muted-foreground">Tổng hợp hàng tuần qua email</p>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reading preferences */}
          <TabsContent value="reading" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Tuỳ chỉnh đọc truyện</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cỡ chữ mặc định</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[14, 16, 18, 20, 22, 24].map(s => (
                        <SelectItem key={s} value={String(s)}>{s}px</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tự động đánh dấu</p>
                  <p className="text-xs text-muted-foreground">Lưu vị trí đọc tự động</p>
                </div>
                <Switch checked={autoBookmark} onCheckedChange={setAutoBookmark} />
              </div>
              <Button className="bg-jade text-white hover:bg-jade/90 gap-1.5">
                <Save className="h-3.5 w-3.5" /> Lưu tuỳ chỉnh
              </Button>
            </div>

            {/* Reading stats detail */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Thống kê đọc truyện</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tổng số từ đã đọc</span>
                  <span className="font-semibold">{(stats.totalWords / 1000000).toFixed(1)}M từ</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Thể loại yêu thích</span>
                  <div className="flex gap-1"><Badge variant="secondary" className="text-xs">Fantasy</Badge><Badge variant="secondary" className="text-xs">Romance</Badge></div>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tốc độ đọc trung bình</span>
                  <span className="font-semibold">~280 từ/phút</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Chuỗi ngày đọc dài nhất</span>
                  <span className="font-semibold flex items-center gap-1"><Flame className="h-3 w-3 text-imperial" /> 21 ngày</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Bảo mật tài khoản</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value="reader@mstories.app" disabled />
                  <p className="text-xs text-muted-foreground">Đã xác thực ✓</p>
                </div>
                <Button variant="outline" className="text-sm gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Đổi mật khẩu
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-destructive">Vùng nguy hiểm</h3>
              <p className="text-xs text-muted-foreground">Xoá tài khoản sẽ xoá toàn bộ dữ liệu bao gồm tiến trình đọc, bình luận và Sương Hoa.</p>
              <Button variant="destructive" size="sm">Xoá tài khoản</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function Lock(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default UserProfile;
