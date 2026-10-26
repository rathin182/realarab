import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isAdmin = req.auth?.user.role === "ADMIN";

  if (path === "/login" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  if (path.startsWith("/admin") && !isAdmin) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*", "/login"] };