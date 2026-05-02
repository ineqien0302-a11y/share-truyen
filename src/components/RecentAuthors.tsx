import { Link } from "react-router-dom";
import { mockAuthors } from "@/lib/mock-data";

export function RecentAuthors() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="container py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Các tác giả gần đây</h2>
          <span className="text-xs text-muted-foreground">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-jade" />
            Tổng 2835149 · <span className="text-jade">Xem tất cả →</span>
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mockAuthors.map((author) => (
            <Link
              key={author.id}
              to={`/author/${encodeURIComponent(author.name)}`}
              className="flex min-w-[160px] items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: author.color }}
              >
                {author.initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{author.name}</p>
                <p className="text-[10px] text-muted-foreground">{author.lastActive}</p>
                {author.badge && (
                  <span className="mt-0.5 inline-block rounded border border-border px-1.5 py-0 text-[9px] text-muted-foreground">
                    {author.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
