import { BLOOD_GROUPS, DEPARTMENTS, type FieldSpec } from "@/lib/validators";

/**
 * Members are stored as ContentItem documents with collection:"members" —
 * `title` holds the member's name and the rest lives in `meta`. This file owns
 * the shape of that meta payload and the field list the admin form renders.
 */
export type MemberMeta = {
  department?: string;
  session?: string;
  roll?: string;
  bsId?: string;
  bloodGroup?: string;
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
  "সদস্য",
  "সহচর",
];

export const MEMBER_FIELDS: FieldSpec[] = [
  { name: "title", label: "পূর্ণ নাম", type: "text", required: true, placeholder: "", inTable: true },
  { name: "role", label: "পদবি", type: "select", options: MEMBER_ROLES, inTable: true },
  { name: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, inTable: true },
  { name: "session", label: "সেশন", type: "text", placeholder: "" },
  { name: "roll", label: "রোল নম্বর", type: "text", placeholder: "" },
  { name: "bsId", label: "বি.এস আইডি", type: "text", placeholder: "", inTable: true },
  { name: "bloodGroup", label: "রক্তের গ্রুপ", type: "select", options: BLOOD_GROUPS, inTable: true },
  { name: "phone", label: "মোবাইল", type: "tel", placeholder: "", inTable: true },
  { name: "email", label: "ইমেইল", type: "email", placeholder: "" },
  { name: "description", label: "সংক্ষিপ্ত পরিচিতি", type: "textarea" },
];

export const MEMBER_COLLECTION = "members";
