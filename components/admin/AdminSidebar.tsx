"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { href: string; icon: string; label: string };

const MANAGE: Item[] = [
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

const SYSTEM: Item[] = [
  { href: "/admin/users", icon: "◉", label: "অ্যাকাউন্ট" },
  { href: "/admin/settings", icon: "⚙", label: "সেটিংস" },
];

function NavLink({ item, active }: { item: Item; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
        active ? "bg-white/12 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className={cn("grid size-6 place-items-center", active ? "text-[#f5bf43]" : "text-[#f5bf43]/70")}>
        {item.icon}
      </span>
      {item.label}
      {active ? <span className="ml-auto h-5 w-1 rounded-full bg-[#f5bf43]" aria-hidden /> : null}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  // Exact match for the dashboard, prefix match for the sections below it.
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="hidden min-h-screen w-65 shrink-0 bg-[#06372a] text-white lg:block">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-xs font-bold tracking-[.18em] text-[#f5bf43]">ROVER SCOUT</p>
        <h1 className="mt-1 text-lg leading-snug font-bold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-1 text-xs text-white/55">বরগুনা পলিটেকনিক ইনস্টিটিউট</p>
      </div>

      <nav className="p-4">
        <p className="mb-2 px-3 text-[0.65rem] font-bold tracking-[.16em] text-white/35 uppercase">ব্যবস্থাপনা</p>
        {MANAGE.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <p className="mt-5 mb-2 px-3 text-[0.65rem] font-bold tracking-[.16em] text-white/35 uppercase">সিস্টেম</p>
        {SYSTEM.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="mx-4 mt-6 mb-8 rounded-xl bg-white/8 p-4 text-xs text-white/70">
        <p className="font-bold text-white">ওয়েবসাইট দেখুন</p>
        <Link href="/" className="mt-2 inline-block text-[#f5bf43] hover:underline">
          হোমপেজে যান →
        </Link>
      </div>
    </aside>
  );
}
