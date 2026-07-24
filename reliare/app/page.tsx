import { Hero } from "@/components/site/hero";
import { ArticleRow } from "@/components/site/article-row";
import { PopularSidebar } from "@/components/site/popular-sidebar";
import { CategoryList } from "@/components/site/category-list";
import { ResearchCard } from "@/components/site/research-card";
import { Newsletter } from "@/components/site/newsletter";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toMockShape(a: any) {
  return {
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    category: a.category.name,
    author: a.author.name,
    authorSlug: a.author.slug,
    date: (a.publishedAt ?? a.createdAt).toISOString(),
    readingTime: a.readingTime,
    cover: a.coverImage ?? "",
  };
}

export default async function HomePage() {
  let published: any[] = [];
  let categories: any[] = [];
  let researchPapers: any[] = [];

  try {
    [published, categories, researchPapers] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: { author: true, category: true },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.category.findMany({
        where: { hidden: false },
        include: { _count: { select: { articles: true } } },
        orderBy: { order: "asc" },
      }),
      prisma.researchPaper.findMany({ orderBy: { createdAt: "desc" }, take: 2 }),
    ]);
  } catch {
    published = [];
    categories = [];
    researchPapers = [];
  }

  if (published.length === 0) {
    return (
      <main className="container py-24 text-center">
        <span className="issue-line">Reliare</span>
        <h1 className="font-display text-[32px] italic font-medium mt-4 mb-4">Nothing published yet</h1>
        <p className="text-muted dark:text-muted-dark max-w-md mx-auto">
          Once you publish an article from{" "}
          <a href="/admin/articles/new" className="text-oxblood underline underline-offset-4">
            the admin panel
          </a>
          , it will appear here.
        </p>
      </main>
    );
  }

  const featured = published.find((a) => a.featured) ?? published[0];
  const editorsPicks = published.filter((a) => a.editorsPick && a.slug !== featured.slug).slice(0, 3);
  const trending = [...published]
    .filter((a) => a.slug !== featured.slug)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
  const latest = published.filter((a) => a.slug !== featured.slug);
  const popularThisWeek = [...published]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((a) => ({
      title: a.title,
      slug: a.slug,
      date: (a.publishedAt ?? a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: a.views,
    }));

  return (
    <main>
      <Hero
        featured={toMockShape(featured)}
        editorsPicks={editorsPicks.map(toMockShape)}
        trending={trending.map(toMockShape)}
      />

      <section className="container py-4">
        <div className="grid lg:grid-cols-[1fr,340px] gap-16">
          <div>
            <div className="flex items-end justify-between mb-2 pb-4 border-b rule">
              <h2 className="font-display text-[28px] italic font-medium">Latest Articles</h2>
              <a href="/articles" className="text-xs font-sans uppercase tracking-wide text-oxblood hover:underline underline-offset-4">
                View all
              </a>
            </div>
            <div>
              {latest.length === 0 ? (
                <p className="text-sm text-muted dark:text-muted-dark py-6">Only one article published so far.</p>
              ) : (
                latest.map((a) => <ArticleRow key={a.slug} article={toMockShape(a)} />)
              )}
            </div>
          </div>

          <PopularSidebar items={popularThisWeek} />
        </div>
      </section>

      {categories.length > 0 && (
        <CategoryList categories={categories.map((c: any) => ({ name: c.name, slug: c.slug, count: c._count.articles }))} />
      )}

      {researchPapers.length > 0 && (
        <section className="container py-16 border-t rule">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-[28px] italic font-medium">Featured Research</h2>
            <a href="/research" className="text-xs font-sans uppercase tracking-wide text-oxblood hover:underline underline-offset-4">
              View all
            </a>
          </div>
          <div>
            {researchPapers.map((p: any) => (
              <ResearchCard
                key={p.slug}
                paper={{
                  slug: p.slug,
                  title: p.title,
                  abstract: p.abstract,
                  author: p.authorName,
                  journal: p.journal,
                  date: p.publicationDate
                    ? new Date(p.publicationDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : undefined,
                  cover: p.coverImage ?? "",
                }}
              />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </main>
  );
}
