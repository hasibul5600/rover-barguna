"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { NAV_LINKS, isActiveNav } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Deepen the header shadow once the page scrolls, so it separates from content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[#f8f7f0]/95 backdrop-blur transition-shadow ${
        scrolled ? "border-emerald-950/8 shadow-[0_6px_20px_rgb(6_55_42_/_0.07)]" : "border-emerald-950/5"
      }`}
    >
      <nav className="container-x flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="রোভার স্কাউট লোগো"
            width={46}
            height={46}
            className="shrink-0 rounded-full ring-2 ring-[#f5bf43]/60"
            priority
          />
          <span className="text-sm font-bold leading-tight text-[color:var(--forest)] sm:text-base">
            বরগুনা পলিটেকনিক ইনস্টিটিউট
            <br />
            রোভার স্কাউট গ্রুপ
          </span>
        </Link>

        {/* Nine links, the two-line institute name and two buttons only fit from
            xl up. Below that the drawer in <Sidebar /> takes over — at lg the row
            used to squeeze until "আমাদের সম্পর্কে" wrapped onto two lines. */}
        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map(({ href, label, short }) => {
            const active = isActiveNav(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-2 py-2 text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? "text-[color:var(--forest)]"
                      : "text-slate-600 hover:bg-emerald-950/5 hover:text-[color:var(--leaf)]"
                  }`}
                >
                  {short || label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[#f5bf43]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="hidden rounded-full px-3 py-2 text-sm font-bold text-[color:var(--forest)] transition hover:bg-emerald-950/5 sm:block"
          >
            লগইন
          </Link>
          <Link href="/join" className="btn-primary hidden text-sm whitespace-nowrap sm:inline-flex">
            সদস্য হোন →
          </Link>
          <Sidebar />
        </div>
      </nav>
    </header>
  );
}
