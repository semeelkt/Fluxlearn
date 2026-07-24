import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  readingTime: z.number().int().min(1).optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  references: z.array(z.string()).optional(),
  scheduledFor: z.string().datetime().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: { author: true, category: true },
    });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const existing = await prisma.article.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...data,
        publishedAt:
          data.status === "PUBLISHED" && existing.status !== "PUBLISHED" ? new Date() : undefined,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
      },
    });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "Failed to update article." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.article.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete article." }, { status: 500 });
  }
}

// Supports { action: "duplicate" | "archive" | "publish" | "draft" }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const action = body?.action;

  try {
    const original = await prisma.article.findUnique({ where: { id: params.id } });
    if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "duplicate") {
      const baseSlug = slugify(`${original.title}-copy`, { lower: true, strict: true });
      let slug = baseSlug;
      let n = 1;
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${++n}`;
      }
      const { id, createdAt, updatedAt, ...rest } = original;
      const copy = await prisma.article.create({
        data: { ...rest, title: `${original.title} (Copy)`, slug, status: "DRAFT", publishedAt: null },
      });
      return NextResponse.json({ article: copy });
    }

    if (action === "archive") {
      const article = await prisma.article.update({ where: { id: params.id }, data: { status: "ARCHIVED" } });
      return NextResponse.json({ article });
    }

    if (action === "publish") {
      const article = await prisma.article.update({
        where: { id: params.id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
      return NextResponse.json({ article });
    }

    if (action === "draft") {
      const article = await prisma.article.update({ where: { id: params.id }, data: { status: "DRAFT" } });
      return NextResponse.json({ article });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}
