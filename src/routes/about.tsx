import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { beliefs, site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard, ImageCard } from "@/components/Cards";
import { StatCounter } from "@/components/StatCounter";
import sanctuaryImg from "@/assets/about-sanctuary.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta({
      title: "About Us — Rock Chapel International",
      description:
        "Our story, mission and beliefs. Rock Chapel International is a Word-centred church family founded by Apostle Tunde Oke.",
      path: "/about",
    }),
  component: About,
});

const milestones = [
  {
    year: "2002",
    title: "The church is founded",
    body: "Apostle Tunde Oke founds Rock Chapel International with a mandate for evangelism and discipleship.",
  },
  {
    year: "Today",
    title: "Osogbo & Agunbelewo",
    body: "Worship continues at No. 10 Ajibade Street, BCGA, Osogbo, with ministry reaching Agunbelewo.",
  },
  {
    year: "Arms",
    title: "Schools & radio",
    body: "Rock Model Schools and our Radio Gospel Broadcast extend the vision beyond our walls.",
  },
  {
    year: "Ahead",
    title: "More milestones",
    body: "Placeholder — add further dates and achievements from the admin dashboard.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Rooted in the Word, reaching our community"
        description={`${site.name} exists so that ordinary people can encounter an extraordinary God — and be sent back into their world changed.`}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionTitle
              eyebrow="Our story"
              title="From a prayer meeting to a growing family"
              description="What began as a small circle of believers praying in a living room has grown into a multi-location church family. Through every season the heartbeat has stayed the same: faithful teaching, sincere worship and open arms."
            />
            <Reveal delay={120} className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Under the leadership of {site.founder}, the church has planted ministries that
                reach children, youth, families and the wider community. We believe the local
                church is God's plan for the neighbourhood it stands in.
              </p>
              <p>
                Whether you are exploring faith for the first time or looking for a home to serve
                in, there is space at this table for you.
              </p>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <ImageCard
              src={sanctuaryImg}
              alt="Interior of the Rock Chapel International sanctuary"
              ratio="aspect-4/5"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle
            eyebrow="Mission, vision & values"
            title="What drives everything we do"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Our Mission",
                body: "To make disciples who love God deeply, love people practically and live on purpose.",
              },
              {
                title: "Our Vision",
                body: "A community transformed by the gospel, one household and one neighbourhood at a time.",
              },
              {
                title: "Our Values",
                body: "Scripture first. Genuine warmth. Excellence without pretence. Generosity as a lifestyle.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <SurfaceCard className="h-full">
                  <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle eyebrow="What we believe" title="Our core convictions" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {beliefs.map((b, i) => (
              <Reveal key={b.title} delay={i * 80}>
                <SurfaceCard className="h-full">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 lg:py-24">
        <div className="container-page">
          <SectionTitle eyebrow="Milestones" title="Our journey so far" tone="dark" align="center" />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 90} as="li">
                <div className="h-full rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
                  <p className="font-display text-2xl font-semibold text-gold">{m.year}</p>
                  <h3 className="mt-3 text-base font-semibold text-primary-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm text-primary-foreground/70">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <StatCounter value={24} suffix="+" label="Years of ministry" />
            <StatCounter value={200} suffix="+" label="Volunteers serving" />
            <StatCounter value={1500} suffix="+" label="Lives touched yearly" />
          </div>
        </div>
      </section>
    </>
  );
}
