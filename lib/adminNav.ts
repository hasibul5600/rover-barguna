/**
 * One source of truth for the admin panel's navigation, shared by the desktop
 * sidebar and the mobile drawer so a section can never appear in only one.
 */
export type AdminNavItem = { href: string; icon: string; label: string };

export const ADMIN_MANAGE: AdminNavItem[] = [
  { href: "/admin", icon: "▦", label: "ড্যাশবোর্ড" },
  { href: "/admin/members", icon: "♙", label: "সদস্য" },
  { href: "/admin/exmembers", icon: "⚐", label: "প্রাক্তন সদস্য" },
  { href: "/admin/requests", icon: "◌", label: "আবেদনসমূহ" },
  { href: "/admin/events", icon: "◷", label: "ইভেন্ট" },
  { href: "/admin/activities", icon: "✦", label: "কার্যক্রম" },
  { href: "/admin/notices", icon: "▤", label: "নোটিশ" },
  { href: "/admin/gallery", icon: "▧", label: "গ্যালারি" },
  { href: "/admin/messages", icon: "✉", label: "বার্তা" },
];

export const ADMIN_SYSTEM: AdminNavItem[] = [
  { href: "/admin/users", icon: "◉", label: "অ্যাকাউন্ট" },
  { href: "/admin/settings", icon: "⚙", label: "সেটিংস" },
];

/** Exact match for the dashboard, prefix match for the sections below it. */
export function isActiveAdmin(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
