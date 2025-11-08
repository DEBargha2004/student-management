import { NextRequest, NextResponse } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";

const isAuthRoute = (request: NextRequest) =>
  /^(\/api)?\/auth/.test(request.nextUrl.pathname);

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);

  if (isAuthRoute(request)) return NextResponse.next();

  if (!session)
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
