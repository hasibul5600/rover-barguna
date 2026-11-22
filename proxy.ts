import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { MEMBER_SESSION_COOKIE, verifyMemberSession } from "@/lib/memberAuth";
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/member")) {
    if (path === "/member/login") return NextResponse.next();
    const member = await verifyMemberSession(request.cookies.get(MEMBER_SESSION_COOKIE)?.value);
    if (member) return NextResponse.next();
    const loginUrl = new URL("/member/login", request.url); loginUrl.searchParams.set("next", path); return NextResponse.redirect(loginUrl);
  }
  if(path==="/admin/login") return NextResponse.next(); const session=await verifyAdminSession(request.cookies.get(SESSION_COOKIE)?.value,process.env.ADMIN_SESSION_SECRET); if(session)return NextResponse.next(); const loginUrl=new URL("/admin/login",request.url); loginUrl.searchParams.set("next",request.nextUrl.pathname); return NextResponse.redirect(loginUrl);
}
export const config={matcher:["/admin/:path*", "/member/:path*"]};
