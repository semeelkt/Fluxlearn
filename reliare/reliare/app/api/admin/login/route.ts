import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, verifyAdminPassword, createAdminSession } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyAdminPassword(parsed.data.password);
  } catch {
    return NextResponse.json(
      { error: "Server is not configured. Set ADMIN_PASSWORD in the environment." },
      { status: 500 }
    );
  }

  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
