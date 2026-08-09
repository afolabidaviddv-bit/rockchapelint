import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { Reveal } from "@/components/Reveal";
import { SurfaceCard } from "@/components/Cards";
import { ContactForm } from "@/components/Forms";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta({
      title: "Contact Us — Rock Chapel International",
      description:
        "Get in touch with Rock Chapel International. Visit us at BCGA headquarters or the Agunbelewo branch, or send us a message online.",
      path: "/contact",
    }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Planning a first visit, exploring membership or simply have a question? Reach out — a real person will reply."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <SectionTitle eyebrow="Send a message" title="Tell us how we can help" as="h2" />
            <ContactForm className="mt-10" />
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={90}>
              <SurfaceCard>
                <h2 className="font-display text-xl font-semibold">Church address</h2>
                <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      <strong className="block font-medium text-foreground">{site.address}</strong>
                      Sunday & Wednesday services
                    </span>
                  </li>
                </ul>
              </SurfaceCard>
            </Reveal>

            <Reveal delay={160}>
              <SurfaceCard>
                <h2 className="font-display text-xl font-semibold">Service times</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {site.services.map((s) => (
                    <li key={s.day} className="flex gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                      <span>
                        <strong className="block font-medium text-foreground">{s.day}</strong>
                        {s.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            </Reveal>

            <Reveal delay={230}>
              <SurfaceCard>
                <h2 className="font-display text-xl font-semibold">Reach us directly</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <a href={`tel:${site.phone}`} className="hover:text-gold">
                      {site.phone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <a href={`tel:${site.phoneAlt}`} className="hover:text-gold">
                      {site.phoneAlt}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <a href={`mailto:${site.email}`} className="break-all hover:text-gold">
                      {site.email}
                    </a>
                  </li>
                </ul>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat with us on WhatsApp
                </a>
              </SurfaceCard>
            </Reveal>

            <Reveal delay={300}>
              <iframe
                title="Map showing Rock Chapel International"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full rounded-2xl border border-border/60 shadow-soft"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
