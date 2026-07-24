import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  try {
    const [totalArticles, published, drafts, categories, authors, papers] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.author.count(),
      prisma.researchPaper.count(),
    ]);
    return { totalArticles, published, drafts, categories, authors, papers, connected: true };
  } catch {
    return { totalArticles: 0, published: 0, drafts: 0, categories: 0, authors: 0, papers: 0, connected: false };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <span className="issue-line">Overview</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-10">Dashboard</h1>

      {!stats.connected && (
        <div className="mb-10 p-4 border rule text-sm text-oxblood">
          Could not reach the database. Set <code>DATABASE_URL</code> in your <code>.env</code> file to a
          MongoDB connection string, then run <code>npx prisma generate</code>.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-hairline dark:bg-hairline-dark mb-14">
        <Stat label="Total Articles" value={stats.totalArticles} />
        <Stat label="Published" value={stats.published} />
        <Stat label="Drafts" value={stats.drafts} />
        <Stat label="Categories" value={stats.categories} />
        <Stat label="Authors" value={stats.authors} />
        <Stat label="Research Papers" value={stats.papers} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/admin/articles/new" className="text-sm font-sans px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark hover:bg-oxblood transition-colors">
          Write New Article
        </Link>
        <Link href="/admin/research" className="text-sm font-sans px-5 py-2.5 border rule hover:border-oxblood hover:text-oxblood transition-colors">
          Upload Research Paper
        </Link>
        <Link href="/admin/analytics" className="text-sm font-sans px-5 py-2.5 border rule hover:border-oxblood hover:text-oxblood transition-colors">
          View Analytics
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper dark:bg-paper-dark p-6">
      <div className="font-display text-[36px] leading-none">{value}</div>
      <div className="issue-line mt-2">{label}</div>
    </div>
  );
}
