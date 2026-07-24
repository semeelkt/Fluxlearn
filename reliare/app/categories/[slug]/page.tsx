import { notFound } from "next/navigation";
import { ArticleRow } from "@/components/site/article-row";
import { articles, categories } from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();
  const items = articles.filter((a) => a.category === category.name);

  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Category</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">{category.name}</h1>
        <p className="text-muted dark:text-muted-dark mt-3">{category.count} articles</p>
      </header>
      <div className="max-w-4xl">
        {items.length ? (
          items.map((a) => <ArticleRow key={a.slug} article={a} />)
        ) : (
          <p className="text-muted dark:text-muted-dark">No articles published in this category yet.</p>
        )}
      </div>
    </main>
  );
}
