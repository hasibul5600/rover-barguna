import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createSubmission, listAll } from "@/lib/publicApi";
import { firstError, validateJoin } from "@/lib/validators";
import { JOIN_REQUEST_COLLECTION } from "@/models/JoinRequest";
import { adminEmail, sendMail } from "@/lib/mail";
import { adminAlert, applicationReceived } from "@/lib/mailTemplates";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/** Public membership application. Lands in the admin panel as a "new" request. */
export async function POST(request: Request) {
  const limited = rateLimit(`request:${clientIp(request)}`, 3, 60_000);
  if (!limited.allowed) return NextResponse.json({ message: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।" }, { status: 429 });
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
    void sendMail({ to: email, subject: "রোভার স্কাউট আবেদন গ্রহণ করা হয়েছে", html: applicationReceived(name) }).catch(console.error);
    const admin = adminEmail();
    if (admin) void sendMail({ to: admin, subject: "নতুন রোভার আবেদন", html: adminAlert("নতুন সদস্য আবেদন", `${name} নতুন আবেদন জমা দিয়েছেন।`) }).catch(console.error);
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
