import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { MockArticle } from "@/lib/mock-data";

export function ArticleRow({ article, index }: { article: MockArticle; index?: number }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group grid grid-cols-[auto,1fr] md:grid-cols-[220px,1fr] gap-5 md:gap-8 py-8 border-b rule first:pt-0"
    >
      <div className="relative w-28 h-20 md:w-[220px] md:h-[150px] overflow-hidden bg-hairline/40 shrink-0">
        <Image
          src={article.cover}
          alt=""
          fill
          className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
          sizes="220px"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="eyebrow mb-2">{article.category}</span>
        <h3 className="font-display text-[20px] md:text-[24px] leading-snug font-medium group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
          {article.title}
        </h3>
        <p className="hidden md:block mt-2 text-[15px] text-muted dark:text-muted-dark leading-relaxed max-w-xl">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted dark:text-muted-dark font-sans">
          <span>{article.author}</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
