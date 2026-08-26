import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadAdminStats } from "@/lib/stats";

export const runtime = "nodejs";
// Counts must reflect the database on every request, never a cached response.
export const dynamic = "force-dynamic";

/** Polled by the admin dashboard to keep its numbers live. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
  }

  try {
    return NextResponse.json(await loadAdminStats(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin stats failed:", error);
    return NextResponse.json({ message: "পরিসংখ্যান লোড করা যায়নি।" }, { status: 500 });
  }
}
