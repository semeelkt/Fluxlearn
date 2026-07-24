import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, addHeadingAnchors } from "@/lib/utils";
import { ReadingProgress } from "@/components/site/reading-progress";
import { ShareButtons } from "@/components/site/share-buttons";
import { TableOfContents } from "@/components/site/table-of-contents";
import { ArticleRow } from "@/components/site/article-row";

// Always fetch fresh — article content changes frequently and previews must reflect drafts immediately.
export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article;
  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: { author: true, category: true },
    });
  } catch {
    article = null;
  }

  if (!article) notFound();

  // Fire-and-forget view increment; don't block rendering on it.
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const { html, toc } = addHeadingAnchors(article.content);

  const [prev, next, related] = await Promise.all([
    prisma.article.findFirst({
      where: { status: "PUBLISHED", createdAt: { lt: article.createdAt } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.article.findFirst({
      where: { status: "PUBLISHED", createdAt: { gt: article.createdAt } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.article.findMany({
      where: { categoryId: article.categoryId, status: "PUBLISHED", slug: { not: article.slug } },
      include: { author: true, category: true },
      take: 3,
    }),
  ]);

  return (
    <main>
      <ReadingProgress />

      <article className="container pt-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="eyebrow">{article.category.name}</span>
          <h1 className="font-display text-[36px] md:text-[48px] leading-[1.1] font-medium mt-4 mb-6">
            {article.title}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark leading-relaxed mb-6">{article.summary}</p>
          <div className="flex items-center justify-center gap-3 text-sm font-sans text-muted dark:text-muted-dark">
            <span>By {article.author.name}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt ?? article.createdAt)}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            {article.status !== "PUBLISHED" && (
              <>
                <span>·</span>
                <span className="text-oxblood uppercase tracking-wide text-xs">{article.status}</span>
              </>
            )}
          </div>
        </div>

        {article.coverImage && (
          <div className="relative w-full max-w-5xl mx-auto aspect-[16/8] overflow-hidden bg-hairline/40 mb-16">
            <Image src={article.coverImage} alt="" fill priority className="object-cover" />
          </div>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[180px,1fr,180px] gap-10">
          <div className="hidden lg:block">
            <TableOfContents items={toc} />
          </div>

          <div className="max-w-prose mx-auto w-full">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

            {article.references.length > 0 && (
              <div className="mt-10 pt-8 border-t rule">
                <span className="issue-line block mb-4">References</span>
                <ul className="flex flex-col gap-2 font-sans text-sm text-muted dark:text-muted-dark italic">
                  {article.references.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t rule flex flex-wrap gap-2">
                {article.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs font-sans uppercase tracking-wide px-3 py-1 border rule text-muted dark:text-muted-dark"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex flex-col gap-6 sticky top-28 h-fit">
            <span className="issue-line">Share</span>
            <ShareButtons title={article.title} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6 mt-20 pt-8 border-t rule">
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="group flex flex-col">
              <span className="flex items-center gap-1 text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark mb-2">
                <ArrowLeft size={12} /> Previous
              </span>
              <span className="font-display text-lg group-hover:text-oxblood transition-colors">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/articles/${next.slug}`} className="group flex flex-col text-right ml-auto">
              <span className="flex items-center justify-end gap-1 text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark mb-2">
                Next <ArrowRight size={12} />
              </span>
              <span className="font-display text-lg group-hover:text-oxblood transition-colors">{next.title}</span>
            </Link>
          ) : <div />}
        </div>

        {related.length > 0 && (
          <div className="max-w-4xl mx-auto mt-20 pt-10 border-t rule pb-20">
            <h2 className="font-display text-[26px] italic font-medium mb-6">Related Articles</h2>
            {related.map((a: any) => (
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
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
