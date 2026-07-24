"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./tiptap-editor";

type Option = { id: string; name: string };

type ArticleFormValue = {
  id?: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  editorsPick: boolean;
  tags: string;
  readingTime: number;
  authorId: string;
  categoryId: string;
  references: string;
};

const EMPTY: ArticleFormValue = {
  title: "",
  summary: "",
  content: "",
  coverImage: "",
  status: "DRAFT",
  featured: false,
  editorsPick: false,
  tags: "",
  readingTime: 5,
  authorId: "",
  categoryId: "",
  references: "",
};

export function ArticleForm({ initial }: { initial?: Partial<ArticleFormValue> }) {
  const router = useRouter();
  const [value, setValue] = useState<ArticleFormValue>({ ...EMPTY, ...initial });
  const [authors, setAuthors] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/authors").then((r) => r.json()).then((d) => setAuthors(d.authors ?? []));
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? []));
  }, []);

  const set = <K extends keyof ArticleFormValue>(key: K, val: ArticleFormValue[K]) =>
    setValue((v) => ({ ...v, [key]: val }));

  const save = async (statusOverride?: ArticleFormValue["status"]) => {
    setSaving(true);
    setError("");
    const payload = {
      ...value,
      status: statusOverride ?? value.status,
      tags: value.tags.split(",").map((t) => t.trim()).filter(Boolean),
      references: value.references.split("\n").map((r) => r.trim()).filter(Boolean),
      readingTime: Number(value.readingTime),
    };

    const url = value.id ? `/api/admin/articles/${value.id}` : "/api/admin/articles";
    const method = value.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Failed to save article.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Field label="Title">
          <input
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
            className="admin-input"
            placeholder="Article title"
          />
        </Field>
        <Field label="Cover Image URL">
          <input
            value={value.coverImage}
            onChange={(e) => set("coverImage", e.target.value)}
            className="admin-input"
            placeholder="https://…"
          />
        </Field>
      </div>

      <Field label="Summary" className="mb-8">
        <textarea
          value={value.summary}
          onChange={(e) => set("summary", e.target.value)}
          rows={3}
          className="admin-input"
          placeholder="One or two sentences shown in article listings"
        />
      </Field>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Field label="Author">
          <select value={value.authorId} onChange={(e) => set("authorId", e.target.value)} className="admin-input">
            <option value="">Select author…</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select value={value.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="admin-input">
            <option value="">Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Reading Time (min)">
          <input
            type="number"
            min={1}
            value={value.readingTime}
            onChange={(e) => set("readingTime", Number(e.target.value))}
            className="admin-input"
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Field label="Tags (comma separated)">
          <input
            value={value.tags}
            onChange={(e) => set("tags", e.target.value)}
            className="admin-input"
            placeholder="Theology, History"
          />
        </Field>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 text-sm font-sans">
            <input type="checkbox" checked={value.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-sans">
            <input type="checkbox" checked={value.editorsPick} onChange={(e) => set("editorsPick", e.target.checked)} />
            Editor&rsquo;s Pick
          </label>
        </div>
      </div>

      <Field label="Content" className="mb-8">
        <TiptapEditor content={value.content} onChange={(html) => set("content", html)} />
      </Field>

      <Field label="References (one per line)" className="mb-10">
        <textarea
          value={value.references}
          onChange={(e) => set("references", e.target.value)}
          rows={4}
          className="admin-input"
        />
      </Field>

      {error && <p className="text-sm text-oxblood mb-4">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          disabled={saving}
          onClick={() => save("DRAFT")}
          className="px-5 py-2.5 border rule text-xs uppercase tracking-wide font-sans hover:border-oxblood hover:text-oxblood transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          disabled={saving}
          onClick={() => save("PUBLISHED")}
          className="px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">{label}</span>
      {children}
    </label>
  );
}
