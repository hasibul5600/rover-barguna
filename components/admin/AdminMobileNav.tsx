"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

/**
 * The admin panel's navigation on phones and tablets. AdminSidebar is hidden
 * below lg, so without this there was no way to reach another section once you
 * opened one — only the browser back button.
 */
export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // createPortal needs document.body, which only exists after hydration.
  useEffect(() => setMounted(true), []);

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

  const drawer = (
    <div className="fixed inset-0 z-100 lg:hidden">
      <div className="absolute inset-0 animate-fade bg-slate-950/50" onClick={() => setOpen(false)} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="অ্যাডমিন মেনু"
        className="absolute inset-y-0 left-0 flex w-[min(17rem,84vw)] flex-col overflow-y-auto bg-[#06372a] text-white shadow-2xl"
        style={{ animation: "rise .28s cubic-bezier(.22,1,.36,1) both" }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="মেনু বন্ধ করুন"
          className="absolute top-5 right-4 grid size-9 place-items-center rounded-full text-2xl leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
        <AdminNav />

        {/* The header's লগআউট is `hidden sm:block`, so on a phone this drawer is
            the only place it can be reached. */}
        <div className="mt-auto border-t border-white/10 p-4">
          <LogoutButton className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/15 hover:text-white" />
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="অ্যাডমিন মেনু খুলুন"
        aria-expanded={open}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-950/10 text-[color:var(--forest)] transition hover:bg-emerald-950/5 lg:hidden"
      >
        <span className="grid gap-1">
          <span className="block h-0.5 w-5 rounded bg-current" />
          <span className="block h-0.5 w-5 rounded bg-current" />
          <span className="block h-0.5 w-5 rounded bg-current" />
        </span>
      </button>

      {mounted && open ? createPortal(drawer, document.body) : null}
    </>
  );
}
