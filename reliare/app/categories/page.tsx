import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Categories — Reliare" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { hidden: false },
      include: { _count: { select: { articles: { where: { status: "PUBLISHED" } } } } },
      orderBy: { order: "asc" },
    });
  } catch {
    categories = [];
  }

  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Index</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">Categories</h1>
      </header>

      {categories.length === 0 ? (
        <p className="text-sm text-muted dark:text-muted-dark">
          No categories yet. Add one from{" "}
          <a href="/admin/categories" className="text-oxblood underline underline-offset-4">
            the admin panel
          </a>
          .
        </p>
      ) : (
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
                {c._count.articles} Articles
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
