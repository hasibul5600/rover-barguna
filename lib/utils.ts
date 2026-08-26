/** Small shared helpers. Kept dependency-free so they work on both server and client. */

/** Join conditional class names. Falsy values are dropped. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Render a number with Bengali digits, e.g. 128 -> "১২৮". */
export function toBn(value: number | string) {
  return String(value).replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function asDate(value: string | number | Date | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "১৫ মার্চ ২০২৬" */
export function formatBnDate(value: string | number | Date | null | undefined) {
  const date = asDate(value);
  if (!date) return "—";
  return `${toBn(date.getDate())} ${BN_MONTHS[date.getMonth()]} ${toBn(date.getFullYear())}`;
}

/** "১৫ মার্চ ২০২৬, ৪:২০ PM" */
export function formatBnDateTime(value: string | number | Date | null | undefined) {
  const date = asDate(value);
  if (!date) return "—";
  const hours = date.getHours();
  const suffix = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${formatBnDate(date)}, ${toBn(hour12)}:${toBn(minutes)} ${suffix}`;
}

/** "এইমাত্র", "৫ মিনিট আগে", "৩ দিন আগে" — falls back to a date past a week. */
export function timeAgoBn(value: string | number | Date | null | undefined) {
  const date = asDate(value);
  if (!date) return "—";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "এইমাত্র";
  if (seconds < 3600) return `${toBn(Math.floor(seconds / 60))} মিনিট আগে`;
  if (seconds < 86400) return `${toBn(Math.floor(seconds / 3600))} ঘণ্টা আগে`;
  if (seconds < 604800) return `${toBn(Math.floor(seconds / 86400))} দিন আগে`;
  return formatBnDate(date);
}

/** Whether a date is in the future — used to split upcoming vs past events. */
export function isUpcoming(value: string | number | Date | null | undefined) {
  const date = asDate(value);
  return date ? date.getTime() >= Date.now() : false;
}

/** Cut long text on a word boundary and add an ellipsis. */
export function truncate(text: string, limit = 140) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Bengali label for a ContentItem status value. */
export function statusLabel(status?: string) {
  return status === "draft" ? "খসড়া" : status === "archived" ? "সংরক্ষিত" : "প্রকাশিত";
}

/** First letter of a name, for avatar circles. */
export function initial(name?: string) {
  return (name || "?").trim().charAt(0) || "?";
}
