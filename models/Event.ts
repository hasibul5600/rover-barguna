import type { FieldSpec } from "@/lib/validators";

/**
 * Events are ContentItem documents with collection:"events" — `title` is the
 * event name, `description` the details, and scheduling info lives in `meta`.
 */
export type EventMeta = {
  date?: string;
  time?: string;
  venue?: string;
  organiser?: string;
  seats?: string;
  image?: string;
  cloudinaryId?: string;
};

export const EVENT_FIELDS: FieldSpec[] = [
  { name: "title", label: "ইভেন্টের নাম", type: "text", required: true, placeholder: "যেমন: বার্ষিক তাঁবু জলসা", inTable: true },
  { name: "date", label: "তারিখ", type: "date", required: true, inTable: true },
  { name: "time", label: "সময়", type: "text", placeholder: "সকাল ৯:০০" },
  { name: "venue", label: "স্থান", type: "text", placeholder: "কলেজ মাঠ, বরগুনা", inTable: true },
  { name: "organiser", label: "আয়োজক", type: "text", placeholder: "রোভার স্কাউট গ্রুপ" },
  { name: "seats", label: "আসন সংখ্যা", type: "number", placeholder: "৫০" },
  { name: "description", label: "বিস্তারিত", type: "textarea" },
];

export const EVENT_COLLECTION = "events";
