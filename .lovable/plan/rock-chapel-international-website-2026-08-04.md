# Rock Chapel International — Website

A premium, 10-page church website with navy/gold branding, Playfair Display headings, and tasteful motion throughout.

## Design foundation

- Tokens in `src/styles.css`: navy `#0F172A` (primary), gold `#D4AF37` (secondary), sky `#38BDF8` (accent), white background, slate `#334155` text — all as oklch semantic tokens, plus gradient and soft-shadow tokens.
- Fonts loaded via `<link>` in the root route: Playfair Display (headings), Inter (body).
- Generous whitespace, rounded corners, soft shadows, subtle gradient washes, restrained glassmorphism on the sticky nav.
- Animation utilities: fade-in, slide-up, image zoom on hover, button micro-interactions, scroll-reveal via IntersectionObserver, animated counters.

## Pages (all routed)

Home, About, Leadership, Ministries, Sermons, Events, Gallery, Give, Prayer Request, Contact.

- **Home**: hero with founder/welcome message, service times band, about teaser, ministries preview, upcoming events, latest sermon, animated stats counters, testimonials, CTA.
- **About**: story, mission/vision/values, beliefs, animated milestones.
- **Leadership**: Apostle Timothy Olatunde Oke featured, plus leadership team cards.
- **Ministries**: card grid of ministries with detail copy.
- **Sermons**: sermon cards with series/speaker/date and filter.
- **Events**: upcoming/past event cards with date badges.
- **Gallery**: masonry-ish image grid with hover zoom and lightbox.
- **Give**: giving options, donation cards, bank/transfer placeholders.
- **Prayer Request**: prayer form.
- **Contact**: contact form, HQ (BCGA) and Agunbelewo branch info, service times, map placeholder.

## Shared components

Navbar (sticky, logo left, 10 links, active indicator, mobile hamburger drawer), Footer (quick links, service times, contact, socials, newsletter, copyright), Button variants, Card, SectionTitle, PageHeader, ImageCard, TestimonialCard, EventCard, SermonCard, GalleryCard, ContactForm, PrayerRequestForm, DonationCard, StatCounter, Reveal wrapper.

## Content

Church name, founder, HQ BCGA, Agunbelewo branch, Sunday 9:00 AM–12:00 PM, Wednesday 4:00 PM–6:00 PM are real. Everything else is professional placeholder copy that's easy to swap.

## Technical notes

- TanStack Start file routes under `src/routes/`, per-route `head()` with unique title, description, og:title/og:description, canonical.
- Semantic HTML, one `<h1>` per page, ARIA labels on icon buttons, keyboard-accessible menus and forms, visible focus rings.
- Images generated into `src/assets/`, imported as ES modules, `loading="lazy"` below the fold.
- Forms are frontend-only in this pass: validated with client-side state and show a success toast (no data is stored). Hooking them to Lovable Cloud for real submissions/email is a follow-up if wanted.
