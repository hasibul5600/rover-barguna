import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAny } from "@/lib/publicApi";
import { JOIN_REQUEST_COLLECTION } from "@/models/JoinRequest";

export const runtime = "nodejs";

/** A single application. Admin-only — it contains the applicant's contact details. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const item = await getAny(JOIN_REQUEST_COLLECTION, id);
    return item ? NextResponse.json(item) : NextResponse.json({ message: "আবেদন পাওয়া যায়নি।" }, { status: 404 });
  } catch (error) {
    console.error("Request fetch failed:", error);
    return NextResponse.json({ message: "আবেদন লোড করা যায়নি।" }, { status: 500 });
  }
}
