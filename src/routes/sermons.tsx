import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { sermons } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SermonCard } from "@/components/ContentCards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sermons")({
  head: () =>
    pageMeta({
      title: "Sermons — Rock Chapel International",
      description:
        "Listen to recent messages from Apostle Timothy Olatunde Oke and the Rock Chapel International teaching team.",
      path: "/sermons",
    }),
  component: Sermons,
});

function Sermons() {
  const seriesList = useMemo(
    () => ["All", ...Array.from(new Set(sermons.map((s) => s.series)))],
    [],
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? sermons : sermons.filter((s) => s.series === active);

  return (
    <>
      <PageHeader
        eyebrow="Sermons"
        title="Messages that meet you where you are"
        description="Catch up on recent teaching, revisit a series, or share a message with someone who needs it."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div
            role="group"
            aria-label="Filter sermons by series"
            className="flex flex-wrap gap-2 border-b border-border pb-6"
          >
            {seriesList.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActive(s)}
                aria-pressed={active === s}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                  active === s
                    ? "border-gold bg-gold text-navy"
                    : "border-border text-muted-foreground hover:border-gold hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 80}>
                <SermonCard sermon={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
