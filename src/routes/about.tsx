import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { beliefs, coreValues, site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard, ImageCard } from "@/components/Cards";
import { StatCounter } from "@/components/StatCounter";
const sanctuaryImg = "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85";

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
              title="Founded in 2002 to bring succour to our generation"
              description="Rock Chapel International was founded in 2002 by Apostle Tunde Oke, with a clear mandate: evangelism, miracles and discipleship."
            />
            <Reveal delay={120} className="mt-6 space-y-4 text-muted-foreground">
              <p>
                From the beginning, the church has been committed to making men worthy of God's
                Kingdom — teaching the Word faithfully, praying expectantly and caring for the
                community around us.
              </p>
              <p>
                Today we gather at {site.address}, and our arms — Rock Model Schools and the Radio
                Gospel Broadcast — carry that same mandate further.
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
            eyebrow="Core values"
            title="Faithfulness · Commitment · Goal-getting"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {coreValues.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <SurfaceCard className="h-full">
                  <span
                    aria-hidden="true"
                    className="grid size-12 place-items-center rounded-2xl bg-navy font-display text-lg font-semibold text-gold"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
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
