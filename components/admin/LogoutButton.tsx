"use client";

import { useRouter } from "next/navigation";

/**
 * `className` defaults to the header's styling (hidden on phones, where the
 * mobile menu handles it). The accounts page passes its own so the button is
 * always visible there.
 */
export default function LogoutButton({
  className = "hidden text-sm font-bold text-slate-500 hover:text-red-600 sm:block",
  children = "লগআউট",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
