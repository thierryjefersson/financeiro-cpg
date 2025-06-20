import { NextRequest, NextResponse } from "next/server";
import verifyToken from "./lib/verify-token";

const protectedRoutes = ["/reports"];
const publicRoutes = ["/login-wocody-cpg"];

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const path = req.nextUrl.pathname;
  const { isValid } = (await verifyToken(token)) as { isValid: boolean };
  const isAuthorized = token ? isValid : false;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (!isAuthorized && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login-wocody-cpg", req.url));
  } else if (isAuthorized && isPublicRoute) {
    return NextResponse.redirect(new URL("/reports", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
