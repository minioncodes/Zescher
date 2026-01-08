// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PUBLIC = ["/admin/login"]; // add forgot-password, etc. if needed

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only guard /admin pages (not APIs or assets)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (ADMIN_PUBLIC.includes(pathname)) return NextResponse.next();

  // Read your admin cookie
  const token =
    req.cookies.get("adminToken")?.value || req.cookies.get("token")?.value;

  // No token → redirect to login with return URL
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*"], // pages under /admin
};
