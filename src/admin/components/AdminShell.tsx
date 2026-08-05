import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Mic2,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  UsersRound,
  HandHeart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/admin/auth";

interface AdminNavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Homepage", to: "/admin/homepage", icon: Sparkles },
  { label: "Leadership", to: "/admin/leadership", icon: Users },
  { label: "Ministries", to: "/admin/ministries", icon: UsersRound },
  { label: "Sermons", to: "/admin/sermons", icon: Mic2 },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Gallery", to: "/admin/gallery", icon: Images },
  { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  { label: "Prayer Requests", to: "/admin/prayer", icon: HandHeart },
  { label: "Messages", to: "/admin/messages", icon: Inbox },
  { label: "Subscribers", to: "/admin/subscribers", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
];

const notifications = [
  { title: "New prayer request", body: "Adaeze N. submitted a healing request.", time: "2h ago" },
  { title: "Unread message", body: "Grace Adebayo asked about volunteering.", time: "5h ago" },
  { title: "Newsletter signup", body: "1 new subscriber this week.", time: "1d ago" },
];

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6" aria-label="Admin sections">
      {adminNav.map((item) => {
        const active = item.exact
          ? pathname === item.to || pathname === `${item.to}/`
          : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-gold/15 text-gold shadow-[inset_2px_0_0_var(--gold)]"
                : "text-primary-foreground/70 hover:bg-primary-foreground/8 hover:text-primary-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <Link to="/admin" className="flex items-center gap-3 px-5 py-6">
      <span className="grid size-10 place-items-center rounded-xl bg-gold font-display text-lg font-semibold text-navy">
        R
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold text-primary-foreground">
          Rock Chapel
        </span>
        <span className="block text-xs tracking-wide text-primary-foreground/60">Admin Portal</span>
      </span>
    </Link>
  );
}

export function AdminShell({
  children,
  search,
  onSearchChange,
}: {
  children: ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, backend } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-dvh bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy lg:flex">
        <SidebarBrand />
        <SidebarLinks />
        <div className="border-t border-primary-foreground/10 px-5 py-4 text-xs text-primary-foreground/50">
          {backend === "supabase" ? "Connected to Cloud" : "Local preview data"}
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-none bg-navy p-0 [&>button]:text-primary-foreground">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <SidebarBrand />
            <SidebarLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={!onSearchChange}
              placeholder={onSearchChange ? "Search records…" : "Search"}
              aria-label="Search records"
              className="h-10 rounded-full border-border bg-muted/60 pl-9 focus-visible:ring-gold/40"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Notifications"
              className="relative grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-gold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.body}</span>
                  <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-full border border-border px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <span className="grid size-7 place-items-center rounded-full bg-navy text-xs font-semibold text-primary-foreground">
                {user?.name?.charAt(0) ?? "A"}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                {user?.name ?? "Admin"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                <Badge variant="secondary" className="mt-1 w-fit">
                  Administrator
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/">View public site</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void handleSignOut()} className="text-destructive">
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
