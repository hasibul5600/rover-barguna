import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export default async function MemberPortal() {
  const session = await getMemberSession();
  if (!session) redirect("/member/login?next=/member");
  return <main className="container-x py-10 sm:py-16"><section className="overflow-hidden rounded-3xl bg-[color:var(--forest)] p-7 text-white shadow-xl sm:p-10"><p className="text-sm font-bold tracking-[.16em] text-[#f5bf43]">MEMBER PORTAL</p><h1 className="mt-3 text-3xl font-bold">স্বাগতম, {session.name}</h1><p className="mt-3 text-white/75">আপনি সদস্য পোর্টালে লগইন করেছেন। সদস্যদের জন্য নির্ধারিত তথ্য ও কার্যক্রম এখানে যুক্ত করা হবে।</p><div className="mt-7 flex flex-wrap gap-3"><a href="/notices" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[color:var(--forest)]">নোটিশ দেখুন</a><form action="/api/member/auth/logout" method="post"><button className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold">লগআউট</button></form></div></section><section className="mt-6 rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-[color:var(--forest)]">আপনার অ্যাকাউন্ট</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><dt className="text-slate-500">নাম</dt><dd className="mt-1 font-bold">{session.name}</dd></div><div className="rounded-xl bg-slate-50 p-4"><dt className="text-slate-500">Gmail</dt><dd className="mt-1 font-bold">{session.email}</dd></div></dl></section></main>;
}
