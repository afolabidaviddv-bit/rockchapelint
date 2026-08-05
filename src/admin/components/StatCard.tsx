import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 rounded-2xl border-border/70 p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-16" />
          ) : (
            <p className="mt-2 font-display text-3xl font-semibold text-navy">{value}</p>
          )}
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  );
}
