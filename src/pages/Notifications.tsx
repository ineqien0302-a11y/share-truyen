import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BookOpen, MessageSquare, Gift, Star, Heart, Trophy, Check, CheckCheck, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: "chapter" | "comment" | "gift" | "system" | "achievement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "chapter", title: "Chương mới", message: "Ascension of the Eternal Emperor vừa ra chương 25: The Final Gate", time: "5 phút trước", read: false, link: "/read/1/3" },
  { id: "n2", type: "comment", title: "Bình luận mới", message: "Tiểu Thư A đã trả lời bình luận của bạn trong 'The Villainess Reverses...'", time: "1 giờ trước", read: false, link: "/story/2" },
  { id: "n3", type: "gift", title: "Nhận quà", message: "Bạn đã nhận được Bó Hoa Sương từ Độc Giả 1", time: "3 giờ trước", read: false },
  { id: "n4", type: "achievement", title: "Thành tựu mới!", message: "Bạn đã mở khoá thành tựu 'Mọt Sách' — Đọc 10 truyện", time: "5 giờ trước", read: true, link: "/achievements" },
  { id: "n5", type: "chapter", title: "Chương mới", message: "Cyber-Mage: Neon Genesis vừa ra chương 8: Neon Dreams", time: "8 giờ trước", read: true, link: "/read/5/7" },
  { id: "n6", type: "system", title: "Hệ thống", message: "Chào mừng bạn đến với mStories! Hãy khám phá tủ truyện khổng lồ.", time: "1 ngày trước", read: true },
  { id: "n7", type: "comment", title: "Có người thích bình luận", message: "3 người đã thích bình luận của bạn trong 'Rebirth of the Demon God'", time: "1 ngày trước", read: true, link: "/story/6" },
  { id: "n8", type: "chapter", title: "Chương mới", message: "The Sovereign Lord of the Abyss vừa ra chương 21: Into Darkness", time: "2 ngày trước", read: true, link: "/read/7/20" },
];

const typeIcons: Record<string, React.ReactNode> = {
  chapter: <BookOpen className="h-4 w-4 text-jade" />,
  comment: <MessageSquare className="h-4 w-4 text-imperial" />,
  gift: <Gift className="h-4 w-4 text-gold" />,
  system: <Bell className="h-4 w-4 text-muted-foreground" />,
  achievement: <Trophy className="h-4 w-4 text-gold" />,
};

const Notifications = () => {
  const [notifs, setNotifs] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const filtered = activeTab === "all" ? notifs
    : activeTab === "unread" ? notifs.filter(n => !n.read)
    : notifs.filter(n => n.type === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Bell className="h-6 w-6 text-jade" /> Thông báo
              {unreadCount > 0 && <Badge className="bg-imperial text-white">{unreadCount} mới</Badge>}
            </h1>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs gap-1 text-muted-foreground">
              <CheckCheck className="h-3.5 w-3.5" /> Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none overflow-x-auto">
            <TabsTrigger value="all" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">Tất cả</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-imperial data-[state=active]:bg-transparent data-[state=active]:shadow-none">Chưa đọc</TabsTrigger>
            <TabsTrigger value="chapter" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-1"><BookOpen className="h-3 w-3" /> Chương mới</TabsTrigger>
            <TabsTrigger value="comment" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-imperial data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-1"><MessageSquare className="h-3 w-3" /> Bình luận</TabsTrigger>
            <TabsTrigger value="achievement" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-1"><Trophy className="h-3 w-3" /> Thành tựu</TabsTrigger>
          </TabsList>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Không có thông báo nào.</p>
              </div>
            ) : (
              filtered.map(n => (
                <div key={n.id}
                  className={`group flex items-start gap-3 rounded-lg border p-4 transition-colors ${n.read ? "border-border bg-card" : "border-jade/30 bg-jade/5"}`}>
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-imperial shrink-0" />}
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/80">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {n.link && (
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link to={n.link}><BookOpen className="h-3 w-3" /></Link>
                      </Button>
                    )}
                    {!n.read && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(n.id)}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => deleteNotif(n.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;
