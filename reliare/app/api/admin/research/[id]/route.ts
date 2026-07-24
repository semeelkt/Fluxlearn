import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(3).optional(),
  abstract: z.string().optional(),
  authorName: z.string().optional(),
  journal: z.string().optional(),
  doi: z.string().optional(),
  publicationDate: z.string().datetime().optional(),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const paper = await prisma.researchPaper.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        publicationDate: parsed.data.publicationDate ? new Date(parsed.data.publicationDate) : undefined,
      },
    });
    return NextResponse.json({ paper });
  } catch {
    return NextResponse.json({ error: "Failed to update research paper." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.researchPaper.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete research paper." }, { status: 500 });
  }
}
