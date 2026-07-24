"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Download } from "lucide-react";

type Paper = {
  id: string;
  title: string;
  abstract: string;
  authorName: string;
  journal?: string;
  doi?: string;
  pdfUrl: string;
  category?: string;
  downloads: number;
};

const EMPTY = { title: "", abstract: "", authorName: "", journal: "", doi: "", pdfUrl: "", category: "" };

export default function AdminResearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/research");
    const data = await res.json();
    setPapers(data.papers ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/research/${editingId}` : "/api/admin/research";
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const edit = (p: Paper) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      abstract: p.abstract,
      authorName: p.authorName,
      journal: p.journal ?? "",
      doi: p.doi ?? "",
      pdfUrl: p.pdfUrl,
      category: p.category ?? "",
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this paper?")) return;
    await fetch(`/api/admin/research/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <span className="issue-line">Publications</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Research Papers</h1>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6 mb-10 max-w-3xl">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input md:col-span-2" />
        <textarea required placeholder="Abstract" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} rows={3} className="admin-input md:col-span-2" />
        <input required placeholder="Author name" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="admin-input" />
        <input placeholder="Journal" value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} className="admin-input" />
        <input placeholder="DOI" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} className="admin-input" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input" />
        <input required placeholder="PDF URL (upload via Media Library first)" value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className="admin-input md:col-span-2" />
        <button type="submit" className="md:col-span-2 flex items-center justify-center gap-2 px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors w-fit">
          <Plus size={14} /> {editingId ? "Update Paper" : "Add Paper"}
        </button>
      </form>

      <div className="max-w-3xl">
        {loading ? (
          <p className="text-sm text-muted dark:text-muted-dark">Loading…</p>
        ) : (
          papers.map((p) => (
            <div key={p.id} className="py-5 border-b rule">
              <div className="flex items-start justify-between">
                <div className="font-display text-lg pr-4">{p.title}</div>
                <div className="flex items-center gap-3 text-muted dark:text-muted-dark shrink-0">
                  <a href={p.pdfUrl} target="_blank" className="hover:text-oxblood transition-colors"><Download size={15} /></a>
                  <button onClick={() => edit(p)} className="hover:text-oxblood transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => remove(p.id)} className="hover:text-oxblood transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="text-xs text-muted dark:text-muted-dark mt-1">{p.authorName} {p.journal ? `· ${p.journal}` : ""} · {p.downloads} downloads</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
