"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { FormNotice, Select, Textarea } from "@/components/ui/Input";
import { DEPARTMENTS, type FieldErrors } from "@/lib/validators";

const BLANK = { name: "", email: "", phone: "", department: "", session: "", roll: "", reason: "" };

/** Public membership application. Posts to /api/requests, landing in the admin panel. */
export default function JoinForm() {
  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (name: keyof typeof BLANK) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    setErrors((current) => (current[name] ? { ...current, [name]: "" } : current));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.errors || {});
        setNotice({ tone: "error", text: data.message || "আবেদন জমা দেওয়া যায়নি।" });
        return;
      }

      setValues(BLANK);
      setErrors({});
      setDone(true);
    } catch {
      setNotice({ tone: "error", text: "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।" });
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="grid place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-14 text-center animate-pop">
        <span className="grid size-14 place-items-center rounded-2xl bg-white text-2xl" aria-hidden>
          ✓
        </span>
        <h3 className="mt-4 text-xl font-bold text-[color:var(--forest)]">আবেদন জমা হয়েছে!</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-emerald-800">
          ধন্যবাদ। আমাদের দল আপনার আবেদন পর্যালোচনা করে দেওয়া মোবাইল নম্বর বা ইমেইলে যোগাযোগ করবে।
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          আরেকটি আবেদন জমা দিন
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {notice ? <FormNotice tone={notice.tone}>{notice.text}</FormNotice> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="পূর্ণ নাম"
          required
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          placeholder="যেমন: মোঃ রিফাত হোসেন"
          disabled={busy}
          autoComplete="name"
        />
        <Select
          label="বিভাগ"
          required
          options={DEPARTMENTS}
          value={values.department}
          onChange={set("department")}
          error={errors.department}
          disabled={busy}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="সেশন"
          required
          value={values.session}
          onChange={set("session")}
          error={errors.session}
          placeholder="২০২৩-২৪"
          disabled={busy}
        />
        <Input
          label="রোল নম্বর"
          required
          value={values.roll}
          onChange={set("roll")}
          error={errors.roll}
          placeholder="১২৩৪৫৬"
          disabled={busy}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="মোবাইল"
          type="tel"
          required
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          placeholder="০১৭xxxxxxxx"
          disabled={busy}
          autoComplete="tel"
        />
        <Input
          label="ইমেইল"
          type="email"
          required
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          placeholder="name@example.com"
          disabled={busy}
          autoComplete="email"
        />
      </div>

      <Textarea
        label="কেন যোগ দিতে চান?"
        rows={5}
        value={values.reason}
        onChange={set("reason")}
        error={errors.reason}
        placeholder="স্কাউটিংয়ে আপনার আগ্রহ ও প্রত্যাশা সম্পর্কে লিখুন…"
        help="ঐচ্ছিক, তবে আপনার আবেদন আরও জোরালো করে।"
        disabled={busy}
      />

      <Button type="submit" loading={busy} size="lg" className="justify-self-start">
        {busy ? "জমা হচ্ছে…" : "আবেদন জমা দিন →"}
      </Button>
    </form>
  );
}
