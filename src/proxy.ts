import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const sessionValue = process.env.SESSION_SECRET || 'authenticated_bmg_admin_2024';
    if (session !== sessionValue) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
