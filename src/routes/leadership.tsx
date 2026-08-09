import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { leaders, site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard } from "@/components/Cards";
import founderImg from "@/assets/founder.jpg";

export const Route = createFileRoute("/leadership")({
  head: () =>
    pageMeta({
      title: "Leadership — Rock Chapel International",
      description:
        "Meet Apostle Tunde Oke and the pastoral team shepherding Rock Chapel International across BCGA and Agunbelewo.",
      path: "/leadership",
    }),
  component: Leadership,
});

function Leadership() {
  const [founder, ...team] = leaders;

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="The people entrusted with shepherding this house"
        description="A team committed to serving with humility, teaching with clarity and caring for every member personally."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="zoom-frame rounded-3xl border border-border/60 shadow-lift">
            <img
              src={founderImg}
              alt={`Portrait of ${site.founder}`}
              width={1000}
              height={1200}
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionTitle
              eyebrow="Founder & Presiding Apostle"
              title={founder!.name}
              description={founder!.bio}
            />
            <Reveal delay={120} className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Known for teaching that is both scholarly and deeply practical, Apostle Oke has
                spent decades raising ministers, planting churches and championing community
                development.
              </p>
              <p>
                He leads Rock Chapel International alongside a devoted pastoral team across the
                {" "}{site.headquarters} and {site.branch}.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle
            eyebrow="Pastoral team"
            title="Serving alongside our founder"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((leader, i) => (
              <Reveal key={leader.name} delay={i * 80}>
                <SurfaceCard className="h-full">
                  <span
                    aria-hidden="true"
                    className="grid size-14 place-items-center rounded-full bg-navy font-display text-lg font-semibold text-gold"
                  >
                    {leader.name
                      .split(" ")
                      .filter((w) => /^[A-Z]/.test(w))
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{leader.name}</h3>
                  <p className="mt-1 text-xs tracking-wide text-gold uppercase">{leader.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{leader.bio}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
