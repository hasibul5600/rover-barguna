import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createSubmission, listAll } from "@/lib/publicApi";
import { firstError, validateJoin } from "@/lib/validators";
import { JOIN_REQUEST_COLLECTION } from "@/models/JoinRequest";

export const runtime = "nodejs";

/** Public membership application. Lands in the admin panel as a "new" request. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateJoin(body);

  if (!result.ok) {
    return NextResponse.json({ message: firstError(result.errors), errors: result.errors }, { status: 400 });
  }

  const { name, email, phone, department, session, roll, bloodGroup, reason } = result.data;

  try {
    const id = await createSubmission(
      JOIN_REQUEST_COLLECTION,
      name,
      reason,
      { email, phone, department, session, roll, bloodGroup },
      "new"
    );
    return NextResponse.json(
      { id, message: "আপনার আবেদন জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Join request failed:", error);
    return NextResponse.json({ message: "আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}

/** Applications are private, so listing them needs an admin session. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listAll(JOIN_REQUEST_COLLECTION, 200));
  } catch (error) {
    console.error("Request list failed:", error);
    return NextResponse.json({ message: "আবেদন লোড করা যায়নি।" }, { status: 500 });
  }
}
