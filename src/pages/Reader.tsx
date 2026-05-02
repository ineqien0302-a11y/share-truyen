import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, List, Minus, Plus, Settings, BookOpen, Clock, Moon, Sun, Volume2, VolumeX, MessageSquare, Share2, Bookmark, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useStory, useChapters, useChapter } from "@/hooks/use-stories";
import { useTheme } from "@/hooks/use-theme";

const BG_THEMES = [
  { name: "Mặc định", bg: "bg-background", text: "text-foreground" },
  { name: "Giấy cũ", bg: "bg-[#f5e6c8]", text: "text-[#3d2b1f]" },
  { name: "Xanh nhạt", bg: "bg-[#e8f0e8]", text: "text-[#2d3a2d]" },
  { name: "Xám nhạt", bg: "bg-[#e8e8e8]", text: "text-[#2d2d2d]" },
  { name: "Đêm", bg: "bg-[#1a1a2e]", text: "text-[#c8c8d8]" },
  { name: "Sepia", bg: "bg-[#f4ecd8]", text: "text-[#5b4636]" },
];

const FONT_FAMILIES = [
  { name: "Merriweather", value: "font-story" },
  { name: "Hệ thống", value: "font-sans" },
  { name: "Serif", value: "font-serif" },
  { name: "Mono", value: "font-mono" },
];

function estimateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 250);
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}p`;
}

// ── Inline comment type ──
interface InlineComment {
  id: string;
  paragraphIndex: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

const Reader = () => {
  const { storyId, chapterNum } = useParams<{ storyId: string; chapterNum: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bgTheme, setBgTheme] = useState(0);
  const [fontFamily, setFontFamily] = useState(0);
  const [showToolbar, setShowToolbar] = useState(true);

  // Audio TTS
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Inline comments
  const [inlineComments, setInlineComments] = useState<InlineComment[]>([
    { id: "ic1", paragraphIndex: 0, user: "Độc Giả 1", avatar: "Đ", text: "Mở đầu quá cuốn! 🔥", time: "2h trước", likes: 8 },
    { id: "ic2", paragraphIndex: 2, user: "Tiểu Thư A", avatar: "T", text: "Đoạn này miêu tả rất hay", time: "5h trước", likes: 3 },
  ]);
  const [activeCommentParagraph, setActiveCommentParagraph] = useState<number | null>(null);
  const [newInlineComment, setNewInlineComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Reading progress save
  const saveProgressRef = useRef<any>();

  const chapterNumber = parseInt(chapterNum || "1", 10);
  const { data: story } = useStory(storyId);
  const { data: chapters = [] } = useChapters(storyId);
  const { data: chapter, isLoading: chapterLoading } = useChapter(storyId, chapterNumber);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setScrollProgress(progress);

    // Local save reading progress
    if (saveProgressRef.current) clearTimeout(saveProgressRef.current);
    saveProgressRef.current = setTimeout(() => {
      if (storyId) {
        localStorage.setItem(`reading-progress-${storyId}`, JSON.stringify({
          chapterNumber,
          scrollPosition: progress,
          timestamp: Date.now()
        }));
      }
    }, 2000);
  }, [storyId, chapterNumber]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => { window.scrollTo(0, 0); }, [chapterNumber]);

  useEffect(() => {
    let lastScroll = 0;
    const handleToolbarScroll = () => {
      const current = window.scrollY;
      setShowToolbar(current < lastScroll || current < 100);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleToolbarScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleToolbarScroll);
  }, []);

  // Load saved progress
  useEffect(() => {
    if (storyId) {
      try {
        const saved = localStorage.getItem(`reading-progress-${storyId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          const scrollPosition = parsed?.scrollPosition;
          if (scrollPosition && scrollPosition > 5) {
            // Use a small timeout to ensure DOM is rendered
            setTimeout(() => {
              const docHeight = document.documentElement.scrollHeight - window.innerHeight;
              if (docHeight > 0) {
                window.scrollTo(0, (scrollPosition / 100) * docHeight);
              }
            }, 150);
          }
        }
      } catch (e) {
        console.error("Failed to load reading progress", e);
      }
    }
  }, [storyId, chapterNumber]);

  // Audio TTS controls
  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    if (!chapter) return;
    const utterance = new SpeechSynthesisUtterance(chapter.content);
    utterance.lang = "vi-VN";
    utterance.rate = audioRate;
    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleInlineComment = (paragraphIndex: number) => {
    if (!newInlineComment.trim()) return;
    setInlineComments(prev => [...prev, {
      id: `ic-${Date.now()}`,
      paragraphIndex,
      user: "Bạn",
      avatar: "B",
      text: newInlineComment,
      time: "Vừa xong",
      likes: 0,
    }]);
    setNewInlineComment("");
    setActiveCommentParagraph(null);
  };

  if (chapterLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-[750px] w-full px-6 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy chương.</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">← Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasPrev = chapterNumber > 1;
  const hasNext = chapterNumber < chapters.length;
  const currentBg = BG_THEMES[bgTheme];
  const currentFont = FONT_FAMILIES[fontFamily];
  const wordCount = chapter.content?.split(/\s+/).filter(Boolean).length || 0;
  const paragraphs = chapter.content?.split("\n\n") || [];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentBg.bg}`}>
      <div className="fixed left-0 right-0 top-0 z-50">
        <Progress value={scrollProgress} className="h-0.5 rounded-none bg-transparent [&>div]:bg-primary" />
      </div>

      <div className={`fixed left-0 right-0 top-0.5 z-40 transition-transform duration-300 ${showToolbar ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-4 py-2">
          <Link to={`/story/${storyId}`} className={`flex items-center gap-1.5 text-xs ${currentBg.text} opacity-70 hover:opacity-100`}>
            <ArrowLeft className="h-3.5 w-3.5" /> {story.title}
          </Link>
          <div className="flex items-center gap-2">
            <Select value={String(chapterNumber)} onValueChange={(v) => navigate(`/read/${storyId}/${v}`)}>
              <SelectTrigger className="h-7 w-auto min-w-[120px] border-none bg-transparent text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((ch) => (
                  <SelectItem key={ch.chapter_number} value={String(ch.chapter_number)} className="text-xs">
                    Ch. {ch.chapter_number}: {ch.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Floating controls */}
      <div className={`fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur transition-transform duration-300 ${showToolbar ? "translate-y-0" : "translate-y-20"}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasPrev} onClick={() => navigate(`/read/${storyId}/${chapterNumber - 1}`)}>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to={`/story/${storyId}`}><List className="h-3.5 w-3.5" /></Link>
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        {/* Audio TTS toggle */}
        <Button variant="ghost" size="icon" className={`h-8 w-8 ${isPlaying ? "text-jade" : ""}`} onClick={toggleAudio}>
          {isPlaying ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </Button>

        {/* Bookmark */}
        <Button variant="ghost" size="icon" className={`h-8 w-8 ${isBookmarked ? "text-gold" : ""}`} onClick={() => setIsBookmarked(!isBookmarked)}>
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-3.5 w-3.5" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" side="top">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Cỡ chữ</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(s => Math.max(14, s - 2))}><Minus className="h-3 w-3" /></Button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{fontSize}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(s => Math.min(32, s + 2))}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Giãn dòng</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setLineHeight(s => Math.max(1.2, s - 0.2))}><Minus className="h-3 w-3" /></Button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{lineHeight.toFixed(1)}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setLineHeight(s => Math.min(2.4, s + 0.2))}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Phông chữ</p>
                <div className="flex flex-wrap gap-1.5">
                  {FONT_FAMILIES.map((f, i) => (
                    <button key={f.name} onClick={() => setFontFamily(i)}
                      className={`rounded-md px-2.5 py-1 text-xs transition-colors ${fontFamily === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Nền đọc</p>
                <div className="flex flex-wrap gap-1.5">
                  {BG_THEMES.map((t, i) => (
                    <button key={t.name} onClick={() => setBgTheme(i)}
                      className={`rounded-md px-2.5 py-1 text-xs transition-colors ${bgTheme === i ? "ring-2 ring-primary" : ""} ${t.bg} ${t.text} border border-border`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Audio speed */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Tốc độ đọc (Audio)</p>
                <div className="flex gap-1.5">
                  {[0.75, 1, 1.25, 1.5, 2].map(r => (
                    <button key={r} onClick={() => setAudioRate(r)}
                      className={`rounded-md px-2 py-1 text-xs ${audioRate === r ? "bg-jade text-white" : "bg-muted text-muted-foreground"}`}>
                      {r}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Chế độ tối</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasNext} onClick={() => navigate(`/read/${storyId}/${chapterNumber + 1}`)}>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <article className="mx-auto max-w-[750px] px-6 pb-28 pt-16">
        <h1 className={`border-l-4 border-imperial pl-4 text-xl md:text-2xl font-bold tracking-tight ${currentBg.text}`}>
          {chapter.title}
        </h1>
        <div className={`mt-2 flex items-center gap-3 pl-4 text-xs ${currentBg.text} opacity-60`}>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Chương {chapter.chapter_number}/{chapters.length}</span>
          <span>·</span>
          <span>{((chapter.word_count || wordCount) / 1000).toFixed(1)}k chữ</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{estimateReadingTime(chapter.word_count || wordCount)}</span>
          {isPlaying && <span className="flex items-center gap-1 text-jade"><Volume2 className="h-3 w-3 animate-pulse" /> Đang phát</span>}
        </div>

        {/* Chapter content with inline comments */}
        <div className={`mt-10 ${currentFont.value} ${currentBg.text}`} style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
          {paragraphs.map((paragraph, i) => {
            const paragraphComments = inlineComments.filter(c => c.paragraphIndex === i);
            const hasComments = paragraphComments.length > 0;
            const isActive = activeCommentParagraph === i;

            return (
              <div key={i} className="group relative mb-6">
                <p
                  className={`tracking-[0.02em] cursor-pointer rounded-sm transition-colors ${isActive ? "bg-jade/10 -mx-2 px-2 py-1" : "hover:bg-muted/30 -mx-1 px-1"}`}
                  onClick={() => setActiveCommentParagraph(isActive ? null : i)}
                >
                  {paragraph}
                </p>

                {/* Comment indicator */}
                {hasComments && !isActive && (
                  <button
                    onClick={() => setActiveCommentParagraph(i)}
                    className="absolute -right-8 top-0 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-jade/10 text-jade text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MessageSquare className="h-3 w-3 mr-0.5" />{paragraphComments.length}
                  </button>
                )}

                {/* Inline comment panel */}
                {isActive && (
                  <div className="mt-2 ml-4 rounded-lg border border-jade/20 bg-card p-3 shadow-sm space-y-2">
                    {paragraphComments.map(c => (
                      <div key={c.id} className="flex items-start gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{c.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">{c.user}</span>
                            <span className="text-[10px] text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
                          <button className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-jade mt-0.5">
                            <ThumbsUp className="h-2.5 w-2.5" /> {c.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <Textarea
                        value={newInlineComment}
                        onChange={e => setNewInlineComment(e.target.value)}
                        placeholder="Bình luận đoạn này..."
                        className="min-h-[40px] text-xs resize-none flex-1"
                      />
                      <Button size="icon" className="h-8 w-8 bg-jade text-white hover:bg-jade/90 shrink-0"
                        onClick={() => handleInlineComment(i)}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">— Hết chương {chapterNumber} —</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {hasNext ? (
              <Button asChild className="bg-imperial text-white hover:bg-imperial/90">
                <Link to={`/read/${storyId}/${chapterNumber + 1}`}>Chương tiếp theo <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
              </Button>
            ) : (
              <Button asChild variant="outline"><Link to={`/story/${storyId}`}>Quay về trang truyện</Link></Button>
            )}
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground"><MessageSquare className="h-3 w-3" /> {inlineComments.length} bình luận</Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground"><Share2 className="h-3 w-3" /> Chia sẻ</Button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/read/${storyId}/${chapterNumber - 1}`}><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Chương trước</Link>
            </Button>
          ) : <div />}
          {hasNext ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/read/${storyId}/${chapterNumber + 1}`}>Chương sau <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild><Link to={`/story/${storyId}`}>Về trang truyện</Link></Button>
          )}
        </div>
      </article>
    </div>
  );
};

export default Reader;
