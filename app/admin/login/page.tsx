"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "লগইন করা যায়নি।");
      router.replace(params.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "লগইন করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e8f0ea] p-5">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[.9fr_1.1fr]">
        <div className="hidden bg-[color:var(--forest)] p-10 text-white md:block">
          <p className="text-sm font-bold tracking-[.16em] text-[#f5bf43]">ROVER SCOUT</p>
          <h1 className="mt-5 text-3xl font-bold leading-tight">ব্যবস্থাপনার<br />একটি সুন্দর জায়গা</h1>
          <p className="mt-4 text-sm leading-7 text-white/70">বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের অ্যাডমিন প্যানেলে স্বাগতম।</p>
        </div>
        <div className="p-7 sm:p-10">
          <Link href="/" className="text-sm font-bold text-[color:var(--leaf)]">← ওয়েবসাইটে ফিরুন</Link>
          <h2 className="mt-7 text-2xl font-bold text-[color:var(--forest)]">অ্যাডমিন লগইন</h2>
          <p className="mt-1 text-sm text-slate-500">আপনার অনুমোদিত তথ্য দিয়ে প্রবেশ করুন।</p>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              ইমেইল
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[color:var(--leaf)] focus:ring-2 focus:ring-emerald-100"
                placeholder="admin@example.com"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              পাসওয়ার্ড
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[color:var(--leaf)] focus:ring-2 focus:ring-emerald-100"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="btn-primary mt-2 border-0 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "প্রবেশ করা হচ্ছে..." : "লগইন করুন →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#e8f0ea] text-sm text-slate-500">লোড হচ্ছে...</main>}>
      <LoginForm />
    </Suspense>
  );
}
