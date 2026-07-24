import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const author = await prisma.author.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ author });
  } catch {
    return NextResponse.json({ error: "Failed to update author." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.author.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete author. They may still have articles assigned to them." },
      { status: 500 }
    );
  }
}
