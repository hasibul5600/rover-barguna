import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
export async function middleware(request: NextRequest) { if(request.nextUrl.pathname==="/admin/login") return NextResponse.next(); const session=await verifyAdminSession(request.cookies.get(SESSION_COOKIE)?.value,process.env.ADMIN_SESSION_SECRET); if(session)return NextResponse.next(); const loginUrl=new URL("/admin/login",request.url); loginUrl.searchParams.set("next",request.nextUrl.pathname); return NextResponse.redirect(loginUrl); }
export const config={matcher:["/admin/:path*"]};
