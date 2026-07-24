import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleRow } from "@/components/site/article-row";
import { articles, authors } from "@/lib/mock-data";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = authors.find((a) => a.slug === params.slug);
  if (!author) notFound();
  const items = articles.filter((a) => a.authorSlug === author.slug);

  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-14 flex gap-6 items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 bg-hairline/40">
          <Image src={author.photo} alt={author.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="font-display text-[32px] font-medium">{author.name}</h1>
          <p className="text-muted dark:text-muted-dark mt-2 leading-relaxed max-w-md">{author.bio}</p>
        </div>
      </header>
      <div className="max-w-4xl">
        {items.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </div>
    </main>
  );
}
