import { useEffect, useRef } from "react";
import { Bold, Italic, Link2, List, ListOrdered, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "underline", icon: Underline, label: "Underline" },
  { cmd: "insertUnorderedList", icon: List, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
] as const;

/** Lightweight rich text editor — friendly toolbar, stores simple HTML. */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  const run = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-gold/40">
      <div className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/40 px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.cmd}
            type="button"
            aria-label={t.label}
            title={t.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(t.cmd)}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-navy"
          >
            <t.icon className="size-4" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Add link"
          title="Add link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt("Link address (https://…)");
            if (url) run("createLink", url);
          }}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-navy"
        >
          <Link2 className="size-4" />
        </button>
      </div>
      <div
        id={id}
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder ?? "Rich text"}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder ?? "Start writing…"}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className={cn(
          "prose-admin min-h-36 px-3.5 py-3 text-sm leading-relaxed outline-none",
          "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  );
}

export function RichText({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("prose-admin text-sm text-muted-foreground", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Plain-text preview of rich content, for cards and tables. */
export const stripHtml = (html: unknown) =>
  String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
