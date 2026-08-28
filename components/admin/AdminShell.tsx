"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The login screen is the one admin route that gets no chrome.
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f5f7f5]">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <header className="flex min-h-20 items-center justify-between gap-3 border-b border-emerald-950/7 bg-white px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <AdminMobileNav />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[.14em] text-[color:var(--leaf)]">ADMINISTRATION</p>
              <p className="mt-0.5 truncate font-bold text-[color:var(--forest)]">রোভার স্কাউট ব্যবস্থাপনা</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm font-semibold text-slate-500 hover:text-[color:var(--leaf)] sm:block"
            >
              সাইট দেখুন
            </Link>
            <LogoutButton />
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e7f2eb] font-bold text-[color:var(--forest)]">
              অ
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
