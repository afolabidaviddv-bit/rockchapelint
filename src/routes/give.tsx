import { createFileRoute } from "@tanstack/react-router";
import { Banknote, HandHeart, Landmark, Repeat } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard } from "@/components/Cards";
import { DonationCard } from "@/components/ContentCards";

export const Route = createFileRoute("/give")({
  head: () =>
    pageMeta({
      title: "Give — Rock Chapel International",
      description:
        "Support the mission of Rock Chapel International through tithes, offerings, missions giving and the building fund.",
      path: "/give",
    }),
  component: Give,
});

const methods = [
  {
    icon: Landmark,
    title: "Bank transfer",
    body: "Account Name: Rock Chapel International · Bank: Placeholder Bank · Account No: 0000000000",
  },
  {
    icon: Banknote,
    title: "In service",
    body: "Give during our Sunday or Wednesday gatherings at the offering point.",
  },
  {
    icon: Repeat,
    title: "Standing order",
    body: "Set up a recurring gift with your bank to support the work consistently.",
  },
  {
    icon: HandHeart,
    title: "Give in kind",
    body: "Donate goods, materials or professional services to our outreach programmes.",
  },
];

function Give() {
  return (
    <>
      <PageHeader
        eyebrow="Give"
        title="Partner with the work God is doing"
        description="Every gift fuels teaching, outreach, welfare and the day-to-day life of the church at BCGA and Agunbelewo."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle
            eyebrow="Make a gift"
            title="Choose an amount that suits you"
            align="center"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Reveal>
              <DonationCard
                title="Supporter"
                amount="₦5,000"
                description="Helps provide materials for children's church and midweek study."
              />
            </Reveal>
            <Reveal delay={90}>
              <DonationCard
                title="Partner"
                amount="₦20,000"
                description="Supports outreach logistics, welfare packages and community projects."
                featured
              />
            </Reveal>
            <Reveal delay={180}>
              <DonationCard
                title="Builder"
                amount="₦50,000"
                description="Invests in facilities, equipment and the long-term growth of the house."
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="container-page">
          <SectionTitle eyebrow="Other ways" title="How you can give" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {methods.map((m, i) => (
              <Reveal key={m.title} delay={(i % 2) * 90}>
                <SurfaceCard className="flex h-full gap-4">
                  <m.icon className="size-6 shrink-0 text-gold" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                  </div>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="mt-10 text-sm text-muted-foreground">
            <p>
              Questions about giving? Email{" "}
              <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">
                {site.email}
              </a>
              . Account details above are placeholders and can be replaced at any time.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
