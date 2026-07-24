"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Copy, Archive, Eye, Trash2, CheckCircle2 } from "lucide-react";

type Article = {
  id: string;
  title: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  views: number;
  createdAt: string;
  author: { name: string };
  category: { name: string };
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "text-muted dark:text-muted-dark",
  SCHEDULED: "text-oxblood",
  PUBLISHED: "text-oxblood",
  ARCHIVED: "text-muted dark:text-muted-dark line-through",
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    if (res.ok) setArticles(data.articles ?? []);
    else setError(data.error ?? "Failed to load articles.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (id: string, action: string) => {
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this article permanently?")) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="issue-line">Content</span>
          <h1 className="font-display text-3xl font-medium mt-2">Articles</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors"
        >
          <Plus size={14} /> New Article
        </Link>
      </div>

      {error && (
        <p className="text-sm text-oxblood mb-6">
          {error} — check that <code>DATABASE_URL</code> is set and MongoDB is reachable.
        </p>
      )}

      {loading ? (
        <p className="text-muted dark:text-muted-dark text-sm">Loading…</p>
      ) : articles.length === 0 ? (
        <p className="text-muted dark:text-muted-dark text-sm">No articles yet. Create your first one.</p>
      ) : (
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b rule text-left text-xs uppercase tracking-wide text-muted dark:text-muted-dark">
              <th className="py-3 font-normal">Title</th>
              <th className="py-3 font-normal">Author</th>
              <th className="py-3 font-normal">Category</th>
              <th className="py-3 font-normal">Status</th>
              <th className="py-3 font-normal">Views</th>
              <th className="py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b rule">
                <td className="py-4 pr-4">
                  <Link href={`/admin/articles/${a.id}`} className="font-display text-base hover:text-oxblood transition-colors">
                    {a.title}
                  </Link>
                </td>
                <td className="py-4 text-muted dark:text-muted-dark">{a.author?.name}</td>
                <td className="py-4 text-muted dark:text-muted-dark">{a.category?.name}</td>
                <td className={`py-4 ${STATUS_STYLES[a.status]}`}>{a.status}</td>
                <td className="py-4 tabular-nums text-muted dark:text-muted-dark">{a.views.toLocaleString()}</td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-3 text-muted dark:text-muted-dark">
                    {a.status !== "PUBLISHED" && (
                      <button title="Publish" onClick={() => action(a.id, "publish")} className="hover:text-oxblood transition-colors">
                        <CheckCircle2 size={15} />
                      </button>
                    )}
                    <button title="Duplicate" onClick={() => action(a.id, "duplicate")} className="hover:text-oxblood transition-colors">
                      <Copy size={15} />
                    </button>
                    <button title="Archive" onClick={() => action(a.id, "archive")} className="hover:text-oxblood transition-colors">
                      <Archive size={15} />
                    </button>
                    <Link title="Preview" href={`/articles/${a.id}`} target="_blank" className="hover:text-oxblood transition-colors">
                      <Eye size={15} />
                    </Link>
                    <button title="Delete" onClick={() => remove(a.id)} className="hover:text-oxblood transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
