import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "reliare_admin_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminArea && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectOrDeny(req, isAdminApi);
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET ?? "");
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return redirectOrDeny(req, isAdminApi);
  }
}

function redirectOrDeny(req: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
