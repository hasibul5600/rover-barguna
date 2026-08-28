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
  { name: "title", label: "ইভেন্টের নাম", type: "text", required: true, placeholder: "", inTable: true },
  { name: "date", label: "তারিখ", type: "date", required: true, inTable: true },
  { name: "time", label: "সময়", type: "text", placeholder: "" },
  { name: "venue", label: "স্থান", type: "text", placeholder: "", inTable: true },
  { name: "organiser", label: "আয়োজক", type: "text", placeholder: "" },
  { name: "seats", label: "আসন সংখ্যা", type: "number", placeholder: "" },
  { name: "description", label: "বিস্তারিত", type: "textarea" },
];

export const EVENT_COLLECTION = "events";
