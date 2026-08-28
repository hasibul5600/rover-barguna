import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";

/**
 * Shared plumbing for the public read-only endpoints. Each collection's route
 * is a thin wrapper around these so the shape stays identical everywhere.
 */

export type PublicItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

function shape(document: Record<string, unknown>): PublicItem {
  return {
    id: String(document._id),
    title: String(document.title ?? ""),
    description: String(document.description ?? ""),
    status: String(document.status ?? "published"),
    meta: (document.meta as Record<string, unknown>) || {},
    createdAt: String(document.createdAt ?? ""),
  };
}

/** Statuses that count as "visible to the public" for a given collection. */
function publicStatuses(collection: string) {
  // requests/messages are submissions, never publicly listed — guarded by callers.
  return collection === "notices" || collection === "gallery"
    ? ["published"]
    : ["published", "active"];
}

export async function listPublic(collection: string, limit = 100) {
  await connectDb();
  const items = await ContentItem.find({ collection, status: { $in: publicStatuses(collection) } })
    .sort({ "meta.sortOrder": 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return items.map(shape);
}

/**
 * Unfiltered listing, including drafts and submissions. Callers MUST check for an
 * admin session first — submissions carry applicants' phone numbers and emails.
 */
export async function listAll(collection: string, limit = 200) {
  await connectDb();
  const items = await ContentItem.find({ collection })
    .sort({ "meta.sortOrder": 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return items.map(shape);
}

/** Unfiltered single item. Admin-only, same reason as listAll. */
export async function getAny(collection: string, id: string) {
  await connectDb();
  const item = await ContentItem.findOne({ _id: id, collection }).lean();
  return item ? shape(item as Record<string, unknown>) : null;
}

export async function getPublic(collection: string, id: string) {
  await connectDb();
  const item = await ContentItem.findOne({ _id: id, collection, status: { $in: publicStatuses(collection) } }).lean();
  return item ? shape(item as Record<string, unknown>) : null;
}

/** GET handler for a public collection listing. */
export function publicListRoute(collection: string, failureMessage: string) {
  return async function GET(request: Request) {
    try {
      const limit = Number(new URL(request.url).searchParams.get("limit")) || 100;
      return NextResponse.json(await listPublic(collection, Math.min(Math.max(limit, 1), 200)));
    } catch (error) {
      console.error(`Public list failed (${collection}):`, error);
      return NextResponse.json({ message: failureMessage }, { status: 500 });
    }
  };
}

/** GET handler for a single public item. */
export function publicItemRoute(collection: string, failureMessage: string) {
  return async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;
      const item = await getPublic(collection, id);
      return item ? NextResponse.json(item) : NextResponse.json({ message: "তথ্য পাওয়া যায়নি।" }, { status: 404 });
    } catch (error) {
      console.error(`Public item failed (${collection}):`, error);
      return NextResponse.json({ message: failureMessage }, { status: 500 });
    }
  };
}

/** Create a submission (join request / contact message) from a public form. */
export async function createSubmission(
  collection: string,
  title: string,
  description: string,
  meta: Record<string, string>,
  status: string
) {
  await connectDb();
  const created = await ContentItem.create({ collection, title, description, meta, status });
  return String(created._id);
}
