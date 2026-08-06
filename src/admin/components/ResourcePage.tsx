import { useMemo, useState } from "react";
import { LayoutGrid, Plus, Rows3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminShell } from "./AdminShell";
import { DataTable, EmptyState } from "./DataTable";
import { RecordCards } from "./RecordCards";
import { RecordForm } from "./RecordForm";
import { useCollection } from "@/admin/useCollection";
import { cn } from "@/lib/utils";
import type { BaseRecord, ResourceConfig } from "@/admin/types";

type Filter = "all" | "published" | "draft";

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const { rows, loading, error, create, update, remove } = useCollection(config.collection);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BaseRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BaseRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"table" | "cards">(config.defaultView ?? "table");

  const canCreate = config.canCreate !== false;
  const canEdit = config.canEdit !== false;
  const statusField = config.statusField ?? "published";
  const cardsAvailable = Boolean(config.card);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (config.publishable && filter !== "all") {
        const published = Boolean(row[statusField]);
        if (filter === "published" && !published) return false;
        if (filter === "draft" && published) return false;
      }
      if (!q) return true;
      return config.searchKeys.some((key) =>
        String(row[key] ?? "").toLowerCase().includes(q),
      );
    });
  }, [rows, search, filter, config.searchKeys, config.publishable, statusField]);

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSaving(true);
    if (editing) await update(editing.id, values);
    else await create(values);
    setSaving(false);
    closeForm();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await remove(pendingDelete.id);
    setPendingDelete(null);
  };

  const emptyNode = search ? (
    <EmptyState
      title="No matches found"
      body={`Nothing matched “${search}”. Try a different search term.`}
    />
  ) : (
    <EmptyState
      title={config.emptyTitle ?? `No ${config.title.toLowerCase()} yet`}
      body={
        config.emptyBody ??
        `Create your first ${config.singular.toLowerCase()} to see it here and on the public website.`
      }
      action={
        canCreate ? (
          <Button
            onClick={() => setCreating(true)}
            className="mt-2 rounded-full bg-navy text-primary-foreground hover:bg-navy/90"
          >
            <Plus className="size-4" /> New {config.singular.toLowerCase()}
          </Button>
        ) : undefined
      }
    />
  );

  const counts = {
    all: rows.length,
    published: rows.filter((r) => Boolean(r[statusField])).length,
    draft: rows.filter((r) => !r[statusField]).length,
  };

  return (
    <AdminShell search={search} onSearchChange={setSearch}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
            {config.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        {canCreate ? (
          <Button
            onClick={() => setCreating(true)}
            className="hidden shrink-0 rounded-full bg-gold text-navy shadow-soft transition-all hover:-translate-y-0.5 hover:bg-gold hover:shadow-gold sm:inline-flex"
          >
            <Plus className="size-4" /> New {config.singular.toLowerCase()}
          </Button>
        ) : null}
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {config.publishable ? (
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="rounded-full bg-muted/70 p-1">
              <TabsTrigger value="all" className="rounded-full px-4">
                All · {counts.all}
              </TabsTrigger>
              <TabsTrigger value="published" className="rounded-full px-4">
                Published · {counts.published}
              </TabsTrigger>
              <TabsTrigger value="draft" className="rounded-full px-4">
                Drafts · {counts.draft}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? config.singular.toLowerCase() : "records"}
          </span>
        )}

        {cardsAvailable ? (
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background p-1">
            {(
              [
                { key: "cards", icon: LayoutGrid, label: "Card view" },
                { key: "table", icon: Rows3, label: "List view" },
              ] as const
            ).map((v) => (
              <button
                key={v.key}
                type="button"
                aria-label={v.label}
                aria-pressed={view === v.key}
                onClick={() => setView(v.key)}
                className={cn(
                  "grid size-8 place-items-center rounded-full transition-colors",
                  view === v.key
                    ? "bg-navy text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <v.icon className="size-4" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Card className="mt-4 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
        {error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : cardsAvailable && view === "cards" && config.card ? (
          <RecordCards
            rows={filtered}
            card={config.card}
            loading={loading}
            canEdit={canEdit}
            onEdit={setEditing}
            onDelete={setPendingDelete}
            empty={emptyNode}
          />
        ) : (
          <DataTable
            columns={config.columns}
            rows={filtered}
            loading={loading}
            canEdit={canEdit}
            onEdit={setEditing}
            onDelete={setPendingDelete}
            empty={emptyNode}
          />
        )}
      </Card>

      {canCreate ? (
        <Button
          onClick={() => setCreating(true)}
          aria-label={`New ${config.singular.toLowerCase()}`}
          className="fixed right-5 bottom-5 z-40 size-14 rounded-full bg-gold text-navy shadow-gold transition-transform hover:scale-105 hover:bg-gold sm:hidden"
        >
          <Plus className="size-6" />
        </Button>
      ) : null}

      <Dialog open={creating || Boolean(editing)} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-navy">
              {editing
                ? `Edit ${config.singular.toLowerCase()}`
                : `New ${config.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <RecordForm
            fields={config.fields}
            record={editing}
            saving={saving}
            {...(config.publishable ? { publishable: true } : {})}
            statusField={statusField}
            submitLabel={editing ? "Save changes" : `Create ${config.singular.toLowerCase()}`}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record and any content it powers on the public website.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
