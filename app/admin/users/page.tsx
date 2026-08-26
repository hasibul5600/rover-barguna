import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { getAdminSession, isAuthConfigured } from "@/lib/auth";
import { cn, formatBnDateTime, initial } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Admin accounts. This site authenticates against a single account defined by
 * ADMIN_EMAIL / ADMIN_PASSWORD in the environment (see lib/adminAuth.ts) — there
 * is no user collection, so there is nothing here to create or delete. The page
 * shows the configured account and explains how to change it.
 */
export default async function AdminUsersPage() {
  const session = await getAdminSession();
  const email = process.env.ADMIN_EMAIL || "";
  const ready = isAuthConfigured();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">অ্যাডমিন অ্যাকাউন্ট</h2>
          <p className="mt-1 text-sm text-slate-500">কে এই প্যানেলে প্রবেশ করতে পারে তার তালিকা।</p>
        </div>
        <Link href="/admin/settings" className="btn-outline text-sm">
          সেটিংস দেখুন →
        </Link>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-emerald-950/6 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-[color:var(--forest)]">অনুমোদিত অ্যাকাউন্ট</h3>
            <span className="badge badge-slate">১টি</span>
          </div>

          {ready ? (
            <div className="flex flex-wrap items-center gap-4 px-5 py-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[color:var(--forest)] text-xl font-bold text-[#f5bf43]">
                {initial(email)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-bold break-all text-[color:var(--forest)]">{email}</p>
                <p className="mt-0.5 text-sm text-slate-500">সুপার অ্যাডমিন · সম্পূর্ণ অ্যাক্সেস</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="badge badge-green">
                    <span className="live-dot" aria-hidden />
                    সক্রিয়
                  </span>
                  {session?.email === email ? <span className="badge badge-gold">এটি আপনি</span> : null}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <LogoutButton className="btn-outline w-full text-sm !border-red-200 !text-red-600 hover:!border-red-300 hover:!bg-red-50 sm:w-auto">
                  লগআউট করুন
                </LogoutButton>
              </div>
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="font-bold text-red-600">কোনো অ্যাকাউন্ট কনফিগার করা নেই</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.local</code> ফাইলে ADMIN_EMAIL,
                ADMIN_PASSWORD ও ADMIN_SESSION_SECRET যোগ করে সার্ভার আবার চালু করুন।
              </p>
            </div>
          )}
        </article>

        <div className="grid content-start gap-6">
          <article className="rounded-2xl border border-emerald-950/6 bg-white p-5">
            <h3 className="font-bold text-[color:var(--forest)]">সেশনের তথ্য</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">অবস্থা</dt>
                <dd className={cn("font-semibold", session ? "text-emerald-700" : "text-red-600")}>
                  {session ? "লগইন করা আছে" : "লগইন করা নেই"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">মেয়াদ শেষ</dt>
                <dd className="text-right font-semibold text-slate-700">
                  {session ? formatBnDateTime(session.exp * 1000) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">সেশনের দৈর্ঘ্য</dt>
                <dd className="font-semibold text-slate-700">৮ ঘণ্টা</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-bold text-amber-800">অ্যাকাউন্ট পরিবর্তন করতে</p>
            <p className="mt-2 text-sm leading-6 text-amber-900/80">
              এই সাইটে সদস্যদের জন্য আলাদা লগইন নেই — শুধু একটি অ্যাডমিন অ্যাকাউন্ট, যা সার্ভারের এনভায়রনমেন্ট
              ভেরিয়েবল থেকে আসে। ইমেইল বা পাসওয়ার্ড বদলাতে সার্ভারে{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">.env.local</code> ফাইলের ADMIN_EMAIL ও
              ADMIN_PASSWORD পরিবর্তন করে সার্ভার পুনরায় চালু করুন।
            </p>
            <p className="mt-3 text-sm leading-6 text-amber-900/80">
              ADMIN_SESSION_SECRET বদলালে চালু থাকা সব লগইন সাথে সাথে বাতিল হয়ে যায়।
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
