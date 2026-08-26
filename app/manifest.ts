import type { MetadataRoute } from "next";
import { BRAND_COLOR, SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

/**
 * Served at /manifest.webmanifest — lets the site be installed to a phone's home
 * screen and sets the browser chrome colour on Android.
 *
 * `logo.png` is 540x540, which covers both the maskable and the "any" purpose;
 * dedicated 192/512 exports can be dropped in later without touching this file.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f0",
    theme_color: BRAND_COLOR,
    lang: "bn",
    dir: "ltr",
    categories: ["education", "social"],
    icons: [
      { src: "/logo.png", sizes: "540x540", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "540x540", type: "image/png", purpose: "maskable" },
    ],
  };
}
