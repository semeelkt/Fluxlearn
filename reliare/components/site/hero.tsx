import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { MockArticle } from "@/lib/mock-data";

export function Hero({
  featured,
  editorsPicks,
  trending,
}: {
  featured: MockArticle;
  editorsPicks: MockArticle[];
  trending: MockArticle[];
}) {
  return (
    <section className="container pt-12 pb-16">
      <div className="grid lg:grid-cols-[1.6fr,1fr] gap-14">
        {/* Featured */}
        <Link href={`/articles/${featured.slug}`} className="group block">
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-hairline/40 mb-6">
            <Image
              src={featured.cover}
              alt=""
              fill
              priority
              className="object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <span className="eyebrow">{featured.category}</span>
          <h1 className="font-display text-[34px] md:text-[46px] leading-[1.1] font-medium mt-3 mb-4 group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
            {featured.title}
          </h1>
          <p className="text-[17px] text-muted dark:text-muted-dark leading-relaxed max-w-xl mb-4">
            {featured.summary}
          </p>
          <div className="flex items-center gap-3 text-xs font-sans text-muted dark:text-muted-dark">
            <span>{featured.author}</span>
            <span>·</span>
            <span>{formatDate(featured.date)}</span>
            <span>·</span>
            <span>{featured.readingTime} min read</span>
          </div>
        </Link>

        {/* Rail */}
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="issue-line pb-3 border-b rule mb-5">Editor&rsquo;s Picks</h2>
            <div className="flex flex-col">
              {editorsPicks.map((a) => (
                <RailItem key={a.slug} article={a} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="issue-line pb-3 border-b rule mb-5">Trending</h2>
            <div className="flex flex-col">
              {trending.map((a) => (
                <RailItem key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RailItem({ article }: { article: MockArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group py-4 border-b rule last:border-none first:pt-0"
    >
      <span className="eyebrow">{article.category}</span>
      <h3 className="font-display text-[17px] leading-snug font-medium mt-1.5 group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
        {article.title}
      </h3>
    </Link>
  );
}
