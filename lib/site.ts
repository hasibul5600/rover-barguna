/**
 * Canonical site origin, used by metadata, sitemap, robots and the web manifest.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL            — set this once a real domain is bought.
 *   2. VERCEL_PROJECT_PRODUCTION_URL   — the project's stable production domain.
 *   3. VERCEL_URL                      — the per-deployment URL (preview builds).
 *   4. http://localhost:3000           — local development.
 *
 * Vercel injects 2 and 3 automatically, so no configuration is needed to deploy.
 * They are server-only vars (no NEXT_PUBLIC_ prefix), which is fine — every caller
 * here runs on the server.
 */

const FALLBACK = "http://localhost:3000";

function normalise(value: string) {
  // Vercel supplies bare hostnames ("my-app.vercel.app"), so add the scheme when
  // it's missing, and drop any trailing slash so `${SITE_URL}/about` stays clean.
  const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

function resolveSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  return candidate ? normalise(candidate) : FALLBACK;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "বরগুনা পলিটেকনিক ইন্সটিটিউট রোভার স্কাউট গ্রুপ";
export const SITE_SHORT_NAME = "রোভার স্কাউট বরগুনা";
export const SITE_DESCRIPTION = "সেবা, নেতৃত্ব ও ভ্রাতৃত্বের পথে এগিয়ে চলি।";

/** Brand green — also the browser theme colour on mobile. */
export const BRAND_COLOR = "#073b2c";

/** Absolute URL for a site-relative path. Needed for OG tags and sitemap entries. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Every publicly indexable route. Admin and API paths are deliberately absent —
 * `app/robots.ts` disallows them and `app/sitemap.ts` only maps this list.
 * `priority` is relative: the homepage first, then the pages that change often.
 */
export const PUBLIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.8 },
  { path: "/activities", changeFrequency: "monthly", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.9 },
  { path: "/notices", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
  { path: "/leadership", changeFrequency: "yearly", priority: 0.7 },
  { path: "/alumni", changeFrequency: "yearly", priority: 0.6 },
  { path: "/join", changeFrequency: "yearly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
] as const;
