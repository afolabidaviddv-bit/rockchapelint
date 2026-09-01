import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { handleImageError } from "@/lib/image-fallback";
import { useSiteMedia } from "@/hooks/use-site-media";
const g1 = "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80";
const g2 = "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80";
const g3 = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80";
const g4 = "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80";
const hero = "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80";
const sanctuary = "https://images.unsplash.com/photo-1548625361-1934e6c986eb?auto=format&fit=crop&w=1200&q=80";

export const Route = createFileRoute("/gallery")({
  head: () =>
    pageMeta({
      title: "Gallery — Rock Chapel International",
      description:
        "Moments from worship services, children's church, outreaches and community gatherings at Rock Chapel International.",
      path: "/gallery",
    }),
  component: Gallery,
});

const photos = [
  { src: hero, alt: "Congregation worshipping with raised hands", caption: "Sunday worship", span: "sm:col-span-2 sm:row-span-2" },
  { src: g1, alt: "Members serving food to neighbours at an outreach", caption: "Community outreach", span: "" },
  { src: g2, alt: "Worship team leading on stage under warm lights", caption: "Worship team", span: "" },
  { src: g3, alt: "Children smiling in the children's ministry classroom", caption: "Children's church", span: "" },
  { src: g4, alt: "Adults praying together in a circle", caption: "Prayer gathering", span: "" },
  { src: sanctuary, alt: "The sanctuary before service", caption: "Our sanctuary", span: "sm:col-span-2" },
];

function Gallery() {
  const media = useSiteMedia();
  const galleryPhotos = photos.map((photo, index) => ({ ...photo, src: media.assets[`gallery${index}`]?.url || photo.src }));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : galleryPhotos[openIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Life together, captured"
        description="A glimpse into our services, ministries and the communities we serve."
      />

      <section className="py-20 lg:py-28">
        <div className="container-page">
          <ul className="grid auto-rows-[220px] gap-4 sm:grid-cols-3 lg:auto-rows-[260px]">
            {galleryPhotos.map((p, i) => (
              <Reveal key={p.caption} as="li" delay={(i % 3) * 70} className={p.span}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View larger: ${p.caption}`}
                  className="zoom-frame group relative block size-full rounded-2xl border border-border/60 shadow-soft"
                >
                  <img src={p.src} onError={handleImageError} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/90 to-transparent p-4 text-left text-sm font-medium text-primary-foreground">
                    {p.caption}
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-100 grid place-items-center bg-navy/90 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setOpenIndex(null)}
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-primary-foreground/25 text-primary-foreground hover:border-gold hover:text-gold"
          >
            <X className="size-5" />
          </button>
          <figure className="max-h-[85dvh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.src}
              onError={handleImageError}
              alt={active.alt}
              className="max-h-[75dvh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-primary-foreground/80">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
