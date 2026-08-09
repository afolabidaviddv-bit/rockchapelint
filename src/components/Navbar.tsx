import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/lib/site";
import { Button } from "./Button";
import logoMark from "@/assets/logo-mark.png";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open ? "glass-panel py-2" : "border-b border-transparent py-4",
      )}
    >
      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={`${site.name} home`}>
          <img
            src={logoMark}
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-xl shadow-soft"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight font-semibold sm:text-lg">
              Rock Chapel International
            </span>
            <span className="block truncate text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="group relative rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-data-[status=active]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end xl:hidden">
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link to="/give">Give</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-gold"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="container-page mt-3 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-6 xl:hidden"
      >
        <ul className="grid gap-1">
          {navLinks.map((link, i) => (
            <li key={link.to} style={{ animationDelay: `${i * 35}ms` }} className="animate-fade-in">
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-gold opacity-0 transition-opacity group-data-[status=active]:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
