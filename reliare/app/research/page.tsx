import { ResearchCard } from "@/components/site/research-card";
import { researchPapers } from "@/lib/mock-data";

export const metadata = { title: "Research — Reliare" };

export default function ResearchPage() {
  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Publications</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">Research</h1>
        <p className="text-muted dark:text-muted-dark mt-3 leading-relaxed">
          Peer-reviewed papers and long-form research from Reliare&rsquo;s contributors.
        </p>
      </header>
      <div className="max-w-4xl">
        {researchPapers.map((p) => (
          <ResearchCard key={p.slug} paper={p} />
        ))}
      </div>
    </main>
  );
}
