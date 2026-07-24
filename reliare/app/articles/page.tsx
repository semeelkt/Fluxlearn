import { ArticleRow } from "@/components/site/article-row";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Articles — Reliare" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  try {
    articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    articles = [];
  }

  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Archive</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">All Articles</h1>
        <p className="text-muted dark:text-muted-dark mt-3 leading-relaxed">
          Theology, history, jurisprudence, and ideas — writing meant to be read slowly.
        </p>
      </header>
      <div className="max-w-4xl">
        {articles.length === 0 ? (
          <p className="text-muted dark:text-muted-dark text-sm">
            Nothing published yet. Write and publish your first article from{" "}
            <a href="/admin/articles/new" className="text-oxblood underline underline-offset-4">
              the admin panel
            </a>
            .
          </p>
        ) : (
          articles.map((a: any) => (
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
        )}
      </div>
    </main>
  );
}
