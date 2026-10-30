import { NextResponse } from "next/server";
import { createAdminSession, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/adminAuth";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { comparePassword } from "@/lib/password";
import { clientIp, isRateLimited, rateLimit, resetRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const secret = process.env.ADMIN_SESSION_SECRET;
  const limiterKey = `login:${clientIp(request)}`;
  const lock = isRateLimited(limiterKey);
  if (lock.limited) return NextResponse.json({ message: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।" }, { status: 429, headers: { "Retry-After": String(lock.retryAfter) } });

  if (!secret) {
    return NextResponse.json({ message: "সার্ভারে অ্যাডমিন লগইন কনফিগার করা হয়নি।" }, { status: 500 });
  }

  await connectDb();
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).lean();
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    rateLimit(limiterKey, 5, 60_000);
    return NextResponse.json({ message: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।" }, { status: 401 });
  }

  resetRateLimit(limiterKey);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createAdminSession({ userId: String(user._id), email: user.email, name: user.name, role: user.role }, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
  return response;
}
