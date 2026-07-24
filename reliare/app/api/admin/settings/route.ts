import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  contactEmail: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  newsletterHeadline: z.string().optional(),
  newsletterCopy: z.string().optional(),
});

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: parsed.data });
    } else {
      settings = await prisma.settings.update({ where: { id: settings.id }, data: parsed.data });
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
