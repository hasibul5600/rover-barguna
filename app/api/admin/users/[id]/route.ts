import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { requireRole } from "@/lib/adminApi";
import { hashPassword } from "@/lib/password";
import User, { USER_ROLES } from "@/models/User";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireRole(["super_admin"]); if (denied) return denied;
  const body = await request.json().catch(() => ({})); const { id } = await params;
  const update: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
  if (USER_ROLES.includes(body.role)) update.role = body.role;
  if (typeof body.isActive === "boolean") update.isActive = body.isActive;
  if (typeof body.password === "string" && body.password.length >= 8) update.passwordHash = await hashPassword(body.password);
  await connectDb(); const user = await User.findByIdAndUpdate(id, update, { new: true }).select("name email role isActive");
  return user ? NextResponse.json(user) : NextResponse.json({ message: "ব্যবহারকারী পাওয়া যায়নি।" }, { status: 404 });
}
