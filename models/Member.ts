import { DEPARTMENTS, type FieldSpec } from "@/lib/validators";

/**
 * Members are stored as ContentItem documents with collection:"members" —
 * `title` holds the member's name and the rest lives in `meta`. This file owns
 * the shape of that meta payload and the field list the admin form renders.
 */
export type MemberMeta = {
  department?: string;
  session?: string;
  roll?: string;
  phone?: string;
  email?: string;
  role?: string;
  image?: string;
  cloudinaryId?: string;
};

/**
 * Ordered from most senior down — the leadership page groups members in this
 * order, so a change here changes how that page is laid out.
 */
export const MEMBER_ROLES = [
  "রোভার স্কাউট লিডার",
  "সিনিয়র রোভার মেট",
  "রোভার মেট",
  "সহকারী রোভার মেট",
  "সিনিয়র রোভার",
  "রোভার",
];

export const MEMBER_FIELDS: FieldSpec[] = [
  { name: "title", label: "পূর্ণ নাম", type: "text", required: true, placeholder: "যেমন: মোঃ রিফাত হোসেন", inTable: true },
  { name: "role", label: "পদবি", type: "select", options: MEMBER_ROLES, inTable: true },
  { name: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, inTable: true },
  { name: "session", label: "সেশন", type: "text", placeholder: "২০২৩-২৪" },
  { name: "roll", label: "রোল নম্বর", type: "text", placeholder: "১২৩৪৫৬" },
  { name: "phone", label: "মোবাইল", type: "tel", placeholder: "০১৭xxxxxxxx", inTable: true },
  { name: "email", label: "ইমেইল", type: "email", placeholder: "name@example.com" },
  { name: "description", label: "সংক্ষিপ্ত পরিচিতি", type: "textarea" },
];

export const MEMBER_COLLECTION = "members";
