"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input, { FormNotice, Select, Textarea } from "@/components/ui/Input";
import { cn, formatBnDate, timeAgoBn, toBn } from "@/lib/utils";
import { NOTICE_CATEGORIES, NOTICE_COLLECTION, type NoticeMeta } from "@/models/Notice";

type NoticeItem = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  meta?: NoticeMeta & { sortOrder?: string };
  createdAt: string;
};

const MAX_BYTES = 8 * 1024 * 1024;

const STATUSES = [
  { value: "published", label: "প্রকাশিত" },
  { value: "draft", label: "খসড়া" },
];

export default function NoticeManager() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NoticeItem | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("সাধারণ");
  const [deadline, setDeadline] = useState("");
  const [attachment, setAttachment] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dropImage, setDropImage] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const endpoint = `/api/admin/${NOTICE_COLLECTION}`;

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setNotices(await response.json());
      setError("");
    } catch {
      setError("নোটিশ তালিকা লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const start = (item?: NoticeItem) => {
    setEditing(item || null);
    setTitle(item?.title || "");
    setCategory(item?.meta?.category || "সাধারণ");
    setDeadline(item?.meta?.deadline || "");
    setAttachment(item?.meta?.attachment || "");
    setDescription(item?.description || "");
    setStatus(item?.status || "published");
    setFile(null);
    setPreview(item?.meta?.image || "");
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

  const pickImage = (event: ChangeEvent<HTMLInputElement>) => {
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

  const clearImage = () => {
    setFile(null);
    setPreview("");
    setDropImage(Boolean(editing?.meta?.image));
    if (fileInput.current) fileInput.current.value = "";
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("নোটিশের শিরোনাম লিখুন।");
      return;
    }

    setBusy(true);
    setError("");

    const meta: Record<string, string | boolean> = {
      category,
      deadline,
      attachment,
    };
    if (dropImage) meta.removeImage = true;

    const url = editing ? `${endpoint}/${editing._id}` : endpoint;
    const method = editing ? "PUT" : "POST";

    let request: RequestInit;
    if (file) {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim());
      form.append("status", status);
      form.append("meta", JSON.stringify(meta));
      form.append("image", file);
      request = { method, body: form };
    } else {
      request = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
          meta,
        }),
      };
    }

    try {
      const response = await fetch(url, request);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || "নোটিশ সংরক্ষণ করা যায়নি।");
        return;
      }
      setNoticeMsg(editing ? "নোটিশ হালনাগাদ হয়েছে।" : "নতুন নোটিশ প্রকাশ করা হয়েছে।");
      close();
      load();
    } catch {
      setError("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: NoticeItem) => {
    if (!confirm(`“${item.title}” নোটিশটি মুছে ফেলবেন?`)) return;
    const response = await fetch(`${endpoint}/${item._id}`, { method: "DELETE" });
    if (response.ok) {
      setNoticeMsg("নোটিশ মুছে ফেলা হয়েছে।");
      load();
    } else {
      setError("নোটিশ মুছা যায়নি।");
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= notices.length) return;

    const next = [...notices];
    const [moved] = next.splice(index, 1);
    next.splice(newIndex, 0, moved);

    setNotices(next);

    const items = next.map((item, idx) => ({
      id: item._id,
      sortOrder: idx + 1,
    }));

    try {
      const response = await fetch(`${endpoint}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) load();
    } catch {
      load();
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">নোটিশ ব্যবস্থাপনা</h2>
          <p className="mt-1 text-sm text-slate-500">সদস্য ও দর্শনার্থীদের জন্য নোটিশ ও ছবি প্রকাশ করুন।</p>
        </div>
        <Button type="button" onClick={() => start()} className="border-0">
          + নতুন নোটিশ প্রকাশ
        </Button>
      </div>

      {noticeMsg ? (
        <div className="mt-5">
          <FormNotice tone="success">{noticeMsg}</FormNotice>
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
            নোটিশ তালিকা <span className="text-slate-400">({toBn(notices.length)})</span>
          </h3>
        </div>

        {loading ? (
          <p className="p-12 text-center text-slate-500">তথ্য লোড হচ্ছে…</p>
        ) : notices.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="bg-[#f8faf8] text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">ছবি</th>
                  <th className="px-4 py-3">শিরোনাম</th>
                  <th className="px-4 py-3">ধরন</th>
                  <th className="px-4 py-3">শেষ তারিখ</th>
                  <th className="px-4 py-3">অবস্থা</th>
                  <th className="px-4 py-3 text-center">ক্রম (Priority)</th>
                  <th className="px-4 py-3 text-right">কাজ</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((item, index) => (
                  <tr key={item._id} className="border-t border-slate-100 align-middle">
                    <td className="px-4 py-3.5">
                      {item.meta?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.meta.image}
                          alt={item.title}
                          className="size-12 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="grid size-12 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-400">
                          ছবি নেই
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="font-bold text-slate-700">{item.title}</p>
                      <p className="text-xs text-slate-400">{timeAgoBn(item.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {item.meta?.category || "সাধারণ"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.meta?.deadline ? formatBnDate(item.meta.deadline) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold",
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {item.status === "published" ? "প্রকাশিত" : "খসড়া"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                          title="উপরে সরান"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === notices.length - 1}
                          onClick={() => move(index, 1)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                          title="নিচে সরান"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="space-x-3 px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => start(item)}
                        className="font-bold text-[color:var(--leaf)] hover:underline"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
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
            <p className="text-3xl" aria-hidden>📢</p>
            <p className="mt-3 font-bold text-[color:var(--forest)]">এখনও কোনো নোটিশ নেই</p>
            <p className="mt-1 text-sm text-slate-500">“নতুন নোটিশ প্রকাশ” বাটনে ক্লিক করে প্রথম ঘোষণা দিন।</p>
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
                  {editing ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ যোগ করুন"}
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

            {/* Photo Upload Area */}
            <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-dashed border-emerald-700/25 bg-[#f8faf8] p-4">
              <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#e7f2eb] text-2xl text-[color:var(--leaf)]">
                {preview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={preview} alt="নির্বাচিত ছবি" className="size-full object-cover" />
                ) : (
                  <span aria-hidden>📷</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700">নোটিশের ছবি (Banner / Image)</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  JPG, PNG, WEBP বা GIF · সর্বোচ্চ ৮ MB · ঐচ্ছিক।
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={pickImage}
                    className="max-w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  />
                  {preview ? (
                    <button
                      type="button"
                      onClick={clearImage}
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
                label="নোটিশের শিরোনাম"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                disabled={busy}
                className="sm:col-span-2"
              />

              <Select
                label="ধরন (Category)"
                options={NOTICE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={busy}
              />

              <Input
                label="শেষ তারিখ (Deadline)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={busy}
              />

              <Input
                label="সংযুক্তি লিংক (Attachment URL)"
                type="url"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                placeholder=""
                disabled={busy}
                className="sm:col-span-2"
              />

              <Textarea
                label="বিস্তারিত বিবরণ"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                disabled={busy}
                className="sm:col-span-2"
              />

              <Select
                label="অবস্থা"
                options={STATUSES}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={busy}
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
                {editing ? "হালনাগাদ করুন" : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
