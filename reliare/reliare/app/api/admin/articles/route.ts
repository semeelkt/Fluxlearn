import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const articleSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(1),
  content: z.string().default(""),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  editorsPick: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).default(5),
  authorId: z.string(),
  categoryId: z.string(),
  references: z.array(z.string()).default([]),
  scheduledFor: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const articles = await prisma.article.findMany({
      where: status ? { status: status as any } : undefined,
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ articles });
  } catch (err) {
    return NextResponse.json({ error: "Database not reachable. Check DATABASE_URL." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title, { lower: true, strict: true });

  try {
    let slug = baseSlug;
    let n = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const article = await prisma.article.create({
      data: {
        ...data,
        slug,
        publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
      },
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create article. Check DATABASE_URL." }, { status: 500 });
  }
}
