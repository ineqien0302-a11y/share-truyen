import { useState } from "react";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, UserPlus, Search, Send, ArrowLeft, MoreHorizontal, Heart, Clock, Check, CheckCheck } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  initial: string;
  color: string;
  status: "online" | "offline" | "reading";
  lastSeen: string;
  mutualFriends: number;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  friend: Friend;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const FRIENDS: Friend[] = [
  { id: "f1", name: "Lam Phong", initial: "L", color: "hsl(200 60% 50%)", status: "online", lastSeen: "Đang hoạt động", mutualFriends: 12 },
  { id: "f2", name: "Tiểu Vũ", initial: "T", color: "hsl(340 60% 55%)", status: "reading", lastSeen: "Đang đọc truyện", mutualFriends: 5 },
  { id: "f3", name: "Nguyệt Hà", initial: "N", color: "hsl(160 50% 45%)", status: "offline", lastSeen: "2 giờ trước", mutualFriends: 8 },
  { id: "f4", name: "Minh Ngọc", initial: "M", color: "hsl(40 70% 50%)", status: "online", lastSeen: "Đang hoạt động", mutualFriends: 3 },
  { id: "f5", name: "An Nhiên", initial: "A", color: "hsl(280 50% 50%)", status: "offline", lastSeen: "1 ngày trước", mutualFriends: 15 },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv1", friend: FRIENDS[0], lastMessage: "Truyện mới của bạn hay quá! Mình đọc một mạch luôn 🔥", lastTime: "5 phút trước", unread: 2,
    messages: [
      { id: "m1", sender: "them", text: "Ê, bạn đọc truyện mới chưa?", time: "10:00", read: true },
      { id: "m2", sender: "me", text: "Chưa, truyện nào thế?", time: "10:05", read: true },
      { id: "m3", sender: "them", text: "\"Hạt Giống Mùa Xuân\" trên trang chủ á", time: "10:06", read: true },
      { id: "m4", sender: "them", text: "Truyện mới của bạn hay quá! Mình đọc một mạch luôn 🔥", time: "10:10", read: false },
    ],
  },
  {
    id: "conv2", friend: FRIENDS[1], lastMessage: "Cảm ơn bạn đã tặng 🌸!", lastTime: "1 giờ trước", unread: 0,
    messages: [
      { id: "m5", sender: "me", text: "Mình tặng bạn 50 🌸 nè", time: "09:00", read: true },
      { id: "m6", sender: "them", text: "Cảm ơn bạn đã tặng 🌸!", time: "09:30", read: true },
    ],
  },
  {
    id: "conv3", friend: FRIENDS[2], lastMessage: "Hẹn gặp trong cuộc thi nhé!", lastTime: "Hôm qua", unread: 1,
    messages: [
      { id: "m7", sender: "them", text: "Bạn tham gia cuộc thi viết truyện không?", time: "Hôm qua", read: true },
      { id: "m8", sender: "me", text: "Có chứ, mình đang viết bản thảo", time: "Hôm qua", read: true },
      { id: "m9", sender: "them", text: "Hẹn gặp trong cuộc thi nhé!", time: "Hôm qua", read: false },
    ],
  },
];

const FRIEND_REQUESTS = [
  { id: "fr1", name: "Hải Yến", initial: "H", color: "hsl(190 50% 50%)", mutualFriends: 4 },
  { id: "fr2", name: "Đức Anh", initial: "Đ", color: "hsl(20 60% 50%)", mutualFriends: 7 },
];

