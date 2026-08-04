import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { events } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { EventCard } from "@/components/ContentCards";

export const Route = createFileRoute("/events")({
  head: () =>
    pageMeta({
      title: "Events — Rock Chapel International",
      description:
        "Encounter nights, outreaches, summits and youth gatherings. See what's coming up at Rock Chapel International.",
      path: "/events",
    }),
  component: Events,
});

function Events() {
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Gather with us throughout the year"
        description="From encounter nights to community outreaches, there is always something to be part of."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle eyebrow="Upcoming" title="Save the date" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => (
              <Reveal key={e.title} delay={(i % 3) * 80}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle eyebrow="Recently" title="Looking back with gratitude" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((e, i) => (
              <Reveal key={e.title} delay={(i % 3) * 80}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
