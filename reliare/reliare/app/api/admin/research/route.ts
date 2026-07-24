import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(3),
  abstract: z.string().min(1),
  authorName: z.string().min(1),
  journal: z.string().optional(),
  doi: z.string().optional(),
  publicationDate: z.string().datetime().optional(),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  pdfUrl: z.string().min(1),
});

export async function GET() {
  try {
    const papers = await prisma.researchPaper.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ papers });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const slug = slugify(parsed.data.title, { lower: true, strict: true });
  try {
    const paper = await prisma.researchPaper.create({
      data: {
        ...parsed.data,
        slug,
        publicationDate: parsed.data.publicationDate ? new Date(parsed.data.publicationDate) : undefined,
      },
    });
    return NextResponse.json({ paper }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create research paper." }, { status: 500 });
  }
}
