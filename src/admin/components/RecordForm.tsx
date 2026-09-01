import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { MediaUpload } from "./MediaUpload";
import { RichTextEditor } from "./RichTextEditor";
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
          : "";
  }
  return values;
}

const isMedia = (t: FieldConfig["type"]) => t === "image" || t === "media";

export function RecordForm({
  fields,
  record,
  submitLabel,
  onSubmit,
  onCancel,
  saving,
  publishable,
  statusField = "published",
}: {
  fields: FieldConfig[];
  record?: BaseRecord | null;
  submitLabel: string;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
  publishable?: boolean;
  statusField?: string;
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

  const editable = useMemo(
    () => fields.filter((f) => !(publishable && f.name === statusField)),
    [fields, publishable, statusField],
  );

  const groups = useMemo(() => {
    const map = new Map<string, FieldConfig[]>();
    for (const field of editable) {
      const key = field.group ?? "";
      map.set(key, [...(map.get(key) ?? []), field]);
    }
    return [...map.entries()];
  }, [editable]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    for (const field of editable) {
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
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (publishState?: boolean) => {
    if (!validate()) return;
    const payload = publishable
      ? { ...values, [statusField]: publishState ?? Boolean(values[statusField]) }
      : values;
    void onSubmit(payload);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(publishable ? true : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {groups.map(([group, groupFields]) => (
        <fieldset key={group || "main"} className="grid gap-4">
          {group ? (
            <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {group}
            </legend>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2">
            {groupFields.map((field) => {
              const id = `field-${field.name}`;
              const error = errors[field.name];
              const wide = field.full || isMedia(field.type) || field.type === "richtext";
              return (
                <div key={field.name} className={cn("grid gap-2", wide && "sm:col-span-2")}>
                  <Label htmlFor={id}>
                    {field.label}
                    {field.required ? <span className="ml-0.5 text-destructive">*</span> : null}
                  </Label>

                  {isMedia(field.type) ? (
                    <MediaUpload
                      value={String(values[field.name] ?? "")}
                      onChange={(v) => set(field.name, v)}
                      folder={field.folder ?? "uploads"}
                      accept={field.accept ?? (field.type === "image" ? "image/*" : "audio/*,video/*")}
                      label={field.label}
                      mediaKey={field.name}
                      mediaKind={field.type === "image" ? "image" : "audio"}
                      {...(field.help ? { help: field.help } : {})}
                    />
                  ) : field.type === "richtext" ? (
                    <RichTextEditor
                      id={id}
                      value={String(values[field.name] ?? "")}
                      onChange={(html) => set(field.name, html)}
                      {...(field.placeholder ? { placeholder: field.placeholder } : {})}
                    />
                  ) : field.type === "textarea" ? (
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
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "email"
                            ? "email"
                            : "text"
                      }
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
                  ) : field.help && field.type !== "switch" && !isMedia(field.type) ? (
                    <p className="text-xs text-muted-foreground">{field.help}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/70 bg-background/95 px-6 pt-4 pb-1 backdrop-blur">
        {onCancel ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        {publishable ? (
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            className="rounded-full"
            onClick={() => submit(false)}
          >
            Save as draft
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-navy text-primary-foreground hover:bg-navy/90"
        >
          {saving ? "Saving…" : publishable ? "Publish" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
