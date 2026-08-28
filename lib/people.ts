import { BLOOD_GROUPS, DEPARTMENTS } from "@/lib/validators";
import { EX_MEMBER_COLLECTION } from "@/models/ExMember";
import {
  JOIN_REQUEST_COLLECTION,
  REQUEST_STATUSES,
  REQUEST_STATUS_LABELS,
} from "@/models/JoinRequest";
import { MEMBER_COLLECTION, MEMBER_ROLES } from "@/models/Member";

/**
 * Config for components/admin/PeopleManager.tsx.
 *
 * Current members and former members are the same kind of record — a name, a photo,
 * a bio and a handful of meta fields — differing only in wording and which fields
 * apply. One manager driven by these two configs keeps a single tested
 * create/edit/photo-upload path instead of two copies drifting apart.
 */

export type PeopleField = {
  /** Key inside ContentItem.meta. */
  key: string;
  label: string;
  type: "text" | "tel" | "email" | "select";
  /** Required when type is "select". */
  options?: string[];
  placeholder?: string;
  /** Give this field a column of its own in the list table. */
  inTable?: boolean;
  /** Column heading, when it should read differently from the form label. */
  tableLabel?: string;
  /**
   * How the table cell renders. "roleBadge" tints by role, "blood" uses a red pill
   * so a group is findable while skimming, "contact" adds the email underneath.
   */
  display?: "roleBadge" | "blood" | "contact";
};

export type PeopleConfig = {
  /** Drives /api/admin/<collection>; must be in the whitelist in app/api/admin/[collection]/route.ts. */
  collection: string;
  /**
   * Singular Bengali noun for this kind of person. Every heading, button, notice and
   * confirm prompt is built from it — "সদস্য" → "সদস্য যোগ করুন", "সদস্যের তথ্য
   * সম্পাদনা", "এখনও কোনো সদস্য নেই" — so both sections read naturally from one word.
   */
  noun: string;
  /** Page heading, when "<noun> ব্যবস্থাপনা" isn't the right wording. */
  heading?: string;
  intro: string;
  emptyIcon: string;
  /** Defaults to "পূর্ণ নাম". Also used in the "… লিখুন।" validation message. */
  nameLabel?: string;
  namePlaceholder: string;
  /** Meta keys joined into a small grey line under the name in the table. */
  subtitleKeys: string[];
  fields: PeopleField[];
  bioLabel: string;
  bioPlaceholder: string;
  /** Set false where a photo makes no sense — e.g. an application typed by an applicant. */
  photo?: boolean;
  /** Defaults to প্রকাশিত/খসড়া. Applications use their own review states instead. */
  statuses?: Array<{ value: string; label: string }>;
  /** Tailwind pill classes per status value, used in the list table. */
  statusTones?: Record<string, string>;
  /** Status a brand-new record starts on. Defaults to "published". */
  defaultStatus?: string;
  statusHelp: string;
};

/** Shared by both sections — the surrounding wording differs, the option list never does. */
const BLOOD_FIELD: PeopleField = {
  key: "bloodGroup",
  label: "রক্তের গ্রুপ",
  type: "select",
  options: BLOOD_GROUPS,
  placeholder: "রক্তের গ্রুপ নির্বাচন করুন",
  inTable: true,
  display: "blood",
};

const CONTACT_FIELDS: PeopleField[] = [
  {
    key: "phone",
    label: "মোবাইল",
    type: "tel",
    placeholder: "",
    inTable: true,
    tableLabel: "যোগাযোগ",
    display: "contact",
  },
  { key: "email", label: "ইমেইল", type: "email", placeholder: "" },
];

export const MEMBER_PEOPLE: PeopleConfig = {
  collection: MEMBER_COLLECTION,
  noun: "সদস্য",
  intro: "নাম, পদবি, রক্তের গ্রুপ ও ছবি সহ তথ্য যোগ করুন — সবকিছু নেতৃত্ব পাতায় দেখা যাবে।",
  emptyIcon: "👥",
  namePlaceholder: "",
  subtitleKeys: ["session", "roll", "bsId"],
  fields: [
    { key: "role", label: "পদবি", type: "select", options: MEMBER_ROLES, placeholder: "পদবি নির্বাচন করুন", inTable: true, display: "roleBadge" },
    { key: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, placeholder: "বিভাগ নির্বাচন করুন", inTable: true },
    { key: "session", label: "সেশন", type: "text", placeholder: "" },
    { key: "roll", label: "রোল নম্বর", type: "text", placeholder: "" },
    { key: "bsId", label: "বি.এস আইডি", type: "text", placeholder: "", inTable: true },
    BLOOD_FIELD,
    ...CONTACT_FIELDS,
  ],
  bioLabel: "সংক্ষিপ্ত পরিচিতি",
  bioPlaceholder: "",
  statusHelp: "খসড়া রাখলে সদস্যটি ওয়েবসাইটে দেখা যাবে না।",
};

