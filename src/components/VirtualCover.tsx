import { Link } from "react-router-dom";
import type { Story } from "@/lib/mock-data";

export interface VirtualCoverProps {
  story?: Story;
  title?: string;
  color?: string;
  size?: "sm" | "default";
}

export function VirtualCover({ story, title, color, size = "default" }: VirtualCoverProps) {
  const displayTitle = story?.title || title || "";
  const displayColor = story?.cover_color || color || "hsl(210 40% 92%)";
  const firstLetter = displayTitle.charAt(0);

  const isSm = size === "sm";
  const h = isSm ? "h-16 w-12" : "h-40 w-[120px]";
  const textSize = isSm ? "text-xl" : "text-5xl";

  const cover = (
    <div
      className={`relative flex ${h} flex-col items-center justify-center overflow-hidden rounded-sm border border-border transition-shadow hover:shadow-md`}
      style={{ backgroundColor: displayColor }}
    >
      <span className={`font-story ${textSize} font-bold text-foreground/30 transition-colors group-hover:text-foreground/50`}>
        {firstLetter}
      </span>
      {!isSm && (
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-2 py-1.5 backdrop-blur-sm">
          <p className="truncate text-[10px] font-medium leading-tight text-foreground">{displayTitle}</p>
        </div>
      )}
    </div>
  );

  if (story) {
    return (
      <Link to={`/story/${story.id}`} className="group block">
        {cover}
        {!isSm && <p className="mt-1.5 w-[120px] truncate text-xs text-muted-foreground">{story.author}</p>}
      </Link>
    );
  }

  return cover;
}
