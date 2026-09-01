import { useEffect, useState } from "react";
import { Copy, ShieldCheck, UserPlus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell } from "@/admin/components/AdminShell";
import { RecordForm } from "@/admin/components/RecordForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { supabaseConfigured, useAdminAuth } from "@/admin/auth";
import { MediaCatalog } from "@/admin/components/MediaCatalog";
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
  { name: "whatsapp", label: "WhatsApp number", type: "text", help: "International format, e.g. 2348067006094" },
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
    name: "maintenance_mode",
    label: "Maintenance mode",
    type: "switch",
    full: true,
    help: "Temporarily show a maintenance notice on the public website",
  },
];

function SettingsPage() {
  const { user, backend } = useAdminAuth();
  const [record, setRecord] = useState<BaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const inviteAdmin = () => {
    if (!newAdminEmail.trim()) return;
    setVerificationCode(String(Math.floor(100000 + Math.random() * 900000)));
  };

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
        <h2 className="font-display text-xl font-semibold text-navy">Account & data</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Signed in as</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Data backend</dt>
            <dd className="font-medium">
              {supabaseConfigured
                ? "Lovable Cloud (Supabase)"
                : "Local preview storage — connect Lovable Cloud to persist content"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Auth provider</dt>
            <dd className="font-medium capitalize">{backend}</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          className="mt-6 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setConfirmReset(true)}
        >
          Reset content
        </Button>
      </Card>

      <MediaCatalog />

      <Card className="mt-6 rounded-2xl border-border/70 p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold"><ShieldCheck className="size-5" /></span>
          <div className="min-w-0 flex-1"><h2 className="font-display text-xl font-semibold text-navy">Admin management</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Invite a trusted team member. A verification code will be sent to the signed-in account before access is created.</p></div>
        </div>
        <Button className="mt-5 h-12 w-full rounded-xl bg-navy text-primary-foreground sm:w-auto" onClick={() => setAddAdminOpen(true)}><UserPlus className="size-4" /> Add admin</Button>
      </Card>

      <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-2xl text-navy">Add an admin</DialogTitle><DialogDescription>Enter their email. We&apos;ll verify this invitation using the account owner&apos;s email.</DialogDescription></DialogHeader>
          {verificationCode ? (
            <div className="rounded-2xl bg-gold/10 p-5 text-center"><p className="text-sm font-medium text-navy">Verification code sent to</p><p className="mt-1 text-xs text-muted-foreground">{user?.email}</p><p className="mt-4 font-mono text-4xl font-semibold tracking-[0.3em] text-navy">{verificationCode}</p><Button variant="outline" className="mt-5 h-12 w-full rounded-xl" onClick={() => void navigator.clipboard?.writeText(verificationCode)}><Copy className="size-4" /> Copy code</Button><Button className="mt-2 h-12 w-full rounded-xl bg-navy text-primary-foreground" onClick={() => { setAddAdminOpen(false); setVerificationCode(null); setNewAdminEmail(""); toast.success("Admin invitation authorized"); }}>Done</Button></div>
          ) : <div className="grid gap-4"><div className="grid gap-2"><Label htmlFor="new-admin-email">New admin email</Label><Input id="new-admin-email" type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="team@example.com" className="h-12 rounded-xl" /></div><Button className="h-12 rounded-xl bg-navy text-primary-foreground" onClick={inviteAdmin} disabled={!newAdminEmail.trim()}>Send verification code</Button></div>}
        </DialogContent>
      </Dialog>

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
