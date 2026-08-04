import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { ministries } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard } from "@/components/Cards";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/ministries")({
  head: () =>
    pageMeta({
      title: "Ministries — Rock Chapel International",
      description:
        "Worship, children, youth, women, men, outreach, prayer and hospitality — explore the ministries of Rock Chapel International.",
      path: "/ministries",
    }),
  component: Ministries,
});

function Ministries() {
  return (
    <>
      <PageHeader
        eyebrow="Ministries"
        title="There is a place here shaped for you"
        description="Our ministries exist to help you grow in faith, build real friendships and use your gifts to serve others."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((m, i) => (
              <Reveal key={m.title} delay={(i % 3) * 80}>
                <SurfaceCard className="group h-full">
                  <span
                    aria-hidden="true"
                    className="block h-1 w-10 rounded-full bg-gold transition-all duration-500 group-hover:w-16"
                  />
                  <h2 className="mt-5 font-display text-xl font-semibold">{m.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  <p className="mt-6 text-xs tracking-wide text-gold uppercase">{m.meets}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-24">
        <div className="container-page">
          <SectionTitle
            eyebrow="Get involved"
            title="Ready to serve with us?"
            description="Tell us where you would like to plug in and a team lead will reach out with next steps."
            align="center"
          />
          <Reveal delay={120} className="mt-10 text-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">
                Join a ministry <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
