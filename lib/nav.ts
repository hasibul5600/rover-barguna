/**
 * One source of truth for the public navigation. The desktop row in Navbar and
 * the mobile drawer in Sidebar both read this, so a link can never appear in one
 * and go missing from the other.
 */
export type NavLink = {
  href: string;
  label: string;
  /** Used by the desktop row, where nine Bengali labels have to share one line. */
  short?: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "হোম" },
  { href: "/about", label: "আমাদের সম্পর্কে", short: "পরিচিতি" },
  { href: "/leadership", label: "সদস্য" },
  { href: "/alumni", label: "প্রাক্তন সদস্য" },
  { href: "/activities", label: "কার্যক্রম" },
  { href: "/events", label: "ইভেন্ট" },
  { href: "/notices", label: "নোটিশ" },
  { href: "/gallery", label: "গ্যালারি" },
  { href: "/contact", label: "যোগাযোগ" },
];

/** Home only matches exactly; every other section also owns its sub-routes. */
export function isActiveNav(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
