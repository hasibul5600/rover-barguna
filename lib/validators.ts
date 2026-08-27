/**
 * Validation for the public forms (contact + join). Returns Bengali messages so
 * routes can hand the result straight back to the browser.
 */

import { toBn } from "@/lib/utils";

export type FieldErrors = Record<string, string>;

export type Validated<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Bangladeshi mobile numbers, with or without +88.
const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

/**
 * The forms are Bengali and the placeholders show Bengali numerals, so people type
 * ০১৭…. Fold Bengali (U+09E6–U+09EF) and Arabic-Indic digits to ASCII before
 * pattern-matching.
 */
export function normalizeDigits(value: string) {
  return value.replace(/[০-৯٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x09e6 ? 0x09e6 : 0x0660;
    return String(code - base);
  });
}

/** Strip separators and Bengali numerals so a phone number can be pattern-matched. */
function normalizePhone(value: string) {
  return normalizeDigits(value).replace(/[\s\-()]/g, "");
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function required(errors: FieldErrors, key: string, value: string, label: string, min = 2) {
  if (!value) {
    errors[key] = `${label} লিখুন।`;
  } else if (value.length < min) {
    errors[key] = `${label} কমপক্ষে ${toBn(min)} অক্ষরের হতে হবে।`;
  }
}

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function validateContact(body: unknown): Validated<ContactInput> {
  const raw = (body ?? {}) as Record<string, unknown>;
  const data: ContactInput = {
    name: text(raw.name),
    email: text(raw.email).toLowerCase(),
    phone: normalizePhone(text(raw.phone)),
    subject: text(raw.subject),
    message: text(raw.message),
  };

  const errors: FieldErrors = {};
  required(errors, "name", data.name, "আপনার নাম");
  required(errors, "subject", data.subject, "বিষয়", 3);
  required(errors, "message", data.message, "আপনার বার্তা", 10);

  if (!data.email) errors.email = "ইমেইল লিখুন।";
  else if (!EMAIL.test(data.email)) errors.email = "সঠিক ইমেইল ঠিকানা দিন।";

  // Phone is optional here, but must look real when provided.
  if (data.phone && !PHONE.test(data.phone)) {
    errors.phone = "সঠিক মোবাইল নম্বর দিন (যেমন ০১৭xxxxxxxx)।";
  }

  if (data.message.length > 2000) errors.message = "বার্তা ২০০০ অক্ষরের মধ্যে রাখুন।";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export type JoinInput = {
  name: string;
  email: string;
  phone: string;
  department: string;
  session: string;
  roll: string;
  bloodGroup: string;
  reason: string;
};

/**
 * Written in Latin letters on purpose — Bangladeshi medical forms, donor cards and
 * hospital records all use "A+"/"O-", never a Bengali transliteration, so matching
 * that keeps the value usable when the group organises a blood drive.
 */
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const DEPARTMENTS = [
  "কম্পিউটার",
  "সিভিল",
  "ইলেকট্রিক্যাল",
  "মেকানিক্যাল",
  "ইলেকট্রনিক্স",
  "পাওয়ার",
  "অন্যান্য",
];

export function validateJoin(body: unknown): Validated<JoinInput> {
  const raw = (body ?? {}) as Record<string, unknown>;
  const data: JoinInput = {
    name: text(raw.name),
    email: text(raw.email).toLowerCase(),
    phone: normalizePhone(text(raw.phone)),
    department: text(raw.department),
    session: text(raw.session),
    roll: text(raw.roll),
    bloodGroup: text(raw.bloodGroup),
    reason: text(raw.reason),
  };

  const errors: FieldErrors = {};
  required(errors, "name", data.name, "আপনার পূর্ণ নাম", 3);
  required(errors, "session", data.session, "সেশন", 4);
  required(errors, "roll", data.roll, "রোল নম্বর", 3);

  if (!data.email) errors.email = "ইমেইল লিখুন।";
  else if (!EMAIL.test(data.email)) errors.email = "সঠিক ইমেইল ঠিকানা দিন।";

  if (!data.phone) errors.phone = "মোবাইল নম্বর লিখুন।";
  else if (!PHONE.test(data.phone)) errors.phone = "সঠিক মোবাইল নম্বর দিন (যেমন ০১৭xxxxxxxx)।";

  if (!data.department) errors.department = "বিভাগ নির্বাচন করুন।";
  else if (!DEPARTMENTS.includes(data.department)) errors.department = "তালিকা থেকে বিভাগ নির্বাচন করুন।";

  // Optional — but a free-typed group is worse than none, so reject anything off-list.
  if (data.bloodGroup && !BLOOD_GROUPS.includes(data.bloodGroup)) {
    errors.bloodGroup = "তালিকা থেকে রক্তের গ্রুপ নির্বাচন করুন।";
  }

  if (data.reason && data.reason.length > 1000) errors.reason = "১০০০ অক্ষরের মধ্যে লিখুন।";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Collapse field errors into one sentence for toast-style display. */
export function firstError(errors: FieldErrors) {
  return Object.values(errors)[0] || "তথ্য সঠিকভাবে পূরণ করুন।";
}

/**
 * Declarative description of one editable field. The admin form renderer
 * (components/admin/FormFields.tsx) builds inputs from these, and each model in
 * models/ exports the spec for its own collection.
 */
export type FieldSpec = {
  /** Key inside ContentItem.meta, or "title"/"description"/"status" for core columns. */
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "email" | "tel" | "number" | "url";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  /** Show this field as a column in the admin table. */
  inTable?: boolean;
  help?: string;
};

/** Validate a value bag against a field spec list. */
export function validateFields(fields: FieldSpec[], values: Record<string, unknown>): Validated<Record<string, string>> {
  const data: Record<string, string> = {};
  const errors: FieldErrors = {};

  for (const field of fields) {
    const value = text(values[field.name]);
    data[field.name] = value;

    if (field.required && !value) {
      errors[field.name] = `${field.label} প্রয়োজন।`;
      continue;
    }
    if (!value) continue;

    if (field.type === "email" && !EMAIL.test(value.toLowerCase())) {
      errors[field.name] = "সঠিক ইমেইল ঠিকানা দিন।";
    }
    if (field.type === "tel" && !PHONE.test(normalizePhone(value))) {
      errors[field.name] = "সঠিক মোবাইল নম্বর দিন।";
    }
    if (field.type === "select" && field.options && !field.options.includes(value)) {
      errors[field.name] = `${field.label} তালিকা থেকে নির্বাচন করুন।`;
    }
    if (field.type === "date" && Number.isNaN(new Date(value).getTime())) {
      errors[field.name] = "সঠিক তারিখ দিন।";
    }
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