const MessagesPage = () => {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConv = CONVERSATIONS.find(c => c.id === activeConv);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  const statusDot = (s: Friend["status"]) => {
    if (s === "online") return "bg-jade";
    if (s === "reading") return "bg-gold";
    return "bg-muted-foreground/30";
  };

  const content = (
    <main className="container max-w-4xl py-6 px-4">
      <h1 className="mb-6 border-l-4 border-jade pl-4 text-2xl font-bold">Tin nhắn & Bạn bè</h1>

      <Tabs defaultValue="messages">
        <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
          <TabsTrigger value="messages" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <MessageSquare className="h-3.5 w-3.5" /> Tin nhắn
            {CONVERSATIONS.reduce((s, c) => s + c.unread, 0) > 0 && (
              <Badge className="ml-1 h-4 min-w-[16px] bg-imperial text-white text-[10px] px-1">
                {CONVERSATIONS.reduce((s, c) => s + c.unread, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="friends" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Users className="h-3.5 w-3.5" /> Bạn bè ({FRIENDS.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <UserPlus className="h-3.5 w-3.5" /> Lời mời
            {FRIEND_REQUESTS.length > 0 && (
              <Badge className="ml-1 h-4 min-w-[16px] bg-imperial text-white text-[10px] px-1">{FRIEND_REQUESTS.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Messages */}
        <TabsContent value="messages">
          <div className="rounded-lg border border-border bg-card overflow-hidden" style={{ minHeight: "500px" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 h-full" style={{ minHeight: "500px" }}>
              {/* Conversation list */}
              <div className={`border-r border-border ${activeConv ? "hidden md:block" : ""}`}>
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm cuộc trò chuyện..." className="h-8 pl-8 text-xs" />
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {CONVERSATIONS.map(conv => (
                    <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${activeConv === conv.id ? "bg-muted/50" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: conv.friend.color }}>
                            {conv.friend.initial}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusDot(conv.friend.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold truncate">{conv.friend.name}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTime}</span>
                          </div>
                          <p className={`text-xs truncate ${conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{conv.lastMessage}</p>
                        </div>
                        {conv.unread > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-imperial text-[10px] font-bold text-white px-1">{conv.unread}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat area */}
              <div className={`col-span-2 flex flex-col ${!activeConv ? "hidden md:flex" : "flex"}`} style={{ minHeight: "500px" }}>
                {currentConv ? (
                  <>
                    <div className="flex items-center gap-3 border-b border-border p-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setActiveConv(null)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: currentConv.friend.color }}>
                          {currentConv.friend.initial}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${statusDot(currentConv.friend.status)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{currentConv.friend.name}</p>
                        <p className="text-[10px] text-muted-foreground">{currentConv.friend.lastSeen}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {currentConv.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                            msg.sender === "me" ? "bg-jade text-white rounded-br-md" : "bg-muted rounded-bl-md"
                          }`}>
                            <p>{msg.text}</p>
                            <div className={`mt-0.5 flex items-center justify-end gap-1 text-[10px] ${msg.sender === "me" ? "text-white/60" : "text-muted-foreground"}`}>
                              <span>{msg.time}</span>
                              {msg.sender === "me" && (msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border p-3">
                      <div className="flex gap-2">
                        <Input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Nhập tin nhắn..."
                          className="flex-1" onKeyDown={e => e.key === "Enter" && handleSend()} />
                        <Button onClick={handleSend} size="icon" className="bg-jade text-white hover:bg-jade/90 shrink-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Friends */}
        <TabsContent value="friends">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm bạn bè..." className="pl-9" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {FRIENDS.map(f => (
              <div key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: f.color }}>
                    {f.initial}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusDot(f.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{f.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {f.lastSeen}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{f.mutualFriends} bạn chung</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="text-xs gap-1 h-7"
                    onClick={() => setActiveConv(CONVERSATIONS.find(c => c.friend.id === f.id)?.id || null)}>
                    <MessageSquare className="h-3 w-3" /> Nhắn tin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Friend Requests */}
        <TabsContent value="requests">
          {FRIEND_REQUESTS.length === 0 ? (
            <div className="py-16 text-center">
              <UserPlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Không có lời mời kết bạn nào.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {FRIEND_REQUESTS.map(req => (
                <div key={req.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: req.color }}>
                    {req.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.mutualFriends} bạn chung</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" className="bg-jade text-white hover:bg-jade/90 text-xs h-8">Chấp nhận</Button>
                    <Button size="sm" variant="outline" className="text-xs h-8">Từ chối</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default MessagesPage;
