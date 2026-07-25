import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) return NextResponse.json({ results: [] });

  try {
    const results = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      },
      include: { author: true, category: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    // Log the search for the admin analytics "Popular Searches" panel.
    // Best-effort — don't fail the search if logging fails.
    prisma.searchLog.create({ data: { query: q } }).catch(() => {});

    return NextResponse.json({
      results: results.map((a: (typeof results)[number]) => ({
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        category: a.category.name,
        author: a.author.name,
        authorSlug: a.author.slug,
        date: (a.publishedAt ?? a.createdAt).toISOString(),
        readingTime: a.readingTime,
        cover: a.coverImage ?? "",
      })),
    });
  } catch {
    return NextResponse.json({ results: [], error: "Database not reachable." }, { status: 500 });
  }
}
