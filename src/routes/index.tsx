import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import {
  site,
  ministries,
  events,
  sermons,
  testimonials,
  coreValues,
  organizations,
} from "@/lib/site";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { SurfaceCard, ImageCard } from "@/components/Cards";
import { EventCard, SermonCard, TestimonialCard } from "@/components/ContentCards";
import { StatCounter } from "@/components/StatCounter";
import heroImg from "@/assets/hero-worship.jpg";
import sanctuaryImg from "@/assets/about-sanctuary.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta({
      title: "Rock Chapel International — Bringing Succour to Our Generation",
      description:
        "Rock Chapel International, founded in 2002 by Apostle Tunde Oke. Sunday service 9:00 AM, Wednesday 4:00 PM at No. 10 Ajibade Street, BCGA, Osogbo, Osun State.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-dvh items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Congregation worshipping with raised hands as golden light streams through the windows"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-navy via-navy/80 to-navy/40"
        />
        <div className="container-page relative pt-36 pb-20 sm:pb-28">
          <div className="max-w-3xl">
            <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy/40 px-4 py-2 text-xs tracking-[0.2em] text-gold uppercase backdrop-blur-sm">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {site.tagline}
            </p>
            <h1 className="animate-fade-in mt-6 font-display text-4xl leading-[1.05] font-semibold text-balance text-primary-foreground sm:text-6xl lg:text-7xl">
              Rock Chapel <span className="text-gradient-gold">International</span>
            </h1>
            <p className="animate-fade-in mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Founded in {site.founded} by {site.founder}, we are committed to evangelism,
              miracles and discipleship — making men worthy of God's Kingdom.
            </p>
            <div className="animate-fade-in mt-9 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/about">
                  Plan your visit <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="onDark" size="lg">
                <Link to="/sermons">Watch a sermon</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service times band */}
      <section aria-label="Service times and location" className="border-b border-border bg-cream">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((s, i) => (
            <Reveal key={s.day} delay={i * 80} className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-medium">{s.day}</p>
                <p className="text-sm text-muted-foreground">
                  {s.time} · {s.note}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={160} className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-medium">Church address</p>
              <p className="text-sm text-muted-foreground">{site.address}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 lg:py-24">
        <div className="container-page">
          <SectionTitle
            eyebrow="Core values"
            title="What we live by"
            description="Three convictions shape how we worship, serve and grow together."
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {coreValues.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <SurfaceCard className="h-full text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto grid size-12 place-items-center rounded-2xl bg-navy font-display text-lg font-semibold text-gold"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ImageCard
              src={sanctuaryImg}
              alt="Bright, modern church sanctuary with wooden seating and gold pendant lights"
              ratio="aspect-4/3"
            />
          </Reveal>
          <div>
            <SectionTitle
              eyebrow="Who we are"
              title="A warm family rooted in the unchanging Word"
              description="Rock Chapel International began with a simple conviction: that scripture, faithfully taught and joyfully lived, still transforms lives. Today that conviction shapes every gathering, ministry and outreach we run."
            />
            <Reveal delay={120} className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Word-centred", body: "Teaching that is faithful, practical and clear." },
                { title: "Genuinely warm", body: "Every guest is welcomed like family." },
                { title: "Community-first", body: "Serving Agunbelewo and beyond, all year." },
                { title: "Spirit-led", body: "Worship and prayer that expect God to move." },
              ].map((item) => (
                <SurfaceCard key={item.title} className="p-5">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </SurfaceCard>
              ))}
            </Reveal>
            <Reveal delay={200} className="mt-8">
              <Button asChild variant="outline">
                <Link to="/about">
                  Our story <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ministries preview */}
      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle
            eyebrow="Ministries"
            title="Find your place to belong and serve"
            description="Whatever your season, there is a community here shaped for you."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.slice(0, 6).map((m, i) => (
              <Reveal key={m.title} delay={i * 70}>
                <SurfaceCard className="h-full">
                  <h3 className="font-display text-xl font-semibold">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  <p className="mt-5 text-xs tracking-wide text-gold uppercase">{m.meets}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="mt-12 text-center">
            <Button asChild variant="primary">
              <Link to="/ministries">
                See all ministries <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 70% at 20% 10%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%), radial-gradient(45% 60% at 85% 90%, color-mix(in oklab, var(--sky) 16%, transparent), transparent 70%)",
          }}
        />
        <div className="container-page relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <StatCounter value={24} suffix="+" label="Years of ministry" />
          <StatCounter value={1500} suffix="+" label="Lives touched yearly" />
          <StatCounter value={12} label="Active ministries" />
          <StatCounter value={2} label="Locations" />
        </div>
      </section>

      {/* Events + Sermon */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="What's coming"
              title="Upcoming events at Rock Chapel"
              description="Mark your calendar and join us — everyone is welcome."
            />
            <Reveal delay={100}>
              <Button asChild variant="outline">
                <Link to="/events">
                  All events <CalendarDays aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((e) => e.upcoming)
              .slice(0, 3)
              .map((e, i) => (
                <Reveal key={e.title} delay={i * 80}>
                  <EventCard event={e} />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle
            eyebrow="Latest teaching"
            title="Messages to carry through your week"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sermons.slice(0, 3).map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <SermonCard sermon={s} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="mt-12 text-center">
            <Button asChild variant="primary">
              <Link to="/sermons">
                Browse the library <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
        <div className="container-page relative">
          <SectionTitle
            eyebrow="Testimonies"
            title="Stories from our church family"
            tone="dark"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <Reveal className="relative overflow-hidden rounded-3xl border border-gold/30 bg-cream px-6 py-14 text-center shadow-soft sm:px-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-balance sm:text-4xl">
              We would love to meet you this Sunday
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Come as you are at 9:00 AM. Need prayer before then? Our intercessors are ready to
              stand with you.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/contact">Plan your visit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/prayer">Request prayer</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
