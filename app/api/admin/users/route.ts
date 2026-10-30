import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { requireRole } from "@/lib/adminApi";
import { hashPassword } from "@/lib/password";
import User, { USER_ROLES } from "@/models/User";

export async function GET() {
  const denied = await requireRole(["super_admin"]); if (denied) return denied;
  await connectDb();
  const users = await User.find().select("name email role isActive createdAt").sort({ createdAt: -1 }).lean();
  return NextResponse.json(users);
}
export async function POST(request: Request) {
  const denied = await requireRole(["super_admin"]); if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  if (!body.name?.trim() || !body.email?.trim() || typeof body.password !== "string" || body.password.length < 8 || !USER_ROLES.includes(body.role)) return NextResponse.json({ message: "নাম, বৈধ ইমেইল, ৮ অক্ষরের পাসওয়ার্ড ও ভূমিকা দিন।" }, { status: 400 });
  await connectDb();
  try { const user = await User.create({ name: body.name.trim(), email: body.email.trim().toLowerCase(), passwordHash: await hashPassword(body.password), role: body.role }); return NextResponse.json({ id: user.id }, { status: 201 }); }
  catch { return NextResponse.json({ message: "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে।" }, { status: 409 }); }
}
