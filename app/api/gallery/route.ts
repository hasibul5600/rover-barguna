import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const photos = await ContentItem.find({ collection: "gallery", status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(
      photos.map((photo) => ({
        id: String(photo._id),
        title: photo.title,
        description: photo.description || "",
        image: photo.meta?.image || "",
        createdAt: photo.createdAt,
      }))
    );
  } catch {
    return NextResponse.json({ message: "গ্যালারি লোড করা যায়নি।" }, { status: 500 });
  }
}
