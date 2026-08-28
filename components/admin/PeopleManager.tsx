"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input, { FormNotice, Select, Textarea } from "@/components/ui/Input";
import type { PeopleConfig, PeopleField } from "@/lib/people";
import { cn, toBn } from "@/lib/utils";

/**
 * Admin CRUD for a collection of people — current members or former members.
 *
 * Everything section-specific (wording, field list, table columns) comes from the
 * PeopleConfig it is handed, so both sections share one create/edit/photo-upload
 * path. See lib/people.ts for the two configs.
 */

type Person = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  /** Shape varies per collection — the config says which keys to read. */
  meta?: Record<string, string | undefined>;
  createdAt: string;
};

/** Values are flat strings so an arbitrary config field list just works. */
type Values = Record<string, string>;

const MAX_BYTES = 8 * 1024 * 1024;

/** Roles get a colour so the list is scannable at a glance. */
const ROLE_TONE: Record<string, string> = {
  "রোভার স্কাউট লিডার": "bg-[#f0e6ff] text-[#5b21b6]",
  "সিনিয়র রোভার মেট": "bg-[#fdf0d5] text-[#92400e]",
  "রোভার মেট": "bg-[#e7f2eb] text-[color:var(--forest)]",
  "সহকারী রোভার মেট": "bg-[#e0f2fe] text-[#075985]",
};

/** Used unless the config supplies its own review states. */
const DEFAULT_STATUSES = [
  { value: "published", label: "প্রকাশিত" },
  { value: "draft", label: "খসড়া" },
];

const DEFAULT_STATUS_TONES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
};

/** name/bio/status are fixed; the rest of the keys come from the config. */
function blankValues(config: PeopleConfig): Values {
  const values: Values = { name: "", bio: "", status: config.defaultStatus || "published" };
  for (const field of config.fields) values[field.key] = "";
  return values;
}

function valuesFrom(config: PeopleConfig, person: Person): Values {
  const values = blankValues(config);
  values.name = person.title || "";
  values.bio = person.description || "";
  values.status = person.status || values.status;
  for (const field of config.fields) values[field.key] = person.meta?.[field.key] || "";
  return values;
}

/** One table cell. `display` decides between a tinted pill and plain text. */
function Cell({ field, meta }: { field: PeopleField; meta: Person["meta"] }) {
  const value = meta?.[field.key]?.trim();
  const dash = <span className="text-slate-400">—</span>;

  if (field.display === "roleBadge") {
    return value ? (
      <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", ROLE_TONE[value] || "bg-slate-100 text-slate-600")}>
        {value}
      </span>
    ) : (
      dash
    );
  }

  if (field.display === "blood") {
    return value ? (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">{value}</span>
    ) : (
      dash
    );
  }

  if (field.display === "contact") {
    const email = meta?.email?.trim();
    return (
      <span className="text-slate-600">
        <span className="block">{value || "—"}</span>
        {email ? <span className="block text-xs text-slate-400">{email}</span> : null}
      </span>
    );
  }

  return <span className="text-slate-600">{value || "—"}</span>;
}