export const EX_MEMBER_PEOPLE: PeopleConfig = {
  collection: EX_MEMBER_COLLECTION,
  noun: "প্রাক্তন সদস্য",
  intro: "গ্রুপ থেকে বিদায় নেওয়া রোভারদের তথ্য সংরক্ষণ করুন — প্রকাশিত রাখলে প্রাক্তন সদস্য পাতায় দেখা যাবে।",
  emptyIcon: "🎓",
  namePlaceholder: "",
  subtitleKeys: ["session", "passingYear", "bsId"],
  fields: [
    { key: "role", label: "সর্বশেষ পদবি", type: "select", options: MEMBER_ROLES, placeholder: "পদবি নির্বাচন করুন", inTable: true, tableLabel: "সর্বশেষ পদবি", display: "roleBadge" },
    { key: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, placeholder: "বিভাগ নির্বাচন করুন", inTable: true },
    { key: "session", label: "সেশন", type: "text", placeholder: "" },
    { key: "passingYear", label: "বিদায়ের বছর", type: "text", placeholder: "" },
    { key: "bsId", label: "বি.এস আইডি", type: "text", placeholder: "", inTable: true },
    BLOOD_FIELD,
    { key: "occupation", label: "বর্তমান পেশা / কর্মস্থল", type: "text", placeholder: "", inTable: true, tableLabel: "বর্তমান অবস্থান" },
    ...CONTACT_FIELDS,
  ],
  bioLabel: "স্মৃতি ও অবদান",
  bioPlaceholder: "",
  statusHelp: "খসড়া রাখলে তথ্যটি শুধু অ্যাডমিন প্যানেলে থাকবে, ওয়েবসাইটে দেখা যাবে না।",
};

/**
 * Membership applications from the public /join form.
 *
 * They belong here rather than in the generic ManagementPage because that component
 * only renders title/description/status — every detail the applicant actually typed
 * (department, session, roll, blood group, phone, email) was being stored and then
 * never shown. Reusing PeopleManager surfaces all of it and finally puts the
 * REQUEST_STATUSES review workflow in front of the admin.
 */
export const REQUEST_PEOPLE: PeopleConfig = {
  collection: JOIN_REQUEST_COLLECTION,
  noun: "আবেদন",
  heading: "সদস্য আবেদন",
  intro: "নতুন সদস্যপদের আবেদন পর্যালোচনা করুন — যোগাযোগের তথ্য ও রক্তের গ্রুপ সহ।",
  emptyIcon: "📝",
  nameLabel: "আবেদনকারীর নাম",
  namePlaceholder: "",
  subtitleKeys: ["session", "roll"],
  fields: [
    { key: "department", label: "বিভাগ", type: "select", options: DEPARTMENTS, placeholder: "বিভাগ নির্বাচন করুন", inTable: true },
    { key: "session", label: "সেশন", type: "text", placeholder: "" },
    { key: "roll", label: "রোল নম্বর", type: "text", placeholder: "" },
    BLOOD_FIELD,
    ...CONTACT_FIELDS,
  ],
  bioLabel: "যোগদানের কারণ",
  bioPlaceholder: "",
  photo: false,
  statuses: REQUEST_STATUSES.map((value) => ({ value, label: REQUEST_STATUS_LABELS[value] })),
  statusTones: {
    new: "bg-amber-50 text-amber-700",
    reviewing: "bg-slate-100 text-slate-600",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    // Older rows created before the review states existed.
    published: "bg-amber-50 text-amber-700",
  },
  defaultStatus: "new",
  statusHelp: "পর্যালোচনার অবস্থা বদলালে আবেদনকারীকে নিজে জানাতে হবে — স্বয়ংক্রিয় ইমেইল পাঠানো হয় না।",
};
