import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard } from "@/components/Cards";
import { PrayerRequestForm } from "@/components/Forms";

export const Route = createFileRoute("/prayer")({
  head: () =>
    pageMeta({
      title: "Prayer Request — Rock Chapel International",
      description:
        "Submit a confidential prayer request and our intercessory team at Rock Chapel International will stand with you in prayer.",
      path: "/prayer",
    }),
  component: Prayer,
});

function Prayer() {
  return (
    <>
      <PageHeader
        eyebrow="Prayer"
        title="Let us stand with you in prayer"
        description="Nothing is too small or too complicated. Share your request and our intercessors will carry it before God this week."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <Reveal>
            <SectionTitle eyebrow="Your request" title="Send us your prayer point" as="h2" />
            <PrayerRequestForm className="mt-10" />
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={90}>
              <SurfaceCard>
                <h2 className="font-display text-xl font-semibold">Prayer gatherings</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>Daily online prayer · 6:00 AM</li>
                  <li>Wednesday service · 4:00 PM – 6:00 PM</li>
                  <li>Monthly night of prayer · Last Friday</li>
                </ul>
              </SurfaceCard>
            </Reveal>
            <Reveal delay={160}>
              <SurfaceCard>
                <h2 className="font-display text-xl font-semibold">Need to speak to someone?</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our pastoral team is available for confidential conversations and counselling.
                </p>
                <p className="mt-4 text-sm">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-gold hover:underline">
                    {site.phone}
                  </a>
                </p>
              </SurfaceCard>
            </Reveal>
            <Reveal delay={230}>
              <blockquote className="rounded-2xl border border-gold/30 bg-cream p-6">
                <p className="font-display text-lg leading-relaxed text-balance">
                  “Do not be anxious about anything, but in every situation, by prayer and
                  petition, present your requests to God.”
                </p>
                <footer className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">
                  Philippians 4:6
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
