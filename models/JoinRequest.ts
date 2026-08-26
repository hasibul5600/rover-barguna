import { DEPARTMENTS, type FieldSpec } from "@/lib/validators";

/**
 * Membership applications submitted from the public /join form. Stored as
 * ContentItem with collection:"requests" so they appear in the admin panel
 * alongside everything else; `title` is the applicant's name.
 *
 * `status` doubles as the review state — see REQUEST_STATUSES.
 */
export type JoinRequestMeta = {
  email?: string;
  phone?: string;
  department?: string;
  session?: string;
  roll?: string;
};

/** Review states, in the order an application moves through them. */
export const REQUEST_STATUSES = ["new", "reviewing", "approved", "rejected"] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  new: "নতুন",
  reviewing: "পর্যালোচনায়",
  approved: "অনুমোদিত",
  rejected: "প্রত্যাখ্যাত",
  published: "নতুন",
};

export const REQUEST_STATUS_BADGES: Record<string, string> = {
  new: "badge-amber",
  reviewing: "badge-slate",
  approved: "badge-green",
  rejected: "badge-red",
  published: "badge-amber",
};

export const JOIN_REQUEST_FIELDS: FieldSpec[] = [
  { name: "title", label: "আবেদনকারীর নাম", type: "text", required: true, inTable: true },
  { name: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, inTable: true },
  { name: "session", label: "সেশন", type: "text", placeholder: "২০২৩-২৪" },
  { name: "roll", label: "রোল নম্বর", type: "text" },
  { name: "phone", label: "মোবাইল", type: "tel", inTable: true },
  { name: "email", label: "ইমেইল", type: "email", inTable: true },
  { name: "description", label: "যোগদানের কারণ", type: "textarea" },
];

export const JOIN_REQUEST_COLLECTION = "requests";
