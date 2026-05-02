import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const GENRES = ["Fantasy", "Romance", "History", "Mystery", "Sci-Fi", "Horror"];
const STATUSES = ["Ongoing", "Completed"];
const WORD_COUNTS = ["< 50k", "50k - 100k", "100k - 200k", "200k+"];

interface FilterState {
  genres: string[];
  statuses: string[];
  wordCounts: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

function FilterGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {title}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                selected.includes(item)
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterContent({ filters, onFiltersChange }: FilterSidebarProps) {
  const toggle = (key: keyof FilterState, item: string) => {
    const current = filters[key];
    onFiltersChange({
      ...filters,
      [key]: current.includes(item) ? current.filter((i) => i !== item) : [...current, item],
    });
  };

  const activeCount = filters.genres.length + filters.statuses.length + filters.wordCounts.length;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-medium">Filters</span>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ genres: [], statuses: [], wordCounts: [] })}
            className="h-6 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" /> Clear ({activeCount})
          </Button>
        )}
      </div>
      <FilterGroup title="Genre" items={GENRES} selected={filters.genres} onToggle={(i) => toggle("genres", i)} />
      <FilterGroup title="Status" items={STATUSES} selected={filters.statuses} onToggle={(i) => toggle("statuses", i)} />
      <FilterGroup title="Word Count" items={WORD_COUNTS} selected={filters.wordCounts} onToggle={(i) => toggle("wordCounts", i)} />
    </div>
  );
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const isMobile = useIsMobile();
  const activeCount = filters.genres.length + filters.statuses.length + filters.wordCounts.length;

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 rounded-full p-0 text-[10px]">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-56 shrink-0">
      <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
    </aside>
  );
}

export type { FilterState };
