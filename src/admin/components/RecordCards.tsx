import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MediaThumb } from "./MediaUpload";
import { stripHtml } from "./RichTextEditor";
import type { BaseRecord, CardConfig } from "@/admin/types";

const tone = (value: string) => {
  const v = value.toLowerCase();
  if (["high", "new", "unread", "upcoming"].includes(v)) return "bg-gold/20 text-navy";
  if (["answered", "replied", "subscribed"].includes(v)) return "bg-sky/15 text-navy";
  return "bg-muted text-muted-foreground";
};

export function RecordCards({
  rows,
  card,
  loading,
  canEdit = true,
  onEdit,
  onDelete,
  empty,
}: {
  rows: BaseRecord[];
  card: CardConfig;
  loading?: boolean;
  canEdit?: boolean;
  onEdit: (row: BaseRecord) => void;
  onDelete: (row: BaseRecord) => void;
  empty: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl sm:h-44" />
        ))}
      </div>
    );
  }
  if (rows.length === 0) return <>{empty}</>;

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 xl:grid-cols-3">
      {rows.map((row) => {
        const badge = card.badge ? String(row[card.badge] ?? "") : "";
        const published = row["published"];
        return (
          <Card
            key={row.id}
            className="group flex flex-col gap-3 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold"
          >
            {card.image && row[card.image] ? (
              <MediaThumb
                value={row[card.image]}
                alt={String(row[card.title] ?? "Image")}
                className="h-36 w-full rounded-none sm:h-40"
              />
            ) : null}

            <div className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  {card.eyebrow ? (
                    <p className="truncate text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
                      {String(row[card.eyebrow] ?? "—")}
                    </p>
                  ) : null}
                  <h3 className="line-clamp-2 font-display text-base leading-snug font-semibold text-navy sm:text-lg">
                    {String(row[card.title] ?? "Untitled")}
                  </h3>
                </div>

                {badge ? (
                  <Badge className={cn("shrink-0 rounded-full border-none capitalize", tone(badge))}>
                    {badge}
                  </Badge>
                ) : null}
              </div>

              {card.body ? (
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {stripHtml(row[card.body]) || "No details provided."}
                </p>
              ) : null}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {published !== undefined ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border-transparent",
                        published ? "bg-gold/15 text-navy" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {published ? "Published" : "Draft"}
                    </Badge>
                  ) : null}
                  {(card.meta ?? []).map((m) =>
                    row[m] ? (
                      <span key={m} className="truncate">
                        {String(row[m])}
                      </span>
                    ) : null,
                  )}
                </div>
                {/* Always visible on mobile, hover-reveal on desktop */}
                <div className="flex shrink-0 gap-1 sm:opacity-70 sm:transition-opacity sm:group-hover:opacity-100">
                  {canEdit ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="size-4" /> Edit
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label="Delete"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
