"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_MANAGE, ADMIN_SYSTEM, type AdminNavItem, isActiveAdmin } from "@/lib/adminNav";
import { cn } from "@/lib/utils";

function NavLink({ item, active }: { item: AdminNavItem; active: boolean }) {
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

/**
 * The admin panel's link list. Rendered twice: inside the fixed desktop sidebar
 * and inside the mobile drawer, so both always offer the same sections.
 */
export default function AdminNav({ showBrand = true }: { showBrand?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {showBrand ? (
        <div className="border-b border-white/10 px-6 py-7">
          <p className="text-xs font-bold tracking-[.18em] text-[#f5bf43]">ROVER SCOUT</p>
          <h2 className="mt-1 text-lg leading-snug font-bold">অ্যাডমিন প্যানেল</h2>
          <p className="mt-1 text-xs text-white/55">বরগুনা পলিটেকনিক ইনস্টিটিউট</p>
        </div>
      ) : null}

      <nav className="p-4">
        <p className="mb-2 px-3 text-[0.65rem] font-bold tracking-[.16em] text-white/35 uppercase">ব্যবস্থাপনা</p>
        {ADMIN_MANAGE.map((item) => (
          <NavLink key={item.href} item={item} active={isActiveAdmin(pathname, item.href)} />
        ))}

        <p className="mt-5 mb-2 px-3 text-[0.65rem] font-bold tracking-[.16em] text-white/35 uppercase">সিস্টেম</p>
        {ADMIN_SYSTEM.map((item) => (
          <NavLink key={item.href} item={item} active={isActiveAdmin(pathname, item.href)} />
        ))}
      </nav>

      <div className="mx-4 mt-6 mb-8 rounded-xl bg-white/8 p-4 text-xs text-white/70">
        <p className="font-bold text-white">ওয়েবসাইট দেখুন</p>
        <Link href="/" className="mt-2 inline-block text-[#f5bf43] hover:underline">
          হোমপেজে যান →
        </Link>
      </div>
    </>
  );
}
