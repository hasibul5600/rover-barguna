"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { FormNotice, Textarea } from "@/components/ui/Input";
import type { FieldErrors } from "@/lib/validators";

const BLANK = { name: "", email: "", phone: "", subject: "", message: "" };

/** Public contact form. Posts to /api/contact, which files it under বার্তা in admin. */
export default function ContactForm() {
  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (name: keyof typeof BLANK) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    // Clear the field's error as soon as the user starts fixing it.
    setErrors((current) => (current[name] ? { ...current, [name]: "" } : current));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.errors || {});
        setNotice({ tone: "error", text: data.message || "বার্তা পাঠানো যায়নি।" });
        return;
      }

      setValues(BLANK);
      setErrors({});
      setNotice({ tone: "success", text: data.message || "আপনার বার্তা পাঠানো হয়েছে।" });
    } catch {
      setNotice({ tone: "error", text: "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {notice ? <FormNotice tone={notice.tone}>{notice.text}</FormNotice> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="আপনার নাম"
          required
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          placeholder=""
          disabled={busy}
          autoComplete="name"
        />
        <Input
          label="ইমেইল"
          type="email"
          required
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          placeholder=""
          disabled={busy}
          autoComplete="email"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="মোবাইল"
          type="tel"
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          placeholder=""
          help="ঐচ্ছিক"
          disabled={busy}
          autoComplete="tel"
        />
        <Input
          label="বিষয়"
          required
          value={values.subject}
          onChange={set("subject")}
          error={errors.subject}
          placeholder=""
          disabled={busy}
        />
      </div>

      <Textarea
        label="আপনার বার্তা"
        required
        rows={6}
        value={values.message}
        onChange={set("message")}
        error={errors.message}
        placeholder=""
        help={`${values.message.length}/২০০০`}
        disabled={busy}
      />

      <Button type="submit" loading={busy} className="justify-self-start">
        {busy ? "পাঠানো হচ্ছে…" : "বার্তা পাঠান →"}
      </Button>
    </form>
  );
}
