"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Pencil, Plus } from "lucide-react";

type Author = { id: string; name: string; photo?: string; bio?: string; twitter?: string; website?: string };
const EMPTY = { name: "", photo: "", bio: "", twitter: "", website: "" };

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/authors");
    const data = await res.json();
    setAuthors(data.authors ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/authors/${editingId}` : "/api/admin/authors";
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const edit = (a: Author) => {
    setEditingId(a.id);
    setForm({ name: a.name, photo: a.photo ?? "", bio: a.bio ?? "", twitter: a.twitter ?? "", website: a.website ?? "" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this author?")) return;
    await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <span className="issue-line">Contributors</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Authors</h1>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6 mb-10 max-w-3xl">
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
        <input placeholder="Photo URL" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" />
        <textarea placeholder="Biography" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="admin-input md:col-span-2" />
        <input placeholder="Twitter handle" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="admin-input" />
        <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="admin-input" />
        <button type="submit" className="md:col-span-2 flex items-center justify-center gap-2 px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors w-fit">
          <Plus size={14} /> {editingId ? "Update Author" : "Add Author"}
        </button>
      </form>

      <div className="max-w-3xl grid sm:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-sm text-muted dark:text-muted-dark">Loading…</p>
        ) : (
          authors.map((a) => (
            <div key={a.id} className="flex gap-4 py-4 border-b rule">
              {a.photo && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-hairline/40">
                  <Image src={a.photo} alt={a.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-display text-base">{a.name}</div>
                <div className="text-xs text-muted dark:text-muted-dark mt-1 line-clamp-2">{a.bio}</div>
              </div>
              <div className="flex items-start gap-3 text-muted dark:text-muted-dark">
                <button onClick={() => edit(a)} className="hover:text-oxblood transition-colors"><Pencil size={14} /></button>
                <button onClick={() => remove(a.id)} className="hover:text-oxblood transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
