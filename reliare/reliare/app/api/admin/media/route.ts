import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") ?? undefined;
  try {
    const media = await prisma.mediaItem.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ media });
  } catch {
    return NextResponse.json({ error: "Database not reachable." }, { status: 500 });
  }
}

// Accepts multipart/form-data with a "file" field and optional "folder" field.
// Files are stored under /public/uploads — swap this for S3/R2 in production.
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  const folder = (form?.get("folder") as string) || "uploads";

  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 20MB limit." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safeName), bytes);

    const url = `/uploads/${folder}/${safeName}`;
    const media = await prisma.mediaItem.create({
      data: {
        filename: file.name,
        url,
        type: file.type === "application/pdf" ? "pdf" : "image",
        folder,
        size: file.size,
      },
    });
    return NextResponse.json({ media }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
