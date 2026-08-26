"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Photo = {
  _id: string;
  title: string;
  description?: string;
  meta?: { image?: string };
  createdAt: string;
};

export default function GalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/gallery");
    if (response.ok) setPhotos(await response.json());
  };

  useEffect(() => {
    load();
  }, []);

  const select = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("শুধু ছবি নির্বাচন করুন।");
      return;
    }
    if (next.size > 8 * 1024 * 1024) {
      setError("ছবির আকার ৮ MB-এর কম হতে হবে।");
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError("");
  };

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("একটি ছবি নির্বাচন করুন।");
      return;
    }

    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("status", "published");
    form.append("image", file);

    try {
      const response = await fetch("/api/admin/gallery", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "ছবি Cloudinary-তে আপলোড করা যায়নি।");
        return;
      }

      setTitle("");
      setDescription("");
      setFile(null);
      setPreview("");
      const input = document.getElementById("gallery-file") as HTMLInputElement | null;
      if (input) input.value = "";
      load();
    } catch {
      setError("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("এই ছবিটি মুছে ফেলবেন?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-[color:var(--forest)]">গ্যালারি ব্যবস্থাপনা</h2>
        <p className="mt-1 text-sm text-slate-500">ছবি নির্বাচন করলে সেটি Cloudinary-তে আপলোড হয়ে গ্যালারিতে প্রকাশ হবে।</p>
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={upload} className="rounded-2xl border border-emerald-950/6 bg-white p-6 shadow-[0_8px_24px_rgb(6_55_42_/_0.05)]">
          <h3 className="font-bold text-[color:var(--forest)]">নতুন ছবি যোগ করুন</h3>
          <label className="mt-5 grid gap-2 text-sm font-bold">
            ছবি নির্বাচন করুন
            <input
              id="gallery-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={select}
              className="rounded-xl border border-dashed border-emerald-700/30 bg-[#f8faf8] p-3 text-sm"
            />
          </label>
          {preview && <img src={preview} alt="Preview" className="mt-4 aspect-video w-full rounded-xl object-cover" />}
          <label className="mt-4 grid gap-1.5 text-sm font-bold">
            ছবির শিরোনাম
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5" placeholder="যেমন: শীতকালীন ক্যাম্প ২০২৬" />
          </label>
          <label className="mt-4 grid gap-1.5 text-sm font-bold">
            বিবরণ
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="rounded-xl border border-slate-200 px-3 py-2.5" />
          </label>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button disabled={busy} className="btn-primary mt-5 border-0 disabled:opacity-60">
            {busy ? "Cloudinary-তে আপলোড হচ্ছে..." : "ছবি প্রকাশ করুন"}
          </button>
        </form>
        <section className="rounded-2xl border border-emerald-950/6 bg-white p-6 shadow-[0_8px_24px_rgb(6_55_42_/_0.05)]">
          <h3 className="font-bold text-[color:var(--forest)]">প্রকাশিত ছবি ({photos.length})</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <article key={photo._id} className="overflow-hidden rounded-xl border border-slate-100">
                <div className="aspect-video bg-[#e7f2eb]">
                  {photo.meta?.image && <img src={photo.meta.image} alt={photo.title} className="size-full object-cover" />}
                </div>
                <div className="p-3">
                  <p className="font-bold text-slate-700">{photo.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{photo.description || "কোনো বিবরণ নেই"}</p>
                  <button onClick={() => remove(photo._id)} className="mt-3 text-xs font-bold text-red-600">
                    মুছে ফেলুন
                  </button>
                </div>
              </article>
            ))}
            {!photos.length && <p className="col-span-2 py-12 text-center text-sm text-slate-500">এখনও কোনো ছবি যোগ করা হয়নি।</p>}
          </div>
        </section>
      </div>
    </>
  );
}
