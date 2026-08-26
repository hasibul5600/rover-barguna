import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

export async function requireAdmin() {
  const session = await verifyAdminSession(
    (await cookies()).get(SESSION_COOKIE)?.value,
    process.env.ADMIN_SESSION_SECRET
  );
  return session ? null : NextResponse.json({ message: "অননুমোদিত অনুরোধ" }, { status: 401 });
}

export type AdminPayload = {
  title: string;
  description: string;
  status: string;
  meta: Record<string, unknown>;
  /** Newly picked image, when the form was submitted as multipart. */
  file: File | null;
  /** True when the field was present, so PUT can tell "unchanged" from "cleared". */
  hasStatus: boolean;
};

/**
 * Reads a create/update body in either shape: JSON, or multipart/form-data when
 * the form carries a photo. In the multipart case extra fields travel as a JSON
 * string under `meta`, so a member's পদবি/বিভাগ survive the upload.
 */
export async function readAdminPayload(request: Request): Promise<AdminPayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const uploaded = form.get("image");
    let meta: Record<string, unknown> = {};

    const rawMeta = form.get("meta");
    if (typeof rawMeta === "string" && rawMeta.trim()) {
      try {
        const parsed = JSON.parse(rawMeta);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          meta = parsed as Record<string, unknown>;
        }
      } catch {
        // A malformed meta blob shouldn't lose the whole submission.
      }
    }

    return {
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      status: String(form.get("status") || "published"),
      meta,
      file: uploaded instanceof File && uploaded.size > 0 ? uploaded : null,
      hasStatus: form.has("status"),
    };
  }

  const body = await request.json();
  return {
    title: body?.title || "",
    description: body?.description || "",
    status: body?.status || "published",
    meta: body?.meta && typeof body.meta === "object" ? body.meta : {},
    file: null,
    hasStatus: typeof body?.status === "string",
  };
}

/** Where each collection's uploads land in Cloudinary. */
export function uploadFolder(collection: string) {
  return `rover-barguna/${collection}`;
}
