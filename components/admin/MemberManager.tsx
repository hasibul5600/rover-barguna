"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input, { FormNotice, Select, Textarea } from "@/components/ui/Input";
import { cn, toBn } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/validators";
import { MEMBER_ROLES, type MemberMeta } from "@/models/Member";

type Member = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  meta?: MemberMeta;
  createdAt: string;
};

const MAX_BYTES = 8 * 1024 * 1024;

const BLANK = {
  name: "",
  role: "",
  department: "",
  session: "",
  roll: "",
  phone: "",
  email: "",
  bio: "",
  status: "published",
};

type Values = typeof BLANK;

/** Roles get a colour so the list is scannable at a glance. */
const ROLE_TONE: Record<string, string> = {
  "রোভার স্কাউট লিডার": "bg-[#f0e6ff] text-[#5b21b6]",
  "সিনিয়র রোভার মেট": "bg-[#fdf0d5] text-[#92400e]",
  "রোভার মেট": "bg-[#e7f2eb] text-[color:var(--forest)]",
  "সহকারী রোভার মেট": "bg-[#e0f2fe] text-[#075985]",
};

export default function MemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [values, setValues] = useState<Values>(BLANK);
  const [file, setFile] = useState<File | null>(null);
  /** Object URL for a freshly picked file, or the stored Cloudinary URL when editing. */
  const [preview, setPreview] = useState("");
  const [dropImage, setDropImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/members", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setMembers(await response.json());
      setError("");
    } catch {
      setError("সদস্য তালিকা লোড করা যায়নি। ডাটাবেজ সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (key: keyof Values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const start = (member?: Member) => {
    setEditing(member || null);
    setValues(
      member
        ? {
            name: member.title || "",
            role: member.meta?.role || "",
            department: member.meta?.department || "",
            session: member.meta?.session || "",
            roll: member.meta?.roll || "",
            phone: member.meta?.phone || "",
            email: member.meta?.email || "",
            bio: member.description || "",
            status: member.status || "published",
          }
        : BLANK
    );
    setFile(null);
    setPreview(member?.meta?.image || "");
    setDropImage(false);
    setError("");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setFile(null);
    setPreview("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const pickPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;

    if (!next.type.startsWith("image/")) {
      setError("শুধু ছবি নির্বাচন করুন (JPG, PNG, WEBP বা GIF)।");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("ছবির আকার ৮ MB-এর কম হতে হবে।");
      return;
    }

    setFile(next);
    setPreview(URL.createObjectURL(next));
    setDropImage(false);
    setError("");
  };

  const clearPhoto = () => {
    setFile(null);
    setPreview("");
    setDropImage(Boolean(editing?.meta?.image));
    if (fileInput.current) fileInput.current.value = "";
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("সদস্যের নাম লিখুন।");
      return;
    }

    setBusy(true);
    setError("");

    const meta: Record<string, string | boolean> = {
      role: values.role,
      department: values.department,
      session: values.session.trim(),
      roll: values.roll.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    };
    if (dropImage) meta.removeImage = true;

    const url = editing ? `/api/admin/members/${editing._id}` : "/api/admin/members";
    const method = editing ? "PUT" : "POST";

    // A picked photo has to travel as multipart; everything else can stay JSON.
    let request: RequestInit;
    if (file) {
      const form = new FormData();
      form.append("title", values.name.trim());
      form.append("description", values.bio.trim());
      form.append("status", values.status);
      form.append("meta", JSON.stringify(meta));
      form.append("image", file);
      request = { method, body: form };
    } else {
      request = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.name.trim(),
          description: values.bio.trim(),
          status: values.status,
          meta,
        }),
      };
    }

    try {
      const response = await fetch(url, request);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || "সদস্য সংরক্ষণ করা যায়নি।");
        return;
      }
      setNotice(editing ? "সদস্যের তথ্য হালনাগাদ হয়েছে।" : "নতুন সদস্য যোগ হয়েছে।");
      close();
      load();
    } catch {
      setError("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (member: Member) => {
    if (!confirm(`“${member.title}”-কে সদস্য তালিকা থেকে মুছে ফেলবেন?`)) return;
    const response = await fetch(`/api/admin/members/${member._id}`, { method: "DELETE" });
    if (response.ok) {
      setNotice("সদস্য মুছে ফেলা হয়েছে।");
      load();
    } else {
      setError("সদস্য মুছা যায়নি।");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">সদস্য ব্যবস্থাপনা</h2>
          <p className="mt-1 text-sm text-slate-500">
            নাম, পদবি ও ছবি সহ সদস্যের তথ্য যোগ করুন — সবকিছু নেতৃত্ব পাতায় দেখা যাবে।
          </p>
        </div>
        <Button type="button" onClick={() => start()} className="border-0">
          + সদস্য যোগ করুন
        </Button>
      </div>

      {notice ? (
        <div className="mt-5">
          <FormNotice tone="success">{notice}</FormNotice>
        </div>
      ) : null}
      {error && !open ? (
        <div className="mt-5">
          <FormNotice tone="error">{error}</FormNotice>
        </div>
      ) : null}

      <div className="mt-7 overflow-hidden rounded-2xl border border-emerald-950/6 bg-white shadow-[0_8px_24px_rgb(6_55_42_/_0.05)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold text-[color:var(--forest)]">
            সদস্য তালিকা <span className="text-slate-400">({toBn(members.length)})</span>
          </h3>
        </div>

        {loading ? (
          <p className="p-12 text-center text-slate-500">তথ্য লোড হচ্ছে…</p>
        ) : members.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left text-sm">
              <thead className="bg-[#f8faf8] text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3">সদস্য</th>
                  <th className="px-5 py-3">পদবি</th>
                  <th className="px-5 py-3">বিভাগ</th>
                  <th className="px-5 py-3">যোগাযোগ</th>
                  <th className="px-5 py-3">অবস্থা</th>
                  <th className="px-5 py-3 text-right">কাজ</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="border-t border-slate-100 align-middle">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e7f2eb] text-base font-bold text-[color:var(--leaf)]">
                          {member.meta?.image ? (
                            /* Cloudinary-hosted; next/image isn't configured for that domain. */
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={member.meta.image}
                              alt={member.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            (member.title || "?").trim().charAt(0)
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold text-slate-700">{member.title}</span>
                          {member.meta?.session || member.meta?.roll ? (
                            <span className="block text-xs text-slate-400">
                              {[member.meta?.session, member.meta?.roll].filter(Boolean).join(" · ")}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {member.meta?.role ? (
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-bold",
                            ROLE_TONE[member.meta.role] || "bg-slate-100 text-slate-600"
                          )}
                        >
                          {member.meta.role}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{member.meta?.department || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="block">{member.meta?.phone || "—"}</span>
                      {member.meta?.email ? (
                        <span className="block text-xs text-slate-400">{member.meta.email}</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold",
                          member.status === "draft"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700"
                        )}
                      >
                        {member.status === "draft" ? "খসড়া" : "প্রকাশিত"}
                      </span>
                    </td>
                    <td className="space-x-3 px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => start(member)}
                        className="font-bold text-[color:var(--leaf)] hover:underline"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(member)}
                        className="font-bold text-red-600 hover:underline"
                      >
                        মুছুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-3xl" aria-hidden>
              👥
            </p>
            <p className="mt-3 font-bold text-[color:var(--forest)]">এখনও কোনো সদস্য নেই</p>
            <p className="mt-1 text-sm text-slate-500">
              “সদস্য যোগ করুন” বাটনে ক্লিক করে প্রথম সদস্যের তথ্য দিন।
            </p>
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-100 grid place-items-center overflow-y-auto bg-slate-950/45 p-4">
          <form
            onSubmit={save}
            className="animate-pop my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[color:var(--forest)]">
                  {editing ? "সদস্যের তথ্য সম্পাদনা" : "নতুন সদস্য যোগ করুন"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  <span className="text-red-500">*</span> চিহ্নিত ঘর পূরণ করা আবশ্যক।
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="বন্ধ করুন"
                className="text-2xl leading-none text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-dashed border-emerald-700/25 bg-[#f8faf8] p-4">
              <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e7f2eb] text-2xl text-[color:var(--leaf)]">
                {preview ? (
                  /* Local object URL or Cloudinary URL — plain img either way. */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={preview} alt="নির্বাচিত ছবি" className="size-full object-cover" />
                ) : (
                  <span aria-hidden>👤</span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700">সদস্যের ছবি</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  JPG, PNG, WEBP বা GIF · সর্বোচ্চ ৮ MB · বর্গাকার ছবি সবচেয়ে ভালো দেখায়।
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInput}
                    id="member-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={pickPhoto}
                    className="max-w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  />
                  {preview ? (
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      ছবি সরান
                    </button>
                  ) : null}
                </div>
                {dropImage ? (
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    সংরক্ষণ করলে আগের ছবিটি মুছে যাবে।
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label="পূর্ণ নাম"
                required
                value={values.name}
                onChange={set("name")}
                placeholder="যেমন: মোঃ রিফাত হোসেন"
                disabled={busy}
                className="sm:col-span-2"
              />
              <Select
                label="পদবি"
                options={MEMBER_ROLES}
                value={values.role}
                onChange={set("role")}
                placeholder="পদবি নির্বাচন করুন"
                disabled={busy}
              />
              <Select
                label="বিভাগ"
                options={DEPARTMENTS}
                value={values.department}
                onChange={set("department")}
                placeholder="বিভাগ নির্বাচন করুন"
                disabled={busy}
              />
              <Input
                label="সেশন"
                value={values.session}
                onChange={set("session")}
                placeholder="২০২৩-২৪"
                disabled={busy}
              />
              <Input
                label="রোল নম্বর"
                value={values.roll}
                onChange={set("roll")}
                placeholder="১২৩৪৫৬"
                disabled={busy}
              />
              <Input
                label="মোবাইল"
                type="tel"
                inputMode="numeric"
                value={values.phone}
                onChange={set("phone")}
                placeholder="০১৭xxxxxxxx"
                disabled={busy}
              />
              <Input
                label="ইমেইল"
                type="email"
                value={values.email}
                onChange={set("email")}
                placeholder="name@example.com"
                disabled={busy}
              />
              <Textarea
                label="সংক্ষিপ্ত পরিচিতি"
                rows={3}
                value={values.bio}
                onChange={set("bio")}
                placeholder="সদস্যের অর্জন, দায়িত্ব বা আগ্রহ সম্পর্কে দুই লাইন…"
                disabled={busy}
                className="sm:col-span-2"
              />
              <Select
                label="অবস্থা"
                options={[
                  { value: "published", label: "প্রকাশিত" },
                  { value: "draft", label: "খসড়া" },
                ]}
                value={values.status}
                onChange={set("status")}
                placeholder="নির্বাচন করুন"
                disabled={busy}
                help="খসড়া রাখলে সদস্যটি ওয়েবসাইটে দেখা যাবে না।"
              />
            </div>

            {error ? (
              <div className="mt-5">
                <FormNotice tone="error">{error}</FormNotice>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={close} disabled={busy}>
                বাতিল
              </Button>
              <Button type="submit" loading={busy} className="border-0">
                {editing ? "হালনাগাদ করুন" : "সদস্য সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
