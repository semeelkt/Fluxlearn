import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  banner: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  order: z.number().int().optional(),
  hidden: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const category = await prisma.category.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category. It may still have articles assigned to it." },
      { status: 500 }
    );
  }
}
