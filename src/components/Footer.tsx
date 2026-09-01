import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { navLinks, site } from "@/lib/site";
import { Button } from "./Button";
const logoMark = "https://images.unsplash.com/photo-1548625361-58a2f0f8d7f1?auto=format&fit=crop&w=160&q=85";

export function Footer() {
  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    toast.success("You're subscribed", {
      description: "Look out for our next newsletter in your inbox.",
    });
    form.reset();
  };

  return (
    <footer className="relative overflow-hidden bg-navy text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 85% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="container-page relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logoMark}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={44}
                height={44}
                className="size-11 rounded-xl"
              />
              <span>
                <span className="block font-display text-lg font-semibold">
                  Rock Chapel International
                </span>
                <span className="block text-[0.6rem] tracking-[0.18em] text-primary-foreground/60 uppercase">
                  {site.tagline}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Founded in {site.founded} by {site.founder}, Rock Chapel International is committed to
              evangelism, miracles and discipleship — making men worthy of God's Kingdom.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href || undefined}
                    aria-label={s.href ? s.label : `${s.label} — link coming soon`}
                    aria-disabled={s.href ? undefined : true}
                    className="inline-flex h-9 items-center rounded-full border border-primary-foreground/20 px-4 text-xs tracking-wide transition-colors hover:border-gold hover:text-gold aria-disabled:opacity-50"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Quick Links
            </h2>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Service Times
            </h2>
            <ul className="mt-5 space-y-4">
              {site.services.map((s) => (
                <li key={s.day}>
                  <p className="text-sm font-medium">{s.day}</p>
                  <p className="text-sm text-primary-foreground/70">{s.time}</p>
                  <p className="text-xs text-primary-foreground/50">{s.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Stay Connected
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <a href={`tel:${site.phone}`} className="hover:text-gold">
                    {site.phone}
                  </a>
                  {" · "}
                  <a href={`tel:${site.phoneAlt}`} className="hover:text-gold">
                    {site.phoneAlt}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-gold">
                  {site.email}
                </a>
              </li>
            </ul>
            <form onSubmit={onSubscribe} className="mt-6">
              <label htmlFor="newsletter-email" className="text-xs text-primary-foreground/60">
                Newsletter
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="h-11 min-w-0 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                />
                <Button type="submit" variant="gold" size="md">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Founded by {site.founder}</p>
        </div>
      </div>
    </footer>
  );
}
