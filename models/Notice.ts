// Goal: নোটিশ মডেল
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    isImportant: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model("Notice", noticeSchema);

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
};

export const NOTICE_CATEGORIES = ["সাধারণ", "জরুরি", "ভর্তি", "ইভেন্ট", "পরীক্ষা", "ছুটি"];

export const NOTICE_FIELDS: import("@/lib/validators").FieldSpec[] = [
  { name: "title", label: "নোটিশের শিরোনাম", type: "text", required: true, placeholder: "যেমন: বার্ষিক ক্যাম্প নিবন্ধন শুরু", inTable: true },
  { name: "category", label: "ধরন", type: "select", options: NOTICE_CATEGORIES, inTable: true },
  { name: "deadline", label: "শেষ তারিখ", type: "date", inTable: true },
  { name: "attachment", label: "সংযুক্তি লিংক", type: "url", placeholder: "https://…" },
  { name: "description", label: "বিস্তারিত", type: "textarea", required: true },
];

export const NOTICE_COLLECTION = "notices";

