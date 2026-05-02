import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: connect to auth
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-12">
        <div className="w-full max-w-sm">
          {/* Logo area */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-imperial/10">
              <BookOpen className="h-7 w-7 text-imperial" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "signin" && "Chào mừng trở lại"}
              {mode === "signup" && "Tạo tài khoản mới"}
              {mode === "forgot" && "Quên mật khẩu"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin" && "Đăng nhập để đồng bộ tiến trình đọc truyện"}
              {mode === "signup" && "Tham gia mStories — bookmark, theo dõi, bình luận"}
              {mode === "forgot" && "Nhập email để nhận liên kết đặt lại mật khẩu"}
            </p>
          </div>

          {mode === "forgot" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="reset-email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-imperial text-white hover:bg-imperial/90">
                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
              </Button>
              <button type="button" onClick={() => setMode("signin")} className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Quay lại đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="username">Tên hiển thị</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="username" placeholder="Bút danh của bạn" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" required />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-jade hover:underline">Quên mật khẩu?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-imperial text-white hover:bg-imperial/90">
                {isLoading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </form>
          )}

          {mode !== "forgot" && (
            <>
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">hoặc</span>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2 text-sm" type="button">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Tiếp tục với Google
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signin" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-jade hover:underline">
                  {mode === "signin" ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </>
          )}

          {/* Benefits */}
          {mode === "signup" && (
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase"><Sparkles className="h-3 w-3 text-gold" /> Quyền lợi thành viên</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">✨ Đồng bộ tiến trình đọc trên mọi thiết bị</li>
                <li className="flex items-center gap-2">🌸 Nhận Sương Hoa miễn phí mỗi ngày</li>
                <li className="flex items-center gap-2">📚 Tủ truyện cá nhân không giới hạn</li>
                <li className="flex items-center gap-2">💬 Tham gia bình luận & thảo luận</li>
                <li className="flex items-center gap-2">🏆 Hệ thống thành tựu & cấp độ</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
