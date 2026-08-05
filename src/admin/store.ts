import { events, leaders, ministries, sermons, site } from "@/lib/site";
import type { BaseRecord, CollectionKey } from "./types";

/**
 * Local persistence adapter.
 *
 * This is the ONLY module that touches storage. When Lovable Cloud (Supabase)
 * is connected, replace the bodies of `list` / `create` / `update` / `remove`
 * with `supabase.from(collection)...` calls — the signatures already match
 * PostgREST responses, so no component needs to change.
 */

const STORAGE_KEY = "rc_admin_db_v1";
const LATENCY = 260;

type DB = Record<CollectionKey, BaseRecord[]>;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const stamp = (offsetDays = 0) =>
  new Date(Date.now() - offsetDays * 86_400_000).toISOString();

const row = (data: Record<string, unknown>, offsetDays = 0): BaseRecord => ({
  id: uid(),
  created_at: stamp(offsetDays),
  ...data,
});

function seed(): DB {
  return {
    homepage_sections: [
      row({
        section: "Hero",
        heading: "A place of encounter, growth and purpose.",
        subheading:
          "Rock Chapel International is a Word-centred family where every person is seen, discipled and sent.",
        cta_label: "Plan your visit",
        cta_link: "/contact",
        published: true,
        order: 1,
      }),
      row({
        section: "Welcome",
        heading: "You are welcome here",
        subheading:
          "Whether you are exploring faith or looking for a church home, there is a seat for you.",
        cta_label: "About us",
        cta_link: "/about",
        published: true,
        order: 2,
      }),
      row({
        section: "Service Times",
        heading: "Gather with us",
        subheading: "Sunday 9:00 AM – 12:00 PM · Wednesday 4:00 PM – 6:00 PM",
        cta_label: "Get directions",
        cta_link: "/contact",
        published: true,
        order: 3,
      }),
    ],
    leaders: leaders.map((l, i) =>
      row({ name: l.name, role: l.role, bio: l.bio, image_url: "", order: i + 1, published: true }, i),
    ),
    ministries: ministries.map((m, i) =>
      row(
        { title: m.title, description: m.description, meets: m.meets, leader: "", published: true },
        i,
      ),
    ),
    sermons: sermons.map((s, i) =>
      row(
        {
          title: s.title,
          speaker: s.speaker,
          series: s.series,
          date: s.date,
          duration: s.duration,
          summary: s.summary,
          video_url: "",
          published: true,
        },
        i,
      ),
    ),
    events: events.map((e, i) =>
      row(
        {
          title: e.title,
          date: e.date,
          time: e.time,
          location: e.location,
          description: e.description,
          status: e.upcoming ? "upcoming" : "past",
          published: true,
        },
        i,
      ),
    ),
    gallery: [
      row({ title: "Sunday worship", album: "Worship", image_url: "", caption: "Morning service", published: true }),
      row({ title: "Community outreach", album: "Outreach", image_url: "", caption: "Agunbelewo drive", published: true }),
      row({ title: "Youth convergence", album: "Youth", image_url: "", caption: "Teens & campus", published: true }),
      row({ title: "Choir rehearsal", album: "Worship", image_url: "", caption: "Friday evening", published: false }),
    ],
    announcements: [
      row({
        title: "Encounter Night — August 14",
        body: "Join us for an evening of worship, prayer and prophetic ministry at the headquarters.",
        priority: "high",
        published: true,
      }),
      row({
        title: "New members class",
        body: "Four-week class begins Sunday after second service. Register at the welcome desk.",
        priority: "normal",
        published: true,
      }),
    ],
    prayer_requests: [
      row({
        name: "Adaeze N.",
        email: "adaeze@email.com",
        category: "healing",
        request: "Please stand with my family for complete healing and restoration.",
        status: "new",
        confidential: true,
      }, 1),
      row({
        name: "Bidemi A.",
        email: "bidemi@email.com",
        category: "career",
        request: "Believing God for open doors and favour in a new role.",
        status: "praying",
        confidential: false,
      }, 3),
      row({
        name: "Mr. Olayinka",
        email: "olayinka@email.com",
        category: "thanksgiving",
        request: "Testimony of safe delivery — grateful to God.",
        status: "answered",
        confidential: false,
      }, 9),
    ],
    contact_messages: [
      row({
        name: "Grace Adebayo",
        email: "grace@email.com",
        subject: "Volunteering with the children's church",
        message: "I would love to serve with the children's ministry. What is the next step?",
        status: "unread",
      }, 0),
      row({
        name: "Tunde Bakare",
        email: "tunde@email.com",
        subject: "Wedding enquiry",
        message: "Please share the requirements for holding a wedding ceremony at the chapel.",
        status: "read",
      }, 2),
      row({
        name: "Sarah Ilesanmi",
        email: "sarah@email.com",
        subject: "Partnership",
        message: "Our NGO would like to partner on the next medical outreach.",
        status: "replied",
      }, 6),
    ],
    subscribers: [
      row({ email: "adaeze@email.com", name: "Adaeze N.", source: "footer", status: "subscribed" }, 4),
      row({ email: "tunde@email.com", name: "Tunde Bakare", source: "footer", status: "subscribed" }, 11),
      row({ email: "sarah@email.com", name: "Sarah Ilesanmi", source: "event", status: "unsubscribed" }, 20),
    ],
    settings: [
      row({
        church_name: site.name,
        founder: site.founder,
        email: site.email,
        phone: site.phone,
        headquarters: site.headquarters,
        branch: site.branch,
        sunday_service: "9:00 AM – 12:00 PM",
        wednesday_service: "4:00 PM – 6:00 PM",
        facebook_url: "",
        instagram_url: "",
        youtube_url: "",
        maintenance_mode: false,
      }),
    ],
  };
}

let cache: DB | null = null;

function read(): DB {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = seed();
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as DB) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}

function write(db: DB) {
  cache = db;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage unavailable */
  }
}

const wait = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const db = {
  async list(collection: CollectionKey): Promise<BaseRecord[]> {
    return wait([...read()[collection]]);
  },
  async create(collection: CollectionKey, values: Record<string, unknown>): Promise<BaseRecord> {
    const database = read();
    const record: BaseRecord = { id: uid(), created_at: new Date().toISOString(), ...values };
    write({ ...database, [collection]: [record, ...database[collection]] });
    return wait(record);
  },
  async update(
    collection: CollectionKey,
    id: string,
    values: Record<string, unknown>,
  ): Promise<BaseRecord> {
    const database = read();
    const next = database[collection].map((r) => (r.id === id ? { ...r, ...values } : r));
    write({ ...database, [collection]: next });
    return wait(next.find((r) => r.id === id) as BaseRecord);
  },
  async remove(collection: CollectionKey, id: string): Promise<{ id: string }> {
    const database = read();
    write({ ...database, [collection]: database[collection].filter((r) => r.id !== id) });
    return wait({ id });
  },
  async reset(): Promise<void> {
    write(seed());
    return wait(undefined);
  },
};
