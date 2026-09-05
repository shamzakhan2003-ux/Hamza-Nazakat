import { NextRequest, NextResponse } from "next/server";
import {
  apiRateLimit,
  authRateLimit,
  supportRateLimit,
} from "@/app/lib/rate-limit";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /*
   * ============================================================
   * ADMIN AUTHENTICATION
   * ============================================================
   */

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login"
  ) {
    const session = request.cookies.get("admin_session");

    if (!session || session.value !== "authenticated") {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  /*
   * ============================================================
   * API GATEWAY / RATE LIMITING
   * ============================================================
   */

  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    let limiter = apiRateLimit;

    /*
     * Authentication-related endpoints
     * Use a stricter limit to reduce brute-force/abuse attempts.
     */
    if (
      pathname === "/api/customer/login" ||
      pathname === "/api/customer/signup" ||
      pathname === "/api/customer/verify-otp" ||
      pathname === "/api/customer/verify-email" ||
      pathname === "/api/admin/login"
    ) {
      limiter = authRateLimit;
    }

    /*
     * AI customer support has its own limit because
     * every successful request can consume Gemini API usage.
     */
    if (pathname === "/api/customer-support") {
      limiter = supportRateLimit;
    }

    const { success, limit, remaining, reset } =
      await limiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.max(
              1,
              Math.ceil((reset - Date.now()) / 1000)
            ).toString(),
          },
        }
      );
    }

    const response = NextResponse.next();

    response.headers.set(
      "X-RateLimit-Limit",
      limit.toString()
    );

    response.headers.set(
      "X-RateLimit-Remaining",
      remaining.toString()
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};