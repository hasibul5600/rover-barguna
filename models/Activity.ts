import type { FieldSpec } from "@/lib/validators";

/**
 * Activities are ContentItem documents with collection:"activities" — the
 * ongoing programmes the group runs, as opposed to dated one-off events.
 */
export type ActivityMeta = {
  category?: string;
  icon?: string;
  frequency?: string;
  participants?: string;
  image?: string;
  cloudinaryId?: string;
};

export const ACTIVITY_CATEGORIES = [
  "সমাজসেবা",
  "প্রশিক্ষণ",
  "ক্যাম্প",
  "পরিবেশ",
  "স্বাস্থ্য",
  "শিক্ষা",
  "দুর্যোগ ব্যবস্থাপনা",
];

export const ACTIVITY_FIELDS: FieldSpec[] = [
  { name: "title", label: "কার্যক্রমের নাম", type: "text", required: true, placeholder: "", inTable: true },
  { name: "category", label: "ধরন", type: "select", options: ACTIVITY_CATEGORIES, inTable: true },
  { name: "icon", label: "আইকন", type: "text", placeholder: "", help: "একটি ইমোজি বা চিহ্ন দিন।" },
  { name: "frequency", label: "কত ঘন ঘন", type: "text", placeholder: "", inTable: true },
  { name: "participants", label: "অংশগ্রহণকারী", type: "number", placeholder: "" },
  { name: "description", label: "বিবরণ", type: "textarea" },
];

export const ACTIVITY_COLLECTION = "activities";
