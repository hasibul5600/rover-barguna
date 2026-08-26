import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/layout/SiteShell";
import { absoluteUrl, BRAND_COLOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "@/styles/custom.css";

export const metadata: Metadata = {
  // metadataBase turns every relative URL below (and in each page's own metadata)
  // into an absolute one — required for Open Graph tags to resolve at all.
  metadataBase: new URL(SITE_URL),
  // A plain string, not a template: every public page already ships a complete
  // title of its own (e.g. "নোটিশ | রোভার স্কাউট গ্রুপ"), so a template here
  // would append the group name a second time.
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "রোভার স্কাউট",
    "বরগুনা পলিটেকনিক ইন্সটিটিউট",
    "রোভার স্কাউট গ্রুপ",
    "বাংলাদেশ স্কাউটস",
    "Rover Scout Barguna",
    "Barguna Polytechnic Institute",
  ],
  alternates: { canonical: "/" },
  // Social link previews — the primary way this site gets shared (Facebook, WhatsApp).
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    locale: "bn_BD",
    images: [
      {
        url: "/images/rover-team.jpg",
        width: 1600,
        height: 1200,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/rover-team.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior tells Next the smooth scrolling in globals.css is
    // intentional, so it doesn't warn and doesn't fight it on route changes.
    <html lang="bn" dir="ltr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
