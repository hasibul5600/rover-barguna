import { NextResponse } from "next/server";
import { MEMBER_SESSION_COOKIE } from "@/lib/memberAuth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/member/login", request.url), { status: 303 });
  response.cookies.set(MEMBER_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: new Date(0), path: "/" });
  return response;
}
