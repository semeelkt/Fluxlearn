import { Hero } from "@/components/site/hero";
import { ArticleRow } from "@/components/site/article-row";
import { PopularSidebar } from "@/components/site/popular-sidebar";
import { CategoryList } from "@/components/site/category-list";
import { ResearchCard } from "@/components/site/research-card";
import { Newsletter } from "@/components/site/newsletter";
import { articles, popularThisWeek, categories, researchPapers } from "@/lib/mock-data";

export default function HomePage() {
  const featured = articles[0];
  const editorsPicks = articles.filter((a) => a.editorsPick).slice(0, 3);
  const trending = articles.filter((a) => a.trending).slice(0, 3);
  const latest = articles.slice(1);

  return (
    <main>
      <Hero featured={featured} editorsPicks={editorsPicks} trending={trending} />

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
              {latest.map((a) => (
                <ArticleRow key={a.slug} article={a} />
              ))}
            </div>
          </div>

          <PopularSidebar items={popularThisWeek} />
        </div>
      </section>

      <CategoryList categories={categories} />

      <section className="container py-16 border-t rule">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-[28px] italic font-medium">Featured Research</h2>
          <a href="/research" className="text-xs font-sans uppercase tracking-wide text-oxblood hover:underline underline-offset-4">
            View all
          </a>
        </div>
        <div>
          {researchPapers.map((p) => (
            <ResearchCard key={p.slug} paper={p} />
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
