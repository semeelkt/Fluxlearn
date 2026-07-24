import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { articles } from "@/lib/mock-data";
import { sampleArticleBody, footnotes, references, tocItems } from "@/lib/article-content";
import { formatDate } from "@/lib/utils";
import { ReadingProgress } from "@/components/site/reading-progress";
import { ShareButtons } from "@/components/site/share-buttons";
import { TableOfContents } from "@/components/site/table-of-contents";
import { ArticleRow } from "@/components/site/article-row";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const index = articles.findIndex((a) => a.slug === params.slug);
  const article = articles[index];
  if (!article) notFound();

  const prev = articles[index - 1];
  const next = articles[index + 1];
  const related = articles.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  return (
    <main>
      <ReadingProgress />

      <article className="container pt-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="eyebrow">{article.category}</span>
          <h1 className="font-display text-[36px] md:text-[48px] leading-[1.1] font-medium mt-4 mb-6">
            {article.title}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark leading-relaxed mb-6">{article.summary}</p>
          <div className="flex items-center justify-center gap-3 text-sm font-sans text-muted dark:text-muted-dark">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
          </div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[16/8] overflow-hidden bg-hairline/40 mb-16">
          <Image src={article.cover} alt="" fill priority className="object-cover" />
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[180px,1fr,180px] gap-10">
          <div className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </div>

          <div className="max-w-prose mx-auto w-full">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: sampleArticleBody }} />

            {/* Footnotes */}
            <div className="mt-16 pt-8 border-t rule">
              <span className="issue-line block mb-4">Footnotes</span>
              <ol className="flex flex-col gap-3 font-sans text-sm text-muted dark:text-muted-dark">
                {footnotes.map((f) => (
                  <li key={f.id} id={`fn-${f.id}`}>
                    <span className="text-oxblood mr-2">{f.id}.</span>
                    {f.text}
                  </li>
                ))}
              </ol>
            </div>

            {/* References */}
            <div className="mt-10 pt-8 border-t rule">
              <span className="issue-line block mb-4">References</span>
              <ul className="flex flex-col gap-2 font-sans text-sm text-muted dark:text-muted-dark italic">
                {references.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-10 pt-8 border-t rule flex flex-wrap gap-2">
              {[article.category, "Theology", "Epistemology"].map((t) => (
                <span
                  key={t}
                  className="text-xs font-sans uppercase tracking-wide px-3 py-1 border rule text-muted dark:text-muted-dark"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-6 sticky top-28 h-fit">
            <span className="issue-line">Share</span>
            <ShareButtons title={article.title} />
          </div>
        </div>

        {/* Prev / Next */}
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

        {/* Related */}
        {related.length > 0 && (
          <div className="max-w-4xl mx-auto mt-20 pt-10 border-t rule pb-20">
            <h2 className="font-display text-[26px] italic font-medium mb-6">Related Articles</h2>
            {related.map((a) => (
              <ArticleRow key={a.slug} article={a} />
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
