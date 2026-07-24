"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { ArticleRow } from "@/components/site/article-row";
import { articles } from "@/lib/mock-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="container py-16">
      <div className="max-w-2xl mb-12">
        <span className="issue-line">Search</span>
        <div className="flex items-center gap-3 border-b-2 border-ink dark:border-ink-dark mt-4 pb-3">
          <SearchIcon size={20} strokeWidth={1.5} className="text-muted dark:text-muted-dark" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, category, author, or tag…"
            className="flex-1 bg-transparent font-display text-2xl italic focus:outline-none placeholder:text-muted/60"
          />
        </div>
      </div>

      <div className="max-w-4xl">
        {query && results.length === 0 && (
          <p className="text-muted dark:text-muted-dark">No results for &ldquo;{query}&rdquo;.</p>
        )}
        {results.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </div>
    </main>
  );
}
