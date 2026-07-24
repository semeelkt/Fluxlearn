import { ArticleRow } from "@/components/site/article-row";
import { articles } from "@/lib/mock-data";

export const metadata = { title: "Articles — Reliare" };

export default function ArticlesPage() {
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
        {articles.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </div>
    </main>
  );
}
