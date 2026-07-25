import { notFound } from "next/navigation";
import { ArticleRow } from "@/components/site/article-row";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let category;
  let items: any[] = [];
  try {
    category = await prisma.category.findUnique({ where: { slug } });
    if (category) {
      items = await prisma.article.findMany({
        where: { categoryId: category.id, status: "PUBLISHED" },
        include: { author: true, category: true },
        orderBy: { publishedAt: "desc" },
      });
    }
  } catch {
    category = null;
  }

  if (!category) notFound();

  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Category</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">{category.name}</h1>
        <p className="text-muted dark:text-muted-dark mt-3">{items.length} articles</p>
      </header>
      <div className="max-w-4xl">
        {items.length ? (
          items.map((a: any) => (
            <ArticleRow
              key={a.slug}
              article={{
                slug: a.slug,
                title: a.title,
                summary: a.summary,
                category: a.category.name,
                author: a.author.name,
                authorSlug: a.author.slug,
                date: (a.publishedAt ?? a.createdAt).toISOString(),
                readingTime: a.readingTime,
                cover: a.coverImage ?? "",
              }}
            />
          ))
        ) : (
          <p className="text-muted dark:text-muted-dark">No articles published in this category yet.</p>
        )}
      </div>
    </main>
  );
}
