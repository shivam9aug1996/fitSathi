import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { checkRateLimitForAPI } from "./json";

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("gym_app_user_token")?.value;
  const userData = request.cookies.get("gym_app_user_data")?.value;
  //let fp = request.headers.get("user-fingerprint");
  const currentPath = request.nextUrl.pathname;
  // if (currentPath === "/whatsapp-script.js") {
  //   return NextResponse.next();
  // }
  //  console.log("liu765", JSON.parse(userData)?.role);
  // let userRole = userData ? JSON.parse(userData)?.role : "";
  console.log("mjhgfghjklkgfghjkl", userToken, userData);
  if (!userToken) {
    if (currentPath === "/logout") {
      return NextResponse.redirect(new URL(`/`, request.url));
    } else if (currentPath.startsWith("/dashboard")) {
      let message = "token not exists";
      // User is not authenticated and trying to access a dashboard route, redirect to login
      // return NextResponse.redirect(
      //   new URL(`/login?message=${encodeURIComponent(message)}`, request.url)
      // );
      return NextResponse.redirect(new URL(`/`, request.url));
    } else if (
      currentPath.startsWith("/api") &&
      !currentPath.includes("/api/auth/signup") &&
      !currentPath.includes("/api/auth/login") &&
      !currentPath.includes("/api/auth/logout") &&
      !currentPath.includes("/api/gym/attendance")
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication failed" }),
        { status: 401 }
      );
    }
    // else if (currentPath.includes("api/auth/signup")) {
    //   // if (!fp) {
    //   //   return new NextResponse(
    //   //     JSON.stringify({ error: "Fingerprint header is needed" }),
    //   //     { status: 400 }
    //   //   );
    //   // }
    //   if (checkRateLimitForAPI(fp, 2)) {
    //     return new NextResponse(
    //       JSON.stringify({ error: "Rate limit exceeded, wait for 60 seconds" }),
    //       { status: 429 }
    //     );
    //   } else {
    //     return NextResponse.next();
    //   }
    // }
    else {
      console.log("hiiii");
      // User is not authenticated, allow access to other pages
      return NextResponse.next();
    }
  } else if (
    currentPath === "/" ||
    currentPath === "/login" ||
    currentPath === "/signup"
  ) {
    //console.log("liu56789876765", currentPath, userRole);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/login",
    "/",
    "/signup",
    "/logout",
    // "/whatsapp-script.js",
  ],
};
