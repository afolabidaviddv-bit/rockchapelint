import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-navy pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 80% at 15% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%), radial-gradient(50% 70% at 90% 20%, color-mix(in oklab, var(--sky) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="container-page relative">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
            <li>
              <Link to="/" className="transition-colors hover:text-gold">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li aria-current="page" className="text-gold">
              {eyebrow}
            </li>
          </ol>
        </nav>
        <p className="mb-4 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold text-balance text-primary-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
