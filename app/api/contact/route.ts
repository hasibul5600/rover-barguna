import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/publicApi";
import { firstError, validateContact } from "@/lib/validators";
import { MESSAGE_COLLECTION } from "@/models/Message";
import { adminEmail, sendMail } from "@/lib/mail";
import { adminAlert } from "@/lib/mailTemplates";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/** Public contact form. Shows up under "বার্তা" in the admin panel as unread. */
export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, 5, 60_000);
  if (!limited.allowed) return NextResponse.json({ message: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।" }, { status: 429 });
  const body = await request.json().catch(() => null);
  const result = validateContact(body);

  if (!result.ok) {
    return NextResponse.json({ message: firstError(result.errors), errors: result.errors }, { status: 400 });
  }

  const { name, email, phone, subject, message } = result.data;

  try {
    const id = await createSubmission(
      MESSAGE_COLLECTION,
      subject,
      message,
      { name, email, phone },
      "unread"
    );
    const admin = adminEmail();
    if (admin) void sendMail({ to: admin, subject: `নতুন যোগাযোগ: ${subject}`, html: adminAlert("নতুন যোগাযোগ", `${name} (${email}) লিখেছেন: ${subject}`) }).catch(console.error);
    return NextResponse.json({ id, message: "আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!" }, { status: 201 });
  } catch (error) {
    console.error("Contact message failed:", error);
    return NextResponse.json({ message: "বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
