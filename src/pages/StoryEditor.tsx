import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStory, useChapters } from "@/hooks/use-stories";
import { ArrowLeft, Save, BookOpen, Plus, FileText, Settings, Lock, Trash2, Edit, Layers, Upload, Users, SplitSquareVertical, Flower2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GENRES = ["Fantasy", "Romance", "Sci-Fi", "Horror", "Mystery", "Slice of Life", "History"];

// ── Character Note type ──
interface CharacterNote {
  id: string;
  name: string;
  role: string;
  description: string;
}

// ── Bulk Upload Parser ──
function parseChaptersByRegex(text: string, pattern: string): { title: string; content: string }[] {
  try {
    const regex = new RegExp(pattern, "gm");
    const parts = text.split(regex).filter(Boolean);
    const matches = [...text.matchAll(regex)];
    return matches.map((m, i) => ({
      title: m[0].trim(),
      content: (parts[i + 1] || "").trim(),
    })).filter(ch => ch.content.length > 0);
  } catch {
    return [];
  }
}

const StoryEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isNew = id === "new";
  const { data: existingStory, isLoading } = useStory(isNew ? undefined : id);
  const { data: existingChapters = [] } = useChapters(isNew ? undefined : id);
  const { toast } = useToast();

  const defaultTab = searchParams.get("tab") || "info";

  // Story fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [status, setStatus] = useState("ongoing");
  const [tags, setTags] = useState("");

  // Chapter fields
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterContent, setChapterContent] = useState("");
  const [chapterPart, setChapterPart] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [flowerPrice, setFlowerPrice] = useState("");

  // Bulk upload
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkRegex, setBulkRegex] = useState("^Chương \\d+[.:：]?.*$");
  const [parsedChapters, setParsedChapters] = useState<{ title: string; content: string }[]>([]);

  // Character notes
  const [characters, setCharacters] = useState<CharacterNote[]>([
    { id: "sample", name: "Nhân vật mẫu", role: "Nhân vật chính", description: "Mô tả nhân vật..." },
  ]);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");
  const [newCharDesc, setNewCharDesc] = useState("");

  // Sync form with loaded data
  useState(() => {
    if (existingStory) {
      setTitle(existingStory.title);
      setDescription(existingStory.description);
      setGenre(existingStory.genre);
      setStatus(existingStory.status);
      setTags(existingStory.tags.join(", "));
      setChapterNumber(existingChapters.length + 1);
    }
  });

  const handleSaveStory = () => {
    if (!title.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề truyện.", variant: "destructive" });
      return;
    }
    toast({ title: "Thành công", description: isNew ? "Truyện đã được tạo!" : "Truyện đã được cập nhật!" });
  };

  const handlePublishChapter = () => {
    if (!chapterTitle.trim() || !chapterContent.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề và nội dung chương.", variant: "destructive" });
      return;
    }
    toast({ title: "Thành công", description: `Chương ${chapterNumber} đã được đăng!` });
    setChapterTitle("");
    setChapterContent("");
    setShowChapterForm(false);
    setChapterPart("");
    setFlowerPrice("");
    setIsLocked(false);
  };

  const handleParseBulk = () => {
    const result = parseChaptersByRegex(bulkText, bulkRegex);
    setParsedChapters(result);
    if (result.length === 0) {
      toast({ title: "Không tìm thấy chương", description: "Hãy kiểm tra lại regex pattern.", variant: "destructive" });
    } else {
      toast({ title: `Tìm thấy ${result.length} chương`, description: "Xem lại trước khi đăng." });
    }
  };

  const handleBulkPublish = () => {
    toast({ title: "Thành công", description: `Đã đăng ${parsedChapters.length} chương!` });
    setParsedChapters([]);
    setBulkText("");
    setShowBulkUpload(false);
  };

  const handleAddCharacter = () => {
    if (!newCharName.trim()) return;
    setCharacters(prev => [...prev, {
      id: `char-${Date.now()}`,
      name: newCharName,
      role: newCharRole || "Phụ",
      description: newCharDesc,
    }]);
    setNewCharName("");
    setNewCharRole("");
    setNewCharDesc("");
    toast({ title: "Đã thêm nhân vật", description: newCharName });
  };

  if (isLoading && !isNew) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container max-w-3xl py-8 px-4 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40" />
          </main>
        </div>
      </ResponsiveLayout>
    );
  }

  const content = (
    <main className="container max-w-3xl py-8 px-4">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/dashboard"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại quản lý</Link>
      </Button>

      <h1 className="mb-6 border-l-4 border-jade pl-4 text-2xl font-bold">
        {isNew ? "Tạo truyện mới" : `Chỉnh sửa: ${existingStory?.title}`}
      </h1>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none overflow-x-auto">
          <TabsTrigger value="info" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Settings className="h-3.5 w-3.5" /> Thông tin
          </TabsTrigger>
          <TabsTrigger value="chapters" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <BookOpen className="h-3.5 w-3.5" /> Chương ({existingChapters.length})
          </TabsTrigger>
          <TabsTrigger value="characters" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Users className="h-3.5 w-3.5" /> Nhân vật
          </TabsTrigger>
        </TabsList>

        {/* ── Tab Thông tin ── */}
        <TabsContent value="info" className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề truyện..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Mô tả</Label>
            <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Nhập mô tả truyện..." className="min-h-[120px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thể loại</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Đang ra</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="hiatus">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Xianxia, Action, Adventure..." />
          </div>
          {tags && (
            <div className="flex flex-wrap gap-1.5">
              {tags.split(",").map((t, i) => t.trim() && <Badge key={i} variant="secondary" className="text-xs">{t.trim()}</Badge>)}
            </div>
          )}
          <Button onClick={handleSaveStory} className="bg-jade text-white hover:bg-jade/90">
            <Save className="mr-1.5 h-4 w-4" /> {isNew ? "Tạo truyện" : "Lưu thay đổi"}
          </Button>
        </TabsContent>

        {/* ── Tab Chương ── */}
        <TabsContent value="chapters" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">{existingChapters.length} chương đã đăng</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowBulkUpload(!showBulkUpload)} className="gap-1 text-xs">
                <Upload className="h-3.5 w-3.5" /> Đăng hàng loạt
              </Button>
              <Button size="sm" onClick={() => setShowChapterForm(true)} className="bg-jade text-white hover:bg-jade/90 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Thêm chương
              </Button>
            </div>
          </div>

          {/* Existing chapters list */}
          {existingChapters.length > 0 && (
            <div className="space-y-2">
              {existingChapters.map(ch => (
                <div key={ch.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Ch. {ch.chapter_number}: {ch.title}</p>
                    <p className="text-xs text-muted-foreground">{((ch.word_count || 0) / 1000).toFixed(1)}k chữ</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" className="text-xs"><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" className="text-xs text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Bulk Upload Panel ── */}
          {showBulkUpload && (
            <div className="rounded-lg border-2 border-imperial/30 bg-imperial/5 p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <SplitSquareVertical className="h-4 w-4 text-imperial" /> Đăng chương hàng loạt (Regex)
              </h3>
              <p className="text-xs text-muted-foreground">
                Dán toàn bộ nội dung truyện vào đây. Hệ thống sẽ tự động tách chương theo regex pattern.
              </p>
              <div className="space-y-2">
                <Label>Regex Pattern tách chương</Label>
                <Input value={bulkRegex} onChange={e => setBulkRegex(e.target.value)} placeholder="^Chương \d+[.:：]?.*$" className="font-mono text-xs" />
                <p className="text-[10px] text-muted-foreground">
                  Mặc định: <code className="bg-muted px-1 rounded">{"^Chương \\d+[.:：]?.*$"}</code> — Mỗi dòng bắt đầu bằng "Chương" + số sẽ là tiêu đề chương.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Nội dung truyện</Label>
                <Textarea value={bulkText} onChange={e => setBulkText(e.target.value)}
                  placeholder={"Chương 1: Khởi đầu\nNội dung chương 1...\n\nChương 2: Cuộc gặp gỡ\nNội dung chương 2..."}
                  className="min-h-[200px] font-mono text-xs" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleParseBulk} className="bg-imperial text-white hover:bg-imperial/90 gap-1">
                  <Layers className="h-3.5 w-3.5" /> Phân tích ({bulkText.length > 0 ? "..." : "0"})
                </Button>
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>Đóng</Button>
              </div>

              {parsedChapters.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-jade">✓ Tìm thấy {parsedChapters.length} chương</p>
                  <div className="max-h-[200px] overflow-y-auto space-y-1 rounded-lg border border-border p-2">
                    {parsedChapters.map((ch, i) => (
                      <div key={i} className="flex items-center justify-between rounded px-2 py-1.5 text-xs bg-muted/50">
                        <span className="font-medium truncate flex-1">{ch.title}</span>
                        <span className="text-muted-foreground ml-2 shrink-0">{ch.content.split(/\s+/).filter(Boolean).length} từ</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleBulkPublish} className="w-full bg-jade text-white hover:bg-jade/90 gap-1">
                    <Save className="h-3.5 w-3.5" /> Đăng tất cả {parsedChapters.length} chương
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Single Chapter Form ── */}
          {showChapterForm && (
            <div className="rounded-lg border-2 border-jade/30 bg-jade/5 p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-jade" /> Đăng chương mới</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiêu đề chương *</Label>
                  <Input value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} placeholder="Tiêu đề chương..." />
                </div>
                <div className="space-y-2">
                  <Label>Số thứ tự</Label>
                  <Input type="number" value={chapterNumber} onChange={e => setChapterNumber(Number(e.target.value))} min={1} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phần (nếu có)</Label>
                  <Input value={chapterPart} onChange={e => setChapterPart(e.target.value)} placeholder="VD: Phần 1 — Khởi đầu" />
                  <p className="text-[10px] text-muted-foreground">Nhóm các chương theo phần/quyển nếu truyện dài</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Flower2 className="h-3.5 w-3.5 text-gold" /> Giá Sương Hoa</Label>
                  <Input type="number" value={flowerPrice} onChange={e => setFlowerPrice(e.target.value)} placeholder="0 = Miễn phí" min={0} />
                  <p className="text-[10px] text-muted-foreground">Đặt giá để người đọc trả Sương Hoa mở khoá chương</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={isLocked} onCheckedChange={setIsLocked} />
                <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Khoá chương (yêu cầu Sương Hoa)</Label>
              </div>
              <div className="space-y-2">
                <Label>Nội dung chương *</Label>
                <Textarea value={chapterContent} onChange={e => setChapterContent(e.target.value)}
                  placeholder="Viết nội dung chương tại đây..." className="min-h-[300px] font-story text-base leading-relaxed" />
                <p className="text-xs text-muted-foreground text-right">{chapterContent.split(/\s+/).filter(Boolean).length} từ</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handlePublishChapter} className="bg-imperial text-white hover:bg-imperial/90">
                  <Save className="mr-1.5 h-4 w-4" /> Đăng chương
                </Button>
                <Button variant="outline" onClick={() => setShowChapterForm(false)}>Huỷ</Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Tab Nhân vật / Thuật ngữ ── */}
        <TabsContent value="characters" className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-jade" /> Bảng nhân vật & Thuật ngữ
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Tạo bảng nhân vật, thuật ngữ cho truyện để dễ quản lý. Người đọc có thể xem bảng này trong trang chi tiết truyện.
            </p>

            {/* Character list */}
            <div className="space-y-2 mb-4">
              {characters.map(char => (
                <div key={char.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade/10 text-sm font-bold text-jade">
                    {char.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{char.name}</p>
                      <Badge variant="outline" className="text-[10px]">{char.role}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{char.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-destructive shrink-0"
                    onClick={() => setCharacters(prev => prev.filter(c => c.id !== char.id))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add character form */}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase">Thêm nhân vật mới</p>
              <div className="grid grid-cols-2 gap-3">
                <Input value={newCharName} onChange={e => setNewCharName(e.target.value)} placeholder="Tên nhân vật *" />
                <Input value={newCharRole} onChange={e => setNewCharRole(e.target.value)} placeholder="Vai trò (Chính, Phụ, Phản diện...)" />
              </div>
              <Textarea value={newCharDesc} onChange={e => setNewCharDesc(e.target.value)} placeholder="Mô tả ngắn về nhân vật, ngoại hình, tính cách..." className="min-h-[60px]" />
              <Button onClick={handleAddCharacter} size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1">
                <Plus className="h-3.5 w-3.5" /> Thêm nhân vật
              </Button>
            </div>
          </div>
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

export default StoryEditor;
