import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none transition-colors";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactForm({ className }: { className?: string }) {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast.success("Message sent", {
        description: "Thank you for reaching out — our team will respond shortly.",
      });
      form.reset();
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={cn("grid gap-5", className)} noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Full name">
          <input id="contact-name" name="name" required className={fieldClass} placeholder="Jane Doe" />
        </Field>
        <Field id="contact-email" label="Email address">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="jane@email.com"
          />
        </Field>
      </div>
      <Field id="contact-subject" label="Subject">
        <input
          id="contact-subject"
          name="subject"
          required
          className={fieldClass}
          placeholder="I'd like to know more about…"
        />
      </Field>
      <Field id="contact-message" label="Message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className={cn(fieldClass, "resize-y")}
          placeholder="Write your message here"
        />
      </Field>
      <Button type="submit" variant="gold" size="lg" disabled={sending} className="justify-self-start">
        {sending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export function PrayerRequestForm({ className }: { className?: string }) {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast.success("Prayer request received", {
        description: "Our intercessors will stand with you in prayer this week.",
      });
      form.reset();
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={cn("grid gap-5", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="prayer-name" label="Full name">
          <input id="prayer-name" name="name" required className={fieldClass} placeholder="Jane Doe" />
        </Field>
        <Field id="prayer-email" label="Email address">
          <input
            id="prayer-email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="jane@email.com"
          />
        </Field>
      </div>
      <Field id="prayer-category" label="Prayer category">
        <select id="prayer-category" name="category" className={fieldClass} defaultValue="general">
          <option value="general">General</option>
          <option value="healing">Healing</option>
          <option value="family">Family</option>
          <option value="career">Career & Provision</option>
          <option value="thanksgiving">Thanksgiving</option>
        </select>
      </Field>
      <Field id="prayer-request" label="Your prayer request">
        <textarea
          id="prayer-request"
          name="request"
          required
          rows={6}
          className={cn(fieldClass, "resize-y")}
          placeholder="Share what you would like us to pray about"
        />
      </Field>
      <div className="flex items-start gap-3">
        <input
          id="prayer-private"
          name="private"
          type="checkbox"
          className="mt-1 size-4 rounded border-border accent-[var(--gold)]"
        />
        <label htmlFor="prayer-private" className="text-sm text-muted-foreground">
          Keep this request confidential to the pastoral team only.
        </label>
      </div>
      <Button type="submit" variant="gold" size="lg" disabled={sending} className="justify-self-start">
        {sending ? "Submitting…" : "Submit prayer request"}
      </Button>
    </form>
  );
}
