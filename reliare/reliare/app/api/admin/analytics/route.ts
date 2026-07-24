import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalArticles, published, drafts, totalViewsAgg, topArticles, categoryCounts, recentSearches] =
      await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: "PUBLISHED" } }),
        prisma.article.count({ where: { status: "DRAFT" } }),
        prisma.article.aggregate({ _sum: { views: true } }),
        prisma.article.findMany({ orderBy: { views: "desc" }, take: 5, include: { category: true } }),
        prisma.category.findMany({ include: { _count: { select: { articles: true } } } }),
        prisma.searchLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      ]);

    return NextResponse.json({
      totalArticles,
      published,
      drafts,
      totalViews: totalViewsAgg._sum.views ?? 0,
      topArticles,
      categoryCounts: categoryCounts.map((c: { name: string; _count: { articles: number } }) => ({
        name: c.name,
        count: c._count.articles,
      })),
      recentSearches,
    });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}
