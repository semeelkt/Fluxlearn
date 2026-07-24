import Link from "next/link";

type Category = { name: string; slug: string; count: number };

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <section className="container py-16 border-t rule">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-[28px] italic font-medium">Browse by Category</h2>
        <Link href="/categories" className="text-xs font-sans uppercase tracking-wide text-oxblood hover:underline underline-offset-4">
          View all
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-0">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="group flex items-baseline justify-between py-5 border-b rule"
          >
            <span className="font-display text-[19px] group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
              {c.name}
            </span>
            <span className="text-xs font-sans text-muted dark:text-muted-dark tabular-nums">
              {c.count} Articles
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
