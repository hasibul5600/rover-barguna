import type { FieldSpec } from "@/lib/validators";

/**
 * Contact-form submissions, stored as ContentItem with collection:"messages".
 * `title` is the sender's name, `description` the message body.
 *
 * `status` tracks whether an admin has dealt with it — see MESSAGE_STATUSES.
 */
export type MessageMeta = {
  email?: string;
  phone?: string;
  subject?: string;
};

export const MESSAGE_STATUSES = ["unread", "read", "replied"] as const;

export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  unread: "অপঠিত",
  read: "পঠিত",
  replied: "উত্তর দেওয়া হয়েছে",
  published: "অপঠিত",
};

export const MESSAGE_STATUS_BADGES: Record<string, string> = {
  unread: "badge-amber",
  read: "badge-slate",
  replied: "badge-green",
  published: "badge-amber",
};

export const MESSAGE_FIELDS: FieldSpec[] = [
  { name: "title", label: "প্রেরকের নাম", type: "text", required: true, inTable: true },
  { name: "subject", label: "বিষয়", type: "text", inTable: true },
  { name: "email", label: "ইমেইল", type: "email", inTable: true },
  { name: "phone", label: "মোবাইল", type: "tel" },
  { name: "description", label: "বার্তা", type: "textarea" },
];

export const MESSAGE_COLLECTION = "messages";
