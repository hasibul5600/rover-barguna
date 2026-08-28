/**
 * Notices managed in the admin panel are ContentItem documents with collection: "notices".
 * This file describes the meta payload shape, categories, and field list.
 */

/**
 * Notices the admin panel actually manages are ContentItem documents with
 * collection:"notices" (the schema above predates that and is kept for
 * reference). These describe the meta payload and the admin form fields.
 */
export type NoticeMeta = {
  category?: string;
  important?: string;
  deadline?: string;
  attachment?: string;
  image?: string;
  cloudinaryId?: string;
};

export const NOTICE_CATEGORIES = ["সাধারণ", "জরুরি", "ভর্তি", "ইভেন্ট", "পরীক্ষা", "ছুটি"];

export const NOTICE_FIELDS: import("@/lib/validators").FieldSpec[] = [
  { name: "title", label: "নোটিশের শিরোনাম", type: "text", required: true, placeholder: "", inTable: true },
  { name: "category", label: "ধরন", type: "select", options: NOTICE_CATEGORIES, inTable: true },
  { name: "deadline", label: "শেষ তারিখ", type: "date", inTable: true },
  { name: "attachment", label: "সংযুক্তি লিংক", type: "url", placeholder: "" },
  { name: "description", label: "বিস্তারিত", type: "textarea", required: true },
];

export const NOTICE_COLLECTION = "notices";

