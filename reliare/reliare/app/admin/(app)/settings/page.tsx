"use client";

import { useEffect, useState } from "react";

type Settings = {
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  seoTitle?: string;
  seoDescription?: string;
  newsletterHeadline?: string;
  newsletterCopy?: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d.settings));
  }, []);

  if (!settings) return <p className="text-sm text-muted dark:text-muted-dark">Loading…</p>;

  const set = (k: keyof Settings, v: string) => setSettings({ ...settings, [k]: v });

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="max-w-2xl">
      <span className="issue-line">Configuration</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Settings</h1>

      <div className="grid gap-6 mb-10">
        <Field label="Website Name"><input value={settings.siteName} onChange={(e) => set("siteName", e.target.value)} className="admin-input" /></Field>
        <Field label="Tagline"><input value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} className="admin-input" /></Field>
        <Field label="Logo URL"><input value={settings.logo ?? ""} onChange={(e) => set("logo", e.target.value)} className="admin-input" /></Field>
        <Field label="Favicon URL"><input value={settings.favicon ?? ""} onChange={(e) => set("favicon", e.target.value)} className="admin-input" /></Field>
        <Field label="Contact Email"><input value={settings.contactEmail ?? ""} onChange={(e) => set("contactEmail", e.target.value)} className="admin-input" /></Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Twitter"><input value={settings.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} className="admin-input" /></Field>
          <Field label="Instagram"><input value={settings.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} className="admin-input" /></Field>
          <Field label="Facebook"><input value={settings.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} className="admin-input" /></Field>
        </div>
        <Field label="SEO Title"><input value={settings.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} className="admin-input" /></Field>
        <Field label="SEO Description"><textarea value={settings.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} rows={2} className="admin-input" /></Field>
        <Field label="Newsletter Headline"><input value={settings.newsletterHeadline ?? ""} onChange={(e) => set("newsletterHeadline", e.target.value)} className="admin-input" /></Field>
        <Field label="Newsletter Copy"><textarea value={settings.newsletterCopy ?? ""} onChange={(e) => set("newsletterCopy", e.target.value)} rows={2} className="admin-input" /></Field>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save Settings"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">{label}</span>
      {children}
    </label>
  );
}
