import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import { AdminShell } from "./AdminShell";
import { DataTable, EmptyState } from "./DataTable";
import { RecordForm } from "./RecordForm";
import { useCollection } from "@/admin/useCollection";
import type { BaseRecord, ResourceConfig } from "@/admin/types";

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const { rows, loading, error, create, update, remove } = useCollection(config.collection);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BaseRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BaseRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const canCreate = config.canCreate !== false;
  const canEdit = config.canEdit !== false;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      config.searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, search, config.searchKeys]);

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

  return (
    <AdminShell search={search} onSearchChange={setSearch}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        {canCreate ? (
          <Button
            onClick={() => setCreating(true)}
            className="rounded-full bg-gold text-navy shadow-soft transition-all hover:-translate-y-0.5 hover:bg-gold hover:shadow-gold"
          >
            <Plus className="size-4" /> New {config.singular.toLowerCase()}
          </Button>
        ) : null}
      </div>

      <Card className="mt-6 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
        {error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : (
          <DataTable
            columns={config.columns}
            rows={filtered}
            loading={loading}
            canEdit={canEdit}
            onEdit={setEditing}
            onDelete={setPendingDelete}
            empty={
              search ? (
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
              )
            }
          />
        )}
      </Card>

      <Dialog open={creating || Boolean(editing)} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-navy">
              {editing ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <RecordForm
            fields={config.fields}
            record={editing}
            saving={saving}
            submitLabel={editing ? "Save changes" : `Create ${config.singular.toLowerCase()}`}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record and any content it powers on the public website.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
