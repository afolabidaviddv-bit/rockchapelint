import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SurfaceCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-500",
        interactive && "hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  ratio = "aspect-4/3",
  className,
}: {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "zoom-frame group relative rounded-2xl border border-border/60 shadow-soft",
        className,
      )}
    >
      <div className={cn("w-full", ratio)}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {title ? (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/90 to-transparent p-5">
          <p className="font-display text-lg font-semibold text-primary-foreground">{title}</p>
          {subtitle ? <p className="text-xs text-primary-foreground/70">{subtitle}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
