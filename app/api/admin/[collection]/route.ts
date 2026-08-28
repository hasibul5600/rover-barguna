import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";
import { readAdminPayload, requireAdmin, uploadFolder } from "@/lib/adminApi";
import { deleteCloudinaryImage, uploadDataUrl, uploadImageFile } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

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

/** Collections whose records are meaningless without a photo. */
const imageRequired = new Set(["gallery"]);

/**
 * Sends the picked file — or a data: URL pasted into meta.image — to Cloudinary.
 * Returns null when there's nothing to upload, which is fine everywhere except
 * the collections in `imageRequired`.
 */
async function uploadImage(collection: string, file: File | null, metaImage: unknown) {
  const folder = uploadFolder(collection);
  if (file && file.size > 0) {
    return uploadImageFile(file, folder);
  }
  if (typeof metaImage === "string" && metaImage.startsWith("data:image/")) {
    return uploadDataUrl(metaImage, folder);
  }
  return null;
}

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection } = await params;
  if (!allowed.includes(collection)) {
    return NextResponse.json({ message: "ভুল বিভাগ" }, { status: 404 });
  }

  try {
    await connectDb();
    return NextResponse.json(
      await ContentItem.find({ collection }).sort({ "meta.sortOrder": 1, createdAt: -1 }).lean()
    );
  } catch (err) {
    console.error("DB ERROR:", err);
    return NextResponse.json({ message: "ডাটাবেজে সংযোগ করা যায়নি।" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection } = await params;
  if (!allowed.includes(collection)) {
    return NextResponse.json({ message: "ভুল বিভাগ" }, { status: 404 });
  }

  let payload;
  try {
    payload = await readAdminPayload(request);
  } catch {
    return NextResponse.json({ message: "অনুরোধ পড়া যায়নি।" }, { status: 400 });
  }

  const { title, description, status, file } = payload;
  let meta = payload.meta;

  if (!title.trim()) {
    return NextResponse.json({ message: "শিরোনাম প্রয়োজন।" }, { status: 400 });
  }

  let uploadedPublicId: string | null = null;

  try {
    const uploaded = await uploadImage(collection, file, meta.image);
    if (uploaded) {
      uploadedPublicId = uploaded.publicId;
      meta = { ...meta, image: uploaded.url, cloudinaryId: uploaded.publicId };
    } else if (imageRequired.has(collection)) {
      return NextResponse.json({ message: "একটি বৈধ ছবি প্রয়োজন।" }, { status: 400 });
    } else {
      // Nothing uploaded — never let an unresolved data: URL reach the database.
      const { image, cloudinaryId, ...rest } = meta;
      void image;
      void cloudinaryId;
      meta = rest;
    }
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "ছবি আপলোড করা যায়নি।" },
      { status: 500 }
    );
  }

  try {
    await connectDb();
    if (meta.sortOrder === undefined || meta.sortOrder === null || meta.sortOrder === "") {
      const lastItem = await ContentItem.findOne({ collection })
        .sort({ "meta.sortOrder": -1 })
        .select("meta.sortOrder")
        .lean();
      const maxSortOrder = typeof lastItem?.meta?.sortOrder === "number" ? lastItem.meta.sortOrder : 0;
      meta.sortOrder = maxSortOrder + 1;
    }

    return NextResponse.json(
      await ContentItem.create({
        collection,
        title: title.trim(),
        description,
        status,
        meta,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("DB ERROR (POST):", err);
    // The image already reached Cloudinary, so drop it rather than leaving an orphan
    // that no database record points at.
    await deleteCloudinaryImage(uploadedPublicId);
    return NextResponse.json({ message: "তথ্য সংরক্ষণ করা যায়নি।" }, { status: 500 });
  }
}
