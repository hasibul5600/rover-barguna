import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";
import { readAdminPayload, requireAdmin, uploadFolder } from "@/lib/adminApi";
import { deleteCloudinaryImage, uploadDataUrl, uploadImageFile } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function PUT(request: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection, id } = await params;

  let payload;
  try {
    payload = await readAdminPayload(request);
  } catch {
    return NextResponse.json({ message: "অনুরোধ পড়া যায়নি।" }, { status: 400 });
  }

  const { title, description, status, file, hasStatus } = payload;

  if (!title.trim()) {
    return NextResponse.json({ message: "শিরোনাম প্রয়োজন।" }, { status: 400 });
  }

  try {
    await connectDb();
    const existing = await ContentItem.findOne({ _id: id, collection });
    if (!existing) {
      return NextResponse.json({ message: "তথ্য পাওয়া যায়নি" }, { status: 404 });
    }

    const previous: Record<string, unknown> = existing.meta ? { ...existing.meta } : {};
    const { removeImage, ...submitted } = payload.meta;

    // Merge rather than replace: the generic admin form posts only title/description/
    // status, and that must not wipe a record's department, role or phone.
    let meta: Record<string, unknown> = {
      ...previous,
      ...submitted,
      image: previous.image,
      cloudinaryId: previous.cloudinaryId,
    };
    let stalePublicId: string | null = null;

    const newImage =
      typeof submitted.image === "string" && submitted.image.startsWith("data:image/")
        ? submitted.image
        : "";

    if (file || newImage) {
      try {
        const uploaded = file
          ? await uploadImageFile(file, uploadFolder(collection))
          : await uploadDataUrl(newImage, uploadFolder(collection));
        meta = { ...meta, image: uploaded.url, cloudinaryId: uploaded.publicId };
        stalePublicId = typeof previous.cloudinaryId === "string" ? previous.cloudinaryId : null;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return NextResponse.json(
          { message: error instanceof Error ? error.message : "ছবি আপলোড করা যায়নি।" },
          { status: 500 }
        );
      }
    } else if (removeImage === true || removeImage === "true") {
      stalePublicId = typeof previous.cloudinaryId === "string" ? previous.cloudinaryId : null;
      meta.image = undefined;
      meta.cloudinaryId = undefined;
    }

    if (!meta.image) {
      delete meta.image;
      delete meta.cloudinaryId;
    }

    const item = await ContentItem.findOneAndUpdate(
      { _id: id, collection },
      { title: title.trim(), description, meta, ...(hasStatus ? { status } : {}) },
      { new: true, runValidators: true }
    );

    // Only bin the old image once the record safely points away from it.
    if (item) await deleteCloudinaryImage(stalePublicId);

    return item ? NextResponse.json(item) : NextResponse.json({ message: "তথ্য পাওয়া যায়নি" }, { status: 404 });
  } catch (err) {
    console.error("DB ERROR (PUT):", err);
    return NextResponse.json({ message: "তথ্য হালনাগাদ করা যায়নি" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection, id } = await params;

  try {
    await connectDb();
    const item = await ContentItem.findOne({ _id: id, collection });
    if (!item) {
      return NextResponse.json({ message: "তথ্য পাওয়া যায়নি" }, { status: 404 });
    }

    await deleteCloudinaryImage(item.meta?.cloudinaryId);
    await ContentItem.deleteOne({ _id: id, collection });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "তথ্য মুছা যায়নি" }, { status: 500 });
  }
}
