import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  photo: z.string().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});

export async function GET() {
  try {
    const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ authors });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  try {
    const author = await prisma.author.create({ data: { ...parsed.data, slug } });
    return NextResponse.json({ author }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create author." }, { status: 500 });
  }
}
