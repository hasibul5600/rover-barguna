import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";

const allowed = [
  "members",
  "exmembers",
  "requests",
  "events",
  "activities",
  "notices",
  "gallery",
  "messages",
];

export async function PATCH(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection } = await params;
  if (!allowed.includes(collection)) {
    return NextResponse.json({ message: "ভুল বিভাগ" }, { status: 404 });
  }

  try {
    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "অকার্যকর ডাটা" }, { status: 400 });
    }

    await connectDb();

    // items should be array of { id, sortOrder }
    const bulkOps = items.map(({ id, sortOrder }: { id: string; sortOrder: number }) => ({
      updateOne: {
        filter: { _id: id, collection },
        update: { $set: { "meta.sortOrder": sortOrder } },
      },
    }));

    await ContentItem.bulkWrite(bulkOps);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ message: "ক্রম পরিবর্তন করা যায়নি।" }, { status: 500 });
  }
}
