"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { ArticleRow } from "@/components/site/article-row";

type Result = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  authorSlug: string;
  date: string;
  readingTime: number;
  cover: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results ?? []);
          setSearched(true);
        })
        .finally(() => setLoading(false));
    }, 300); // debounce so we don't hit the DB on every keystroke

    return () => clearTimeout(timeout);
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
        {loading && <p className="text-muted dark:text-muted-dark text-sm">Searching…</p>}
        {!loading && searched && results.length === 0 && (
          <p className="text-muted dark:text-muted-dark">No results for &ldquo;{query}&rdquo;.</p>
        )}
        {results.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </div>
    </main>
  );
}
