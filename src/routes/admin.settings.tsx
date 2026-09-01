import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell } from "@/admin/components/AdminShell";
import { RecordForm } from "@/admin/components/RecordForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
import { db } from "@/admin/store";
import { useAdminAuth } from "@/admin/auth";
import type { BaseRecord, FieldConfig } from "@/admin/types";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const settingsFields: FieldConfig[] = [
  { name: "church_name", label: "Church name", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "founder", label: "Founder", type: "text" },
  { name: "email", label: "Contact email", type: "email" },
  { name: "phone", label: "Phone number", type: "text" },
  { name: "phone_alt", label: "Second phone number", type: "text" },
  {
    name: "whatsapp",
    label: "WhatsApp number",
    type: "text",
    help: "International format, e.g. 2348067006094",
  },
  { name: "address", label: "Church address", type: "textarea", full: true },
  { name: "sunday_service", label: "Sunday service", type: "text" },
  { name: "wednesday_service", label: "Wednesday service", type: "text" },
  { name: "bank_name", label: "Bank", type: "text" },
  { name: "bank_account_name", label: "Account name", type: "text" },
  { name: "bank_account_number", label: "Account number", type: "text" },
  { name: "youtube_url", label: "YouTube URL", type: "url" },
  { name: "tiktok_url", label: "TikTok URL", type: "url" },
  { name: "instagram_url", label: "Instagram URL", type: "url" },
  { name: "x_url", label: "X (Twitter) URL", type: "url" },
  {
    name: "header_logo_url",
    label: "Header logo",
    type: "image",
    folder: "branding",
    group: "Site imagery",
  },
  {
    name: "footer_logo_url",
    label: "Footer logo",
    type: "image",
    folder: "branding",
    group: "Site imagery",
  },
  {
    name: "hero_image_url",
    label: "Homepage hero image",
    type: "image",
    folder: "homepage",
    group: "Site imagery",
  },
  {
    name: "about_image_url",
    label: "About page image",
    type: "image",
    folder: "about",
    group: "Site imagery",
  },
  {
    name: "directions_image_url",
    label: "Directions image",
    type: "image",
    folder: "directions",
    group: "Site imagery",
  },
  {
    name: "maintenance_mode",
    label: "Maintenance mode",
    type: "switch",
    full: true,
    help: "Temporarily show a maintenance notice on the public website",
  },
];

function SettingsPage() {
  const { user } = useAdminAuth();
  const [record, setRecord] = useState<BaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const rows = await db.list("settings");
    setRecord(rows[0] ?? null);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (values: Record<string, unknown>) => {
    setSaving(true);
    if (record) await db.update("settings", record.id, values);
    else await db.create("settings", values);
    await load();
    setSaving(false);
    toast.success("Settings saved");
  };

  const onAddAdmin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setEnteredCode("");
    setAdminMessage(null);
    setVerificationOpen(true);
    toast.success("Mock verification code generated");
  };

  const verifyAdmin = () => {
    if (enteredCode !== verificationCode) {
      setAdminMessage("That code is incorrect. Please check the email and try again.");
      return;
    }
    setVerificationOpen(false);
    setAdminMessage(`${newAdminEmail} is authorized to be added as an administrator.`);
    toast.success("Admin verified");
  };

  const onReset = async () => {
    await db.reset();
    await load();
    setConfirmReset(false);
    toast.success("Content reset to defaults");
  };

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Church details, service times and social links used across the public website.
        </p>
      </div>

      <Card className="mt-6 rounded-2xl border-border/70 p-6 shadow-soft">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <RecordForm
            fields={settingsFields}
            record={record}
            saving={saving}
            submitLabel="Save settings"
            onSubmit={onSubmit}
          />
        )}
      </Card>

      <Card className="mt-6 rounded-2xl border-border/70 p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-navy">Admin management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only the primary administrator can authorize a new admin.
        </p>
        <form onSubmit={onAddAdmin} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="new-admin-name">Admin name</Label>
            <Input
              id="new-admin-name"
              value={newAdminName}
              onChange={(event) => setNewAdminName(event.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-admin-email">Admin email</Label>
            <Input
              id="new-admin-email"
              type="email"
              value={newAdminEmail}
              onChange={(event) => setNewAdminEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="rounded-full bg-navy text-primary-foreground hover:bg-navy/90"
            >
              Add admin
            </Button>
            <p className="text-xs text-muted-foreground">
              A 6-digit code is sent to {adminAccountEmail}.
            </p>
          </div>
        </form>
        {adminMessage ? (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm" role="status">
            {adminMessage}
          </p>
        ) : null}
      </Card>

      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Verify new administrator</DialogTitle>
            <DialogDescription>
              Enter the mock 6-digit code shown below to authorize {newAdminName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-xl bg-muted px-4 py-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Mock OTP code</p>
              <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.35em] text-navy">{verificationCode}</p>
            </div>
            <Label htmlFor="verification-code">Verification code</Label>
            <Input
              id="verification-code"
              inputMode="numeric"
              maxLength={6}
              value={enteredCode}
              onChange={(event) =>
                setEnteredCode(event.target.value.replace(/\\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              autoFocus
            />
            {adminMessage ? (
              <p className="text-sm text-destructive" role="alert">
                {adminMessage}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="rounded-full bg-navy text-primary-foreground hover:bg-navy/90"
              onClick={verifyAdmin}
              disabled={enteredCode.length !== 6}
            >
              Verify and add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mt-6 rounded-2xl border-border/70 p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-navy">Account & data</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Session</dt>
            <dd className="font-medium">{user ? "Administrator verified" : "Signed out"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Data storage</dt>
            <dd className="font-medium">Local browser state</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          className="mt-6 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setConfirmReset(true)}
        >
          Reset demo content
        </Button>
      </Card>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all content?</AlertDialogTitle>
            <AlertDialogDescription>
              Every module returns to its default seed content. Any records you created will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void onReset()}
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            >
              Reset content
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
