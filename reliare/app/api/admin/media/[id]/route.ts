import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ filename: z.string().min(1) });

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const media = await prisma.mediaItem.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ media });
  } catch {
    return NextResponse.json({ error: "Failed to rename file." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.mediaItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete file." }, { status: 500 });
  }
}
