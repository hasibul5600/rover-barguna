"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links: Array<[string, string]> = [
  ["/", "হোম"],
  ["/about", "আমাদের সম্পর্কে"],
  ["/activities", "কার্যক্রম"],
  ["/events", "ইভেন্ট"],
  ["/notices", "নোটিশ"],
  ["/leadership", "নেতৃত্ব"],
  ["/gallery", "গ্যালারি"],
  ["/contact", "যোগাযোগ"],
];

/**
 * Slide-in navigation for small screens. The desktop navbar hides its links
 * below lg, so without this there is no way to move around on a phone.
 */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Any navigation should dismiss the drawer.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="মেনু খুলুন"
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-xl border border-emerald-950/10 text-[color:var(--forest)] transition hover:bg-emerald-950/5 lg:hidden"
      >
        <span className="grid gap-1">
          <span className="block h-0.5 w-5 rounded bg-current" />
          <span className="block h-0.5 w-5 rounded bg-current" />
          <span className="block h-0.5 w-5 rounded bg-current" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div className="absolute inset-0 animate-fade bg-slate-950/45 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="প্রধান মেনু"
            className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-[color:var(--cream)] shadow-2xl"
            style={{ animation: "rise .28s cubic-bezier(.22,1,.36,1) both" }}
          >
            <div className="flex items-center justify-between border-b border-emerald-950/8 px-5 py-4">
              <p className="font-bold text-[color:var(--forest)]">মেনু</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="মেনু বন্ধ করুন"
                className="grid size-9 place-items-center rounded-full text-2xl leading-none text-slate-400 transition hover:bg-emerald-950/5 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              {links.map(([href, label]) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-[color:var(--forest)] text-white"
                        : "text-slate-700 hover:bg-emerald-950/5 hover:text-[color:var(--forest)]"
                    }`}
                  >
                    {label}
                    <span className={active ? "text-[#f5bf43]" : "text-slate-300"}>→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-emerald-950/8 p-4">
              <Link href="/join" className="btn-primary w-full text-sm">
                সদস্য হোন →
              </Link>
              <Link
                href="/admin/login"
                className="mt-2 block rounded-xl px-4 py-2.5 text-center text-sm font-bold text-slate-500 transition hover:bg-emerald-950/5"
              >
                অ্যাডমিন লগইন
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
