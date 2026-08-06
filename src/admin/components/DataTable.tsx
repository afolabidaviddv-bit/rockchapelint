import type { ReactNode } from "react";
import { MoreHorizontal, Pencil, Trash2, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MediaThumb } from "./MediaUpload";
import { stripHtml } from "./RichTextEditor";
import type { BaseRecord, ColumnConfig } from "@/admin/types";

function formatDate(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value ?? "—")
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function Cell({ column, row }: { column: ColumnConfig; row: BaseRecord }) {
  const value = row[column.name];

  if (column.kind === "image") {
    return <MediaThumb value={value} alt="" className="size-11" />;
  }
  if (column.kind === "html") {
    return (
      <span className="block max-w-70 truncate text-muted-foreground">
        {stripHtml(value) || "—"}
      </span>
    );
  }
  if (column.kind === "boolean") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full border-transparent",
          value ? "bg-gold/15 text-navy" : "bg-muted text-muted-foreground",
        )}
      >
        {value ? "Published" : "Draft"}
      </Badge>
    );
  }
  if (column.kind === "badge") {
    return value ? (
      <Badge variant="secondary" className="rounded-full capitalize">
        {String(value)}
      </Badge>
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }
  if (column.kind === "date") return <span className="text-muted-foreground">{formatDate(value)}</span>;
  if (column.kind === "truncate")
    return <span className="block max-w-70 truncate">{String(value ?? "—")}</span>;

  return <span>{value === undefined || value === "" ? "—" : String(value)}</span>;
}


export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-in fade-in flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </span>
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  loading,
  onEdit,
  onDelete,
  canEdit = true,
  empty,
}: {
  columns: ColumnConfig[];
  rows: BaseRecord[];
  loading?: boolean;
  onEdit: (row: BaseRecord) => void;
  onDelete: (row: BaseRecord) => void;
  canEdit?: boolean;
  empty: ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) return <>{empty}</>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((c) => (
              <TableHead
                key={c.name}
                className={cn(
                  "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                  c.hideOnMobile && "hidden md:table-cell",
                )}
              >
                {c.label}
              </TableHead>
            ))}
            <TableHead className="w-12 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="transition-colors hover:bg-muted/50">
              {columns.map((c) => (
                <TableCell
                  key={c.name}
                  className={cn("py-3.5 text-sm", c.hideOnMobile && "hidden md:table-cell")}
                >
                  <Cell column={c} row={row} />
                </TableCell>
              ))}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Row actions"
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit ? (
                      <DropdownMenuItem onSelect={() => onEdit(row)}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onSelect={() => onDelete(row)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
