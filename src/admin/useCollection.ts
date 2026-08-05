import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "./store";
import type { BaseRecord, CollectionKey } from "./types";

export function useCollection(collection: CollectionKey) {
  const [rows, setRows] = useState<BaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await db.list(collection));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (values: Record<string, unknown>) => {
      try {
        await db.create(collection, values);
        await refresh();
        toast.success("Record created");
      } catch {
        toast.error("Could not create record");
      }
    },
    [collection, refresh],
  );

  const update = useCallback(
    async (id: string, values: Record<string, unknown>) => {
      try {
        await db.update(collection, id, values);
        await refresh();
        toast.success("Changes saved");
      } catch {
        toast.error("Could not save changes");
      }
    },
    [collection, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await db.remove(collection, id);
        await refresh();
        toast.success("Record deleted");
      } catch {
        toast.error("Could not delete record");
      }
    },
    [collection, refresh],
  );

  return { rows, loading, error, refresh, create, update, remove };
}
