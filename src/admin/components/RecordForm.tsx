import { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BaseRecord, FieldConfig } from "@/admin/types";

export function buildInitialValues(fields: FieldConfig[], record?: BaseRecord | null) {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    const existing = record?.[field.name];
    values[field.name] =
      existing !== undefined && existing !== null
        ? existing
        : field.type === "switch"
          ? false
          : field.type === "number"
            ? ""
            : "";
  }
  return values;
}

export function RecordForm({
  fields,
  record,
  submitLabel,
  onSubmit,
  onCancel,
  saving,
}: {
  fields: FieldConfig[];
  record?: BaseRecord | null;
  submitLabel: string;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildInitialValues(fields, record),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(buildInitialValues(fields, record));
    setErrors({});
  }, [fields, record]);

  const set = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !String(values[field.name] ?? "").trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.type === "email" &&
        String(values[field.name] ?? "").trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values[field.name]))
      ) {
        nextErrors[field.name] = "Enter a valid email address";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    void onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `field-${field.name}`;
          const error = errors[field.name];
          return (
            <div key={field.name} className={cn("grid gap-2", field.full && "sm:col-span-2")}>
              <Label htmlFor={id}>
                {field.label}
                {field.required ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={id}
                  rows={4}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="rounded-xl"
                />
              ) : field.type === "select" ? (
                <Select
                  value={String(values[field.name] ?? "")}
                  onValueChange={(v) => set(field.name, v)}
                >
                  <SelectTrigger id={id} className="rounded-xl">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "switch" ? (
                <div className="flex h-10 items-center gap-3">
                  <Switch
                    id={id}
                    checked={Boolean(values[field.name])}
                    onCheckedChange={(v) => set(field.name, v)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.help ?? (values[field.name] ? "Enabled" : "Disabled")}
                  </span>
                </div>
              ) : (
                <Input
                  id={id}
                  type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="rounded-xl"
                />
              )}

              {error ? (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              ) : field.help && field.type !== "switch" ? (
                <p className="text-xs text-muted-foreground">{field.help}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-navy text-primary-foreground hover:bg-navy/90"
        >
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
