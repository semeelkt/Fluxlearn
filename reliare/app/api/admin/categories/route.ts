import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  banner: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  order: z.number().int().default(0),
  hidden: z.boolean().default(false),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  try {
    const category = await prisma.category.create({ data: { ...parsed.data, slug } });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category (slug may already exist)." }, { status: 500 });
  }
}
