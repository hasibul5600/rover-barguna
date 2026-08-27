import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import connectDb from "@/lib/db";
import { loadAdminStats } from "@/lib/stats";
import { cn, formatBnDateTime, toBn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Configuration and integration health. Everything here is read-only: the site's
 * settings live in environment variables, so this page reports whether each one
 * is present rather than letting them be edited from the browser. Values are
 * never rendered — only whether they are configured.
 */

type Check = { label: string; ok: boolean; detail: string };

async function checkDatabase(): Promise<Check> {
  if (!process.env.MONGODB_URI) {
    return { label: "MongoDB সংযোগ", ok: false, detail: "MONGODB_URI সেট করা নেই।" };
  }
  try {
    await connectDb();
    return { label: "MongoDB সংযোগ", ok: true, detail: "ডেটাবেস সংযুক্ত ও সক্রিয়।" };
  } catch (error) {
    console.error("Settings DB check failed:", error);
    return { label: "MongoDB সংযোগ", ok: false, detail: "সংযোগ করা যাচ্ছে না — সংযোগ স্ট্রিং পরীক্ষা করুন।" };
  }
}

function configured(...keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]));
}

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  const [database, stats] = await Promise.all([
    checkDatabase(),
    loadAdminStats().catch(() => null),
  ]);

  const checks: Check[] = [
    database,
    {
      label: "Cloudinary ছবি আপলোড",
      ok: configured("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"),
      detail: configured("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
        ? `ক্লাউড: ${process.env.CLOUDINARY_CLOUD_NAME}`
        : "তিনটি CLOUDINARY_* ভেরিয়েবল প্রয়োজন।",
    },
    {
      label: "অ্যাডমিন লগইন",
      ok: configured("ADMIN_EMAIL", "ADMIN_PASSWORD"),
      detail: configured("ADMIN_EMAIL", "ADMIN_PASSWORD")
        ? "ইমেইল ও পাসওয়ার্ড কনফিগার করা আছে।"
        : "ADMIN_EMAIL ও ADMIN_PASSWORD সেট করুন।",
    },
    {
      label: "সেশন স্বাক্ষর",
      ok: configured("ADMIN_SESSION_SECRET"),
      detail: configured("ADMIN_SESSION_SECRET")
        ? "লগইন কুকি HMAC দিয়ে স্বাক্ষরিত।"
        : "ADMIN_SESSION_SECRET ছাড়া লগইন কাজ করবে না।",
    },
  ];

  const healthy = checks.filter((check) => check.ok).length;

  const contentRows = stats
    ? ([
        ["সদস্য", stats.members, "/admin/members"],
        ["প্রাক্তন সদস্য", stats.exmembers, "/admin/exmembers"],
        ["আবেদন", stats.requests, "/admin/requests"],
        ["ইভেন্ট", stats.events, "/admin/events"],
        ["কার্যক্রম", stats.activities, "/admin/activities"],
        ["নোটিশ", stats.notices, "/admin/notices"],
        ["গ্যালারি ছবি", stats.gallery, "/admin/gallery"],
        ["বার্তা", stats.messages, "/admin/messages"],
      ] as const)
    : [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">সেটিংস</h2>
          <p className="mt-1 text-sm text-slate-500">
            সাইটের কনফিগারেশন ও সংযোগের অবস্থা। এখানকার মান পরিবর্তন করতে সার্ভারের{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.local</code> ফাইল সম্পাদনা করুন।
          </p>
        </div>
        <span className={cn("badge", healthy === checks.length ? "badge-green" : "badge-amber")}>
          {toBn(healthy)}/{toBn(checks.length)} সংযোগ ঠিক আছে
        </span>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-emerald-950/6 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-[color:var(--forest)]">সংযোগের অবস্থা</h3>
            <p className="text-xs text-slate-500">গোপন মান কখনো এখানে দেখানো হয় না — শুধু সেট করা আছে কি না।</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {checks.map((check) => (
              <li key={check.label} className="flex items-start gap-3 px-5 py-4">
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                    check.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  )}
                  aria-hidden
                >
                  {check.ok ? "✓" : "!"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-700">{check.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{check.detail}</p>
                </div>
                <span className={cn("badge ml-auto shrink-0", check.ok ? "badge-green" : "badge-red")}>
                  {check.ok ? "সক্রিয়" : "সমস্যা"}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <div className="grid content-start gap-6">
          <article className="rounded-2xl border border-emerald-950/6 bg-white p-5">
            <h3 className="font-bold text-[color:var(--forest)]">বর্তমান সেশন</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">লগইন করা আছে</dt>
                <dd className="font-semibold break-all text-slate-700">{session?.email || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">ভূমিকা</dt>
                <dd className="font-semibold text-slate-700">অ্যাডমিন</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">মেয়াদ শেষ</dt>
                <dd className="text-right font-semibold text-slate-700">
                  {session ? formatBnDateTime(session.exp * 1000) : "—"}
                </dd>
              </div>
            </dl>
            <Link href="/admin/users" className="btn-outline mt-5 w-full text-sm">
              অ্যাকাউন্ট বিবরণ →
            </Link>
          </article>

          <article className="rounded-2xl bg-[color:var(--forest)] p-6 text-white">
            <p className="text-sm font-bold text-[#f5bf43]">মনে রাখুন</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/85">
              <li>• পাসওয়ার্ড ও API কী কেবল সার্ভারে থাকে, ব্রাউজারে কখনো পাঠানো হয় না।</li>
              <li>• লগইন সেশন ৮ ঘণ্টা পর নিজে থেকেই শেষ হয়ে যায়।</li>
              <li>• গ্যালারির ছবি Cloudinary-তে থাকে; মুছলে সেখান থেকেও মুছে যায়।</li>
            </ul>
          </article>
        </div>
      </section>

      {contentRows.length ? (
        <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-950/6 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-[color:var(--forest)]">কনটেন্ট সারসংক্ষেপ</h3>
            <p className="text-xs text-slate-500">ডেটাবেসে বর্তমানে যা সংরক্ষিত আছে</p>
          </div>
          <ul className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
            {contentRows.map(([label, value, href]) => (
              <li key={label} className="bg-white">
                <Link href={href} className="flex items-center justify-between px-5 py-4 transition hover:bg-[#fafcfa]">
                  <span className="text-sm font-semibold text-slate-600">{label}</span>
                  <span className="text-lg font-bold text-[color:var(--forest)] tabular-nums">{toBn(value)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
