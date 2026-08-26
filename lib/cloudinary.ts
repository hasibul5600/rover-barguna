import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function assertConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary কনফিগার করা হয়নি। .env.local-এ CLOUDINARY_CLOUD_NAME, API_KEY ও API_SECRET দিন।");
  }
}

export async function uploadImageBuffer(buffer: Buffer, folder: string, mimeType: string) {
  assertConfigured();
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("শুধু JPG, PNG, WEBP বা GIF ছবি আপলোড করুন।");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("ছবির আকার ৮ MB-এর কম হতে হবে।");
  }

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: false },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new Error(error?.message || "Cloudinary-তে ছবি আপলোড করা যায়নি।"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function uploadImageFile(file: File, folder: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadImageBuffer(buffer, folder, file.type);
}

export async function uploadDataUrl(dataUrl: string, folder: string) {
  assertConfigured();
  const result = await cloudinary.uploader.upload(dataUrl, { folder, resource_type: "image" });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteCloudinaryImage(publicId?: string | null) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}

export default cloudinary;
