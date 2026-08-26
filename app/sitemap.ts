import type { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/site";

/** Served at /sitemap.xml. Public pages only — admin routes are never indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp for the whole run so every entry agrees.
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
