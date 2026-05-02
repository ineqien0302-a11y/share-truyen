import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Hash, FileText, Star, Heart, Gift, Bell, MessageSquare, Send, ThumbsUp, Share2, Flag, Eye, ArrowDown, ArrowUp, ChevronDown, Bookmark } from "lucide-react";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useStory, useStories, useChapters } from "@/hooks/use-stories";

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story, isLoading: storyLoading } = useStory(id);
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(id);
  const { data: allStories = [] } = useStories();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [chapterSort, setChapterSort] = useState<"asc" | "desc">("asc");
  const [commentText, setCommentText] = useState("");
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [commentSort, setCommentSort] = useState<"newest" | "top">("newest");
  const [comments, setComments] = useState([
    { id: "c1", user: "Độc Giả 1", avatar: "Đ", text: "Truyện hay quá! Mong tác giả ra chương mới sớm 🔥", time: "2 giờ trước", likes: 5, chapter: 3 },
    { id: "c2", user: "Tiểu Thư A", avatar: "T", text: "Nhân vật chính rất cuốn hút!", time: "5 giờ trước", likes: 12, chapter: null },
    { id: "c3", user: "Đọc Truyện 24/7", avatar: "Đ", text: "Đã theo dõi từ chương 1, không bao giờ thất vọng!", time: "1 ngày trước", likes: 8, chapter: 1 },
  ]);

  if (storyLoading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container max-w-3xl py-8 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-32" />
          </main>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!story) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container flex flex-col items-center py-20">
            <p className="text-muted-foreground">Không tìm thấy truyện.</p>
            <Button asChild variant="link" className="mt-4"><Link to="/">← Về trang chủ</Link></Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      { id: `c${Date.now()}`, user: "Bạn", avatar: "B", text: commentText, time: "Vừa xong", likes: 0, chapter: null },
      ...prev,
    ]);
    setCommentText("");
  };

  const sortedChapters = chapterSort === "asc" ? chapters : [...chapters].reverse();
  const displayChapters = showAllChapters ? sortedChapters : sortedChapters.slice(0, 10);
  const sortedComments = commentSort === "top" ? [...comments].sort((a, b) => b.likes - a.likes) : comments;
  const similarStories = allStories.filter(s => s.id !== story.id && s.genre === story.genre).slice(0, 4);

  const content = (
    <main className="container max-w-3xl py-8 px-4 md:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại</Link>
      </Button>

      <h1 className="border-l-4 border-imperial pl-4 text-2xl md:text-3xl font-bold tracking-tight">{story.title}</h1>
      <p className="mt-2 pl-4 text-sm text-muted-foreground">
        bởi <Link to={`/author/${encodeURIComponent(story.author)}`} className="text-jade hover:underline">{story.author}</Link>
      </p>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-3 pl-4">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(s)} className="transition-transform hover:scale-110">
              <Star className={`h-5 w-5 ${s <= (hoverRating || userRating || Math.round(story.rating)) ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
            </button>
          ))}
        </div>
        <span className="text-lg font-bold text-gold">{story.rating}</span>
        {userRating > 0 && <span className="text-xs text-jade">Bạn đã đánh giá {userRating}⭐</span>}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 pl-4 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {(story.views / 1000).toFixed(0)}K lượt đọc</span>
        <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {chapters.length} chương</span>
        <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {(story.word_count / 1000).toFixed(0)}k chữ</span>
      </div>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1"><Hash className="h-3 w-3" /> {story.genre}</Badge>
        <Badge variant={story.status === "completed" ? "default" : "outline"} className="gap-1">
          <Clock className="h-3 w-3" /> {story.status === "completed" ? "Hoàn thành" : story.status === "hiatus" ? "Tạm dừng" : "Đang ra"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant={isFollowing ? "default" : "outline"} size="sm" onClick={() => setIsFollowing(!isFollowing)}
          className={isFollowing ? "bg-jade text-white hover:bg-jade/90" : "border-jade text-jade hover:bg-jade/10"}>
          <Bell className="mr-1.5 h-3.5 w-3.5" /> {isFollowing ? "Đang theo dõi" : "Theo dõi"}
        </Button>
        <Button variant={isFavorited ? "default" : "outline"} size="sm" onClick={() => setIsFavorited(!isFavorited)}
          className={isFavorited ? "bg-imperial text-white hover:bg-imperial/90" : "border-imperial text-imperial hover:bg-imperial/10"}>
          <Heart className={`mr-1.5 h-3.5 w-3.5 ${isFavorited ? "fill-current" : ""}`} /> {isFavorited ? "Đã thích" : "Yêu thích"}
        </Button>
        <Button variant={isBookmarked ? "default" : "outline"} size="sm" onClick={() => setIsBookmarked(!isBookmarked)}
          className={isBookmarked ? "bg-gold text-white hover:bg-gold/90" : "border-gold text-gold hover:bg-gold/10"}>
          <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} /> {isBookmarked ? "Đã lưu" : "Đánh dấu"}
        </Button>
        <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">
          <Gift className="mr-1.5 h-3.5 w-3.5" /> Tặng quà
        </Button>
      </div>

      {/* Synopsis */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tóm tắt</h2>
        <p className="mt-3 font-story text-base leading-relaxed text-foreground/90">{story.description}</p>
      </div>

      <Separator className="my-8 bg-gold/20" />

      {/* Chapters */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mục lục ({chapters.length} chương)</h2>
          <Button variant="ghost" size="sm" onClick={() => setChapterSort(chapterSort === "asc" ? "desc" : "asc")} className="text-xs gap-1 text-muted-foreground">
            {chapterSort === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {chapterSort === "asc" ? "Cũ → Mới" : "Mới → Cũ"}
          </Button>
        </div>
        {chaptersLoading ? (
          <div className="space-y-2"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
        ) : chapters.length > 0 ? (
          <>
            <div className="space-y-1 rounded-lg border border-border bg-card p-2">
              {displayChapters.map((ch) => (
                <Link key={ch.id} to={`/read/${story.id}/${ch.chapter_number}`}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted/50">
                  <span>
                    <span className="mr-2 text-xs text-muted-foreground">Ch. {ch.chapter_number}</span>
                    <span className="font-medium">{ch.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{((ch.word_count || 0) / 1000).toFixed(1)}k</span>
                </Link>
              ))}
            </div>
            {chapters.length > 10 && (
              <Button variant="ghost" size="sm" onClick={() => setShowAllChapters(!showAllChapters)} className="mt-2 w-full text-xs text-muted-foreground gap-1">
                <ChevronDown className={`h-3 w-3 transition-transform ${showAllChapters ? "rotate-180" : ""}`} />
                {showAllChapters ? "Thu gọn" : `Xem tất cả ${chapters.length} chương`}
              </Button>
            )}
          </>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">Chưa có chương nào.</p>
        )}
      </div>

      {chapters.length > 0 && (
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg" className="bg-imperial text-white hover:bg-imperial/90">
            <Link to={`/read/${story.id}/1`}><BookOpen className="mr-2 h-4 w-4" /> Đọc từ đầu</Link>
          </Button>
          {chapters.length > 1 && (
            <Button asChild size="lg" variant="outline">
              <Link to={`/read/${story.id}/${chapters.length}`}>Chương mới nhất →</Link>
            </Button>
          )}
        </div>
      )}

      <Separator className="my-8 bg-gold/20" />

      {/* Similar stories */}
      {similarStories.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Truyện tương tự</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
            {similarStories.map(s => (
              <Link key={s.id} to={`/story/${s.id}`} className="group rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-full items-center justify-center rounded border border-border text-lg font-bold text-foreground/20 group-hover:text-foreground/40" style={{ backgroundColor: s.cover_color }}>
                  {s.title.charAt(0)}
                </div>
                <p className="mt-2 truncate text-xs font-semibold">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.author}</p>
              </Link>
            ))}
          </div>
          <Separator className="my-8 bg-gold/20" />
        </>
      )}

      {/* Comments */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> Bình luận ({comments.length})
          </h2>
          <div className="flex gap-1">
            <button onClick={() => setCommentSort("newest")} className={`rounded px-2 py-0.5 text-[10px] font-medium ${commentSort === "newest" ? "bg-jade/10 text-jade" : "text-muted-foreground"}`}>Mới nhất</button>
            <button onClick={() => setCommentSort("top")} className={`rounded px-2 py-0.5 text-[10px] font-medium ${commentSort === "top" ? "bg-jade/10 text-jade" : "text-muted-foreground"}`}>Hay nhất</button>
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade/10 text-sm font-bold text-jade">B</div>
          <div className="flex-1">
            <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Viết bình luận của bạn..." className="min-h-[80px] resize-none" />
            <div className="mt-2 flex justify-end">
              <Button onClick={handleComment} size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1">
                <Send className="h-3.5 w-3.5" /> Gửi
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sortedComments.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.user}</span>
                    {c.chapter && <Badge variant="outline" className="text-[10px]">Ch.{c.chapter}</Badge>}
                    <span className="text-xs text-muted-foreground ml-auto">{c.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground/80">{c.text}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-jade transition-colors">
                      <ThumbsUp className="h-3 w-3" /> {c.likes}
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trả lời</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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

export default StoryDetail;
