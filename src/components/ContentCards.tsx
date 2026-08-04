import { CalendarDays, Clock, MapPin, PlayCircle, Quote } from "lucide-react";
import { SurfaceCard } from "./Cards";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
}: {
  event: {
    title: string;
    date: string;
    day: string;
    month: string;
    time: string;
    location: string;
    description: string;
    upcoming: boolean;
  };
}) {
  return (
    <SurfaceCard className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid size-16 shrink-0 place-items-center rounded-xl text-center",
            event.upcoming ? "bg-navy text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          <span>
            <span className="block font-display text-xl leading-none font-semibold">
              {event.day}
            </span>
            <span className="block text-[0.6rem] tracking-[0.18em] uppercase">{event.month}</span>
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-balance">{event.title}</h3>
          <p className="mt-1 text-xs tracking-wide text-gold uppercase">
            {event.upcoming ? "Upcoming" : "Past event"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
      <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-gold" aria-hidden="true" />
          {event.date}
        </li>
        <li className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-gold" aria-hidden="true" />
          {event.time}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
          {event.location}
        </li>
      </ul>
    </SurfaceCard>
  );
}

export function SermonCard({
  sermon,
}: {
  sermon: {
    title: string;
    speaker: string;
    series: string;
    date: string;
    duration: string;
    summary: string;
  };
}) {
  return (
    <SurfaceCard className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
          {sermon.series}
        </span>
        <span className="text-xs text-muted-foreground">{sermon.duration}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-balance">{sermon.title}</h3>
      <p className="mt-1 text-sm text-gold">{sermon.speaker}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{sermon.summary}</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{sermon.date}</span>
        <Button variant="outline" size="sm" aria-label={`Listen to ${sermon.title}`}>
          <PlayCircle aria-hidden="true" />
          Listen
        </Button>
      </div>
    </SurfaceCard>
  );
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial: { quote: string; name: string; role: string };
}) {
  return (
    <figure className="relative h-full rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
      <Quote className="size-7 text-gold" aria-hidden="true" />
      <blockquote className="mt-4 text-sm leading-relaxed text-primary-foreground/85">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6">
        <p className="font-display text-base font-semibold text-primary-foreground">
          {testimonial.name}
        </p>
        <p className="text-xs text-primary-foreground/60">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}

export function DonationCard({
  title,
  amount,
  description,
  featured = false,
}: {
  title: string;
  amount: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <SurfaceCard
      className={cn(
        "flex h-full flex-col",
        featured && "border-gold/50 ring-1 ring-gold/30 shadow-gold",
      )}
    >
      {featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-navy uppercase">
          Most chosen
        </span>
      ) : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 font-display text-3xl font-semibold text-gold">{amount}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Button variant={featured ? "gold" : "outline"} className="mt-6 w-full">
        Give {amount}
      </Button>
    </SurfaceCard>
  );
}