/** Photo-or-initial bubble. Shared by the phone card list and the table. */
function Avatar({ person }: { person: Person }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e7f2eb] text-base font-bold text-[color:var(--leaf)]">
      {person.meta?.image ? (
        /* Cloudinary-hosted; next/image isn't configured for that domain. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={person.meta.image} alt={person.title} className="size-full object-cover" />
      ) : (
        (person.title || "?").trim().charAt(0)
      )}
    </span>
  );
}

/** The small grey line under a name, e.g. "২০২৪-২৫ · ২৩১১০৫". */
function subtitleOf(config: PeopleConfig, person: Person) {
  return config.subtitleKeys
    .map((key) => person.meta?.[key])
    .filter(Boolean)
    .join(" · ");
}

export default function PeopleManager({ config }: { config: PeopleConfig }) {
  const { noun } = config;
  const nameLabel = config.nameLabel || "পূর্ণ নাম";
  const withPhoto = config.photo !== false;
  const statuses = config.statuses || DEFAULT_STATUSES;
  const statusTones = config.statusTones || DEFAULT_STATUS_TONES;
  const statusLabel = (value: string) =>
    statuses.find((status) => status.value === value)?.label || value || "—";
  const columns = config.fields.filter((field) => field.inTable);

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [values, setValues] = useState<Values>(() => blankValues(config));
  const [file, setFile] = useState<File | null>(null);
  /** Object URL for a freshly picked file, or the stored Cloudinary URL when editing. */
  const [preview, setPreview] = useState("");
  const [dropImage, setDropImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const endpoint = `/api/admin/${config.collection}`;

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setPeople(await response.json());
      setError("");
    } catch {
      setError(`${noun} তালিকা লোড করা যায়নি। ডাটাবেজ সংযোগ পরীক্ষা করুন।`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const set = (key: string) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const start = (person?: Person) => {
    setEditing(person || null);
    setValues(person ? valuesFrom(config, person) : blankValues(config));
    setFile(null);
    setPreview(person?.meta?.image || "");
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
      setError(`${nameLabel} লিখুন।`);
      return;
    }

    setBusy(true);
    setError("");

    const meta: Record<string, string | boolean> = {};
    for (const field of config.fields) meta[field.key] = (values[field.key] || "").trim();
    if (dropImage) meta.removeImage = true;

    const url = editing ? `${endpoint}/${editing._id}` : endpoint;
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
        setError(data.message || `${noun} সংরক্ষণ করা যায়নি।`);
        return;
      }
      setNotice(editing ? `${noun}ের তথ্য হালনাগাদ হয়েছে।` : `নতুন ${noun} যোগ হয়েছে।`);
      close();
      load();
    } catch {
      setError("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (person: Person) => {
    if (!confirm(`“${person.title}”-কে ${noun} তালিকা থেকে মুছে ফেলবেন?`)) return;
    const response = await fetch(`${endpoint}/${person._id}`, { method: "DELETE" });
    if (response.ok) {
      setNotice(`${noun} মুছে ফেলা হয়েছে।`);
      load();
    } else {
      setError(`${noun} মুছা যায়নি।`);
    }
  };

  const statusPill = (person: Person) => (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
        statusTones[person.status] || "bg-slate-100 text-slate-600"
      )}
    >
      {statusLabel(person.status)}
    </span>
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">
            {config.heading || `${noun} ব্যবস্থাপনা`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{config.intro}</p>
        </div>
        <Button type="button" onClick={() => start()} className="border-0">
          + {noun} যোগ করুন
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
            {noun} তালিকা <span className="text-slate-400">({toBn(people.length)})</span>
          </h3>
        </div>

        {loading ? (
          <p className="p-12 text-center text-slate-500">তথ্য লোড হচ্ছে…</p>
        ) : people.length ? (
          <>
            {/* Cards below xl. The table needs ~975px for its Bengali columns, so
                with the 256px sidebar alongside it a 1024px tablet had to scroll
                287px sideways on every row — same problem as a phone, just less bad. */}
            <ul className="divide-y divide-slate-100 xl:hidden">
              {people.map((person) => {
                const subtitle = subtitleOf(config, person);

                return (
                  <li key={person._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar person={person} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold break-words text-slate-700">{person.title}</p>
                        {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
                      </div>
                      {statusPill(person)}
                    </div>

                    {columns.length ? (
                      <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3">
                        {columns.map((field) => (
                          <div key={field.key} className="min-w-0">
                            <dt className="text-[0.7rem] font-semibold text-slate-400">
                              {field.tableLabel || field.label}
                            </dt>
                            <dd className="mt-0.5 text-sm break-words">
                              <Cell field={field} meta={person.meta} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {/* Full-width taps — the table's inline text links are far too
                        small a target on a phone. */}
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => start(person)}
                        className="flex-1 rounded-xl border border-emerald-700/25 py-2.5 text-sm font-bold text-[color:var(--leaf)] transition hover:bg-[#f0f7f3]"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(person)}
                        className="flex-1 rounded-xl border border-red-200 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        মুছুন
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-200 text-left text-sm">
                <thead className="bg-[#f8faf8] text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{noun}</th>
                    {columns.map((field) => (
                      <th key={field.key} className="px-4 py-3">
                        {field.tableLabel || field.label}
                      </th>
                    ))}
                    <th className="px-4 py-3">অবস্থা</th>
                    <th className="px-4 py-3 text-right">কাজ</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => {
                    const subtitle = subtitleOf(config, person);

                    return (
                      <tr key={person._id} className="border-t border-slate-100 align-middle">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar person={person} />
                            <span className="min-w-0">
                              <span className="block font-bold text-slate-700">{person.title}</span>
                              {subtitle ? (
                                <span className="block text-xs text-slate-400">{subtitle}</span>
                              ) : null}
                            </span>
                          </div>
                        </td>
                        {columns.map((field) => (
                          <td key={field.key} className="px-4 py-3.5">
                            <Cell field={field} meta={person.meta} />
                          </td>
                        ))}
                        <td className="px-4 py-3.5">{statusPill(person)}</td>
                        <td className="space-x-3 px-4 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => start(person)}
                            className="font-bold text-[color:var(--leaf)] hover:underline"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(person)}
                            className="font-bold text-red-600 hover:underline"
                          >
                            মুছুন
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-3xl" aria-hidden>
              {config.emptyIcon}
            </p>
            <p className="mt-3 font-bold text-[color:var(--forest)]">এখনও কোনো {noun} নেই</p>
            <p className="mt-1 text-sm text-slate-500">
              “{noun} যোগ করুন” বাটনে ক্লিক করে প্রথম তথ্য দিন।
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
                  {editing ? `${noun}ের তথ্য সম্পাদনা` : `নতুন ${noun} যোগ করুন`}
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

            {withPhoto ? (
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
                  <p className="text-sm font-bold text-slate-700">{noun}ের ছবি</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    JPG, PNG, WEBP বা GIF · সর্বোচ্চ ৮ MB · বর্গাকার ছবি সবচেয়ে ভালো দেখায়।
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInput}
                      id={`${config.collection}-photo`}
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
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label={nameLabel}
                required
                value={values.name}
                onChange={set("name")}
                placeholder={config.namePlaceholder}
                disabled={busy}
                className="sm:col-span-2"
              />

              {config.fields.map((field) =>
                field.type === "select" ? (
                  <Select
                    key={field.key}
                    label={field.label}
                    options={field.options || []}
                    value={values[field.key]}
                    onChange={set(field.key)}
                    placeholder={field.placeholder}
                    disabled={busy}
                  />
                ) : (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    inputMode={field.type === "tel" ? "numeric" : undefined}
                    value={values[field.key]}
                    onChange={set(field.key)}
                    placeholder={field.placeholder}
                    disabled={busy}
                  />
                )
              )}

              <Textarea
                label={config.bioLabel}
                rows={3}
                value={values.bio}
                onChange={set("bio")}
                placeholder={config.bioPlaceholder}
                disabled={busy}
                className="sm:col-span-2"
              />
              <Select
                label="অবস্থা"
                options={statuses}
                value={values.status}
                onChange={set("status")}
                placeholder="নির্বাচন করুন"
                disabled={busy}
                help={config.statusHelp}
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
                {editing ? "হালনাগাদ করুন" : `${noun} সংরক্ষণ করুন`}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
