import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
  // If accessing any protected admin route (under /admin/...)
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin") {
    const session = request.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const sessionValue = process.env.SESSION_SECRET || 'authenticated_bmg_admin_2024';
    if (session !== sessionValue) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // If accessing the login page (/admin) and already authenticated, redirect to dashboard
  if (request.nextUrl.pathname === "/admin") {
    const session = request.cookies.get("admin_session")?.value;
    const sessionValue = process.env.SESSION_SECRET || 'authenticated_bmg_admin_2024';
    if (session === sessionValue) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
