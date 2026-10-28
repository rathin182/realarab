import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isAuthenticated = !!req.auth?.user;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN";
  if (path === "/login" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }
  if (path === "/register" || path.startsWith("/register/")) {
    return new NextResponse(null, { status: 404 });
  }
  if (path.startsWith("/admin") && !isAdmin) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      path + nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});
export const config = {
  matcher: ["/admin/:path*", "/login", "/register/:path*"],
};
