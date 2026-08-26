import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /robots.txt. The admin panel and API are hidden from crawlers —
 * /api/requests and /api/contact accept submissions, and the admin listings can
 * expose applicants' phone numbers and emails.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
