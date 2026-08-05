import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  HandHeart,
  Images,
  Inbox,
  Mail,
  Megaphone,
  Mic2,
  UsersRound,
} from "lucide-react";
import { AdminShell } from "@/admin/components/AdminShell";
import { StatCard } from "@/admin/components/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/admin/store";
import type { BaseRecord, CollectionKey } from "@/admin/types";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

const quickLinks = [
  { label: "Add a sermon", to: "/admin/sermons", icon: Mic2 },
  { label: "Create an event", to: "/admin/events", icon: CalendarDays },
  { label: "Post an announcement", to: "/admin/announcements", icon: Megaphone },
  { label: "Upload to gallery", to: "/admin/gallery", icon: Images },
];

function DashboardPage() {
  const [data, setData] = useState<Partial<Record<CollectionKey, BaseRecord[]>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const keys: CollectionKey[] = [
      "sermons",
      "events",
      "ministries",
      "prayer_requests",
      "contact_messages",
      "subscribers",
      "gallery",
      "announcements",
      "leaders",
    ];
    void Promise.all(keys.map((k) => db.list(k))).then((results) => {
      if (!active) return;
      const next: Partial<Record<CollectionKey, BaseRecord[]>> = {};
      keys.forEach((k, i) => (next[k] = results[i] ?? []));
      setData(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const count = (key: CollectionKey) => data[key]?.length ?? 0;
  const newPrayers = (data.prayer_requests ?? []).filter((r) => r["status"] === "new").length;
  const unread = (data.contact_messages ?? []).filter((r) => r["status"] === "unread").length;

  const recentPrayers = (data.prayer_requests ?? []).slice(0, 4);
  const upcoming = (data.events ?? []).filter((e) => e["status"] === "upcoming").slice(0, 4);

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of everything happening across the Rock Chapel website.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sermons" value={count("sermons")} icon={Mic2} loading={loading} hint="Published archive" />
        <StatCard
          label="Upcoming events"
          value={(data.events ?? []).filter((e) => e["status"] === "upcoming").length}
          icon={CalendarDays}
          loading={loading}
          hint={`${count("events")} total`}
        />
        <StatCard label="Ministries" value={count("ministries")} icon={UsersRound} loading={loading} hint="Active departments" />
        <StatCard label="Subscribers" value={count("subscribers")} icon={Mail} loading={loading} hint="Newsletter list" />
        <StatCard label="Prayer requests" value={count("prayer_requests")} icon={HandHeart} loading={loading} hint={`${newPrayers} new`} />
        <StatCard label="Messages" value={count("contact_messages")} icon={Inbox} loading={loading} hint={`${unread} unread`} />
        <StatCard label="Gallery photos" value={count("gallery")} icon={Images} loading={loading} hint="Across all albums" />
        <StatCard label="Announcements" value={count("announcements")} icon={Megaphone} loading={loading} hint="Currently listed" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-navy">Latest prayer requests</h2>
            <Link to="/admin/prayer" className="text-xs font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
              : recentPrayers.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{String(r["name"])}</span>
                      <Badge variant="secondary" className="rounded-full capitalize">
                        {String(r["status"])}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {String(r["request"])}
                    </p>
                  </li>
                ))}
          </ul>
        </Card>

        <Card className="rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-navy">Upcoming events</h2>
            <Link to="/admin/events" className="text-xs font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
              : upcoming.map((e) => (
                  <li key={e.id} className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                    <p className="text-sm font-medium text-foreground">{String(e["title"])}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {String(e["date"])} · {String(e["location"])}
                    </p>
                  </li>
                ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl border-border/70 p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-navy">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-soft"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-navy text-primary-foreground">
                <q.icon className="size-4" />
              </span>
              {q.label}
            </Link>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
