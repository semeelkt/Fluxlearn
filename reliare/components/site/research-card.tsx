import Link from "next/link";
import Image from "next/image";
import { Download, ArrowRight } from "lucide-react";

type Research = {
  slug: string;
  title: string;
  abstract: string;
  author: string;
  journal?: string;
  date?: string;
  cover: string;
};

export function ResearchCard({ paper }: { paper: Research }) {
  return (
    <article className="grid md:grid-cols-[180px,1fr] gap-6 py-8 border-b rule first:pt-0">
      <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-hairline/40">
        {paper.cover && <Image src={paper.cover} alt="" fill className="object-cover" sizes="180px" />}
      </div>
      <div className="flex flex-col">
        <span className="eyebrow mb-2">{paper.journal ?? "Research"}</span>
        <h3 className="font-display text-[21px] font-medium leading-snug mb-3">{paper.title}</h3>
        <p className="text-[15px] text-muted dark:text-muted-dark leading-relaxed mb-4">{paper.abstract}</p>
        <div className="mt-auto flex items-center justify-between text-xs font-sans text-muted dark:text-muted-dark">
          <span>{paper.author} {paper.date ? `· ${paper.date}` : ""}</span>
          <div className="flex items-center gap-5">
            <a href="#" className="flex items-center gap-1.5 hover:text-oxblood transition-colors">
              <Download size={14} strokeWidth={1.5} /> PDF
            </a>
            <Link href={`/research/${paper.slug}`} className="flex items-center gap-1.5 hover:text-oxblood transition-colors">
              Read More <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
