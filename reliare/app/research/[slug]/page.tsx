import Image from "next/image";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let paper;
  try {
    paper = await prisma.researchPaper.findUnique({ where: { slug } });
  } catch {
    paper = null;
  }
  if (!paper) notFound();

  return (
    <main className="container py-16">
      <div className="max-w-3xl mx-auto">
        <span className="eyebrow">{paper.journal ?? "Research"}</span>
        <h1 className="font-display text-[34px] md:text-[42px] leading-[1.15] font-medium mt-3 mb-6">
          {paper.title}
        </h1>
        <div className="flex items-center gap-3 text-sm font-sans text-muted dark:text-muted-dark mb-10">
          <span>{paper.authorName}</span>
          {paper.publicationDate && (
            <>
              <span>·</span>
              <span>{new Date(paper.publicationDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </>
          )}
          {paper.doi && (
            <>
              <span>·</span>
              <span>DOI: {paper.doi}</span>
            </>
          )}
        </div>

        {paper.coverImage && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-hairline/40 mb-10">
            <Image src={paper.coverImage} alt="" fill className="object-cover" />
          </div>
        )}

        <div className="article-body">
          <h2 id="abstract">Abstract</h2>
          <p>{paper.abstract}</p>
        </div>

        <a
          href={paper.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors"
        >
          <Download size={14} /> Download PDF
        </a>
      </div>
    </main>
  );
}
