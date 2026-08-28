"use client";

import AdminNav from "@/components/admin/AdminNav";

/** Always-on sidebar for wide screens. Phones get the drawer in AdminMobileNav. */
export default function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-65 shrink-0 bg-[#06372a] text-white lg:block">
      <AdminNav />
    </aside>
  );
}
