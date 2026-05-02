import { BookOpen, Users, MessageSquare } from "lucide-react";

const stats = [
  { label: "Tác giả", value: "17,923", color: "text-imperial" },
  { label: "Điểu bút", value: "1,470,805", color: "text-jade" },
  { label: "Bình luận", value: "12,222,615", color: "text-gold" },
];

export function HeroBanner() {
  return (
    <section className="bg-card border-b border-border">
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-foreground">MẠNG XÃ HỘI TRUYỆN </span>
          <span className="text-imperial">CHO MỌI NGƯỜI</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nơi chia sẻ niềm đam mê trong thế giới truyện.
        </p>
        <p className="text-sm text-jade">Hoan nghênh mọi người tham gia.</p>

        <div className="mt-6 flex items-center justify-center gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
