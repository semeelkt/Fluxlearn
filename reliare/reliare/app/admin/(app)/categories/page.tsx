"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Pencil, Plus } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description?: string;
  order: number;
  hidden: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

const EMPTY = { name: "", description: "", seoTitle: "", seoDescription: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/admin/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  };

  const edit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      seoTitle: c.seoTitle ?? "",
      seoDescription: c.seoDescription ?? "",
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  };

  const toggleHidden = async (c: Category) => {
    await fetch(`/api/admin/categories/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !c.hidden }),
    });
    load();
  };

  const reorder = async (c: Category, direction: -1 | 1) => {
    await fetch(`/api/admin/categories/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: c.order + direction }),
    });
    load();
  };

  return (
    <div>
      <span className="issue-line">Taxonomy</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Categories</h1>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6 mb-4 max-w-3xl">
        <input
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="admin-input"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="admin-input"
        />
        <input
          placeholder="SEO Title"
          value={form.seoTitle}
          onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
          className="admin-input"
        />
        <input
          placeholder="SEO Description"
          value={form.seoDescription}
          onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
          className="admin-input"
        />
        <button
          type="submit"
          className="md:col-span-2 flex items-center justify-center gap-2 px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors w-fit"
        >
          <Plus size={14} /> {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <div className="max-w-3xl mt-10">
        {loading ? (
          <p className="text-sm text-muted dark:text-muted-dark">Loading…</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-4 border-b rule">
              <div>
                <div className={`font-display text-lg ${c.hidden ? "text-muted dark:text-muted-dark" : ""}`}>{c.name}</div>
                {c.description && <div className="text-xs text-muted dark:text-muted-dark mt-1">{c.description}</div>}
              </div>
              <div className="flex items-center gap-3 text-muted dark:text-muted-dark">
                <button onClick={() => reorder(c, -1)} className="hover:text-oxblood transition-colors"><ArrowUp size={15} /></button>
                <button onClick={() => reorder(c, 1)} className="hover:text-oxblood transition-colors"><ArrowDown size={15} /></button>
                <button onClick={() => toggleHidden(c)} className="hover:text-oxblood transition-colors">
                  {c.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => edit(c)} className="hover:text-oxblood transition-colors"><Pencil size={15} /></button>
                <button onClick={() => remove(c.id)} className="hover:text-oxblood transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
