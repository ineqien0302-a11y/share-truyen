import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Story } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface StoryListItemProps {
  story: Story;
  rank?: number;
}

export function StoryListItem({ story, rank }: StoryListItemProps) {
  return (
    <Link
      to={`/story/${story.id}`}
      className="group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      {rank !== undefined && (
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
          {story.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{story.author}</span>
          <span>·</span>
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
            {story.genre}
          </Badge>
          {story.status === "ongoing" && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {story.updated_at}
              </span>
            </>
          )}
        </div>
      </div>
      <Badge
        variant={story.status === "completed" ? "default" : "outline"}
        className="mt-0.5 shrink-0 text-[10px]"
      >
        {story.status === "completed" ? "Complete" : "Ongoing"}
      </Badge>
    </Link>
  );
}
