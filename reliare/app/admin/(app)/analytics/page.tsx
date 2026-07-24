"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalArticles: number;
  published: number;
  drafts: number;
  totalViews: number;
  topArticles: { id: string; title: string; views: number; category: { name: string } }[];
  categoryCounts: { name: string; count: number }[];
  recentSearches: { id: string; query: string }[];
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setData(d)));
  }, []);

  return (
    <div>
      <span className="issue-line">Insights</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Analytics</h1>

      {error && <p className="text-sm text-oxblood mb-6">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-hairline dark:bg-hairline-dark mb-14">
            <Stat label="Total Views" value={data.totalViews} />
            <Stat label="Published Articles" value={data.published} />
            <Stat label="Drafts" value={data.drafts} />
          </div>

          <div className="grid md:grid-cols-2 gap-14">
            <div>
              <h2 className="issue-line mb-4">Top Articles</h2>
              {data.topArticles.map((a, i) => (
                <div key={a.id} className="flex items-baseline justify-between py-3 border-b rule">
                  <span className="font-display text-base">{i + 1}. {a.title}</span>
                  <span className="text-xs text-muted dark:text-muted-dark tabular-nums">{a.views.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div>
              <h2 className="issue-line mb-4">Top Categories</h2>
              {data.categoryCounts.map((c) => (
                <div key={c.name} className="flex items-baseline justify-between py-3 border-b rule">
                  <span className="font-display text-base">{c.name}</span>
                  <span className="text-xs text-muted dark:text-muted-dark tabular-nums">{c.count} articles</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h2 className="issue-line mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {data.recentSearches.length === 0 && (
                <p className="text-sm text-muted dark:text-muted-dark">No searches logged yet.</p>
              )}
              {data.recentSearches.map((s) => (
                <span key={s.id} className="text-xs font-sans px-3 py-1 border rule text-muted dark:text-muted-dark">
                  {s.query}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper dark:bg-paper-dark p-6">
      <div className="font-display text-[36px] leading-none">{value.toLocaleString()}</div>
      <div className="issue-line mt-2">{label}</div>
    </div>
  );
}
