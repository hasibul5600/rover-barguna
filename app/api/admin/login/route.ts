import { NextResponse } from "next/server";
import { createAdminSession, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !adminPassword || !secret) {
    return NextResponse.json({ message: "সার্ভারে অ্যাডমিন লগইন কনফিগার করা হয়নি।" }, { status: 500 });
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return NextResponse.json({ message: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createAdminSession(adminEmail, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
  return response;
}
