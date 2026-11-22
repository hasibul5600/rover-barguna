import Link from "next/link";
import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/memberAuth";

const messages: Record<string, string> = { config: "Google লগইন এখনো কনফিগার করা হয়নি।", "not-member": "এই Gmail ঠিকানাটি অনুমোদিত সদস্য তালিকায় নেই।", signin: "Google দিয়ে লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।" };

export default async function MemberLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  if (await getMemberSession()) redirect("/member");
  const { error, next } = await searchParams;
  const nextQuery = next?.startsWith("/member") ? `?next=${encodeURIComponent(next)}` : "";
  return <main className="grid min-h-[70vh] place-items-center px-5 py-12"><section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10"><p className="text-sm font-bold tracking-[.16em] text-[color:var(--leaf)]">ROVER SCOUT</p><h1 className="mt-4 text-3xl font-bold text-[color:var(--forest)]">সদস্য পোর্টাল</h1><p className="mt-3 text-slate-600">আপনার সদস্য তালিকাভুক্ত Gmail অ্যাকাউন্ট দিয়ে নিরাপদে প্রবেশ করুন।</p>{error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{messages[error] || messages.signin}</p>}<Link href={`/api/member/auth/login${nextQuery}`} className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"><span className="grid size-6 place-items-center rounded-full bg-[#4285f4] text-xs font-black text-white">G</span> Gmail দিয়ে লগইন করুন</Link><Link href="/" className="mt-6 inline-block text-sm font-bold text-[color:var(--leaf)]">← ওয়েবসাইটে ফিরুন</Link></section></main>;
}
