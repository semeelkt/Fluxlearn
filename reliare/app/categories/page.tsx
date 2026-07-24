import Link from "next/link";
import { categories } from "@/lib/mock-data";

export const metadata = { title: "Categories — Reliare" };

export default function CategoriesPage() {
  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Index</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">Categories</h1>
      </header>
      <div className="max-w-3xl">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="group flex items-baseline justify-between py-6 border-b rule"
          >
            <span className="font-display text-[26px] group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
              {c.name}
            </span>
            <span className="text-sm font-sans text-muted dark:text-muted-dark tabular-nums">
              {c.count} Articles
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
