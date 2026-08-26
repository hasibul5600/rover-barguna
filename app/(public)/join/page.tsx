import JoinForm from "@/components/forms/JoinForm";
import PageHeader from "@/components/layout/PageHeader";
import { toBn } from "@/lib/utils";

export const metadata = {
  title: "সদস্য হোন | রোভার স্কাউট গ্রুপ",
  description: "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপে সদস্য হওয়ার আবেদন করুন।",
};

const BENEFITS = [
  ["🎓", "প্রশিক্ষণ ও সনদ", "প্রাথমিক চিকিৎসা, দিকনির্ণয় ও নেতৃত্ব প্রশিক্ষণ, সঙ্গে স্বীকৃত সনদ।"],
  ["🤝", "সেবার সুযোগ", "রক্তদান, বৃক্ষরোপণ ও দুর্যোগে সহায়তার মতো কাজে সরাসরি অংশগ্রহণ।"],
  ["🏕️", "ক্যাম্প ও ভ্রমণ", "আঞ্চলিক ও জাতীয় তাঁবু জলসায় যোগ দিয়ে সারা দেশের রোভারদের সঙ্গে পরিচয়।"],
  ["💼", "সিভিতে শক্তি", "স্কাউটিং অভিজ্ঞতা চাকরির বাজারে নেতৃত্ব ও দলগত কাজের প্রমাণ হিসেবে গণ্য হয়।"],
];

const STEPS = [
  ["আবেদন জমা", "নিচের ফর্মটি পূরণ করে পাঠান — এক মিনিটের কাজ।"],
  ["পর্যালোচনা", "আমাদের দল আপনার তথ্য যাচাই করে ৩–৫ কার্যদিবসে যোগাযোগ করে।"],
  ["পরিচিতি সভা", "গ্রুপের কার্যক্রম ও দায়িত্ব সম্পর্কে একটি সংক্ষিপ্ত সভা হয়।"],
  ["দীক্ষা", "স্কাউট প্রতিজ্ঞা গ্রহণের মাধ্যমে আপনি আনুষ্ঠানিকভাবে রোভার হয়ে যান।"],
];

const REQUIREMENTS = [
  "ইনস্টিটিউটের নিয়মিত শিক্ষার্থী হতে হবে",
  "সাপ্তাহিক সভায় নিয়মিত উপস্থিত থাকার আগ্রহ",
  "স্কাউট আইন ও প্রতিজ্ঞা মেনে চলার প্রতিশ্রুতি",
  "সেবামূলক কাজে স্বেচ্ছায় অংশগ্রহণের মানসিকতা",
];

export default function JoinPage() {
  return (
    <>
      <section className="hero-glow container-x py-16 md:py-24">
        <PageHeader
          kicker="সদস্যপদ"
          title="রোভার স্কাউট দলে যোগ দিন"
          lead="কারিগরি শিক্ষার পাশাপাশি নেতৃত্ব, সেবা ও বন্ধুত্বের এক নতুন অভিজ্ঞতা। আবেদন করতে ইনস্টিটিউটের শিক্ষার্থী হওয়াই যথেষ্ট।"
        />

        <div className="stagger mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(([icon, title, body]) => (
            <article key={title} className="surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-[#e7f2eb] text-lg" aria-hidden>
                {icon}
              </span>
              <h3 className="mt-4 font-bold text-[color:var(--forest)]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_.8fr]">
          <div className="surface p-6 md:p-8">
            <h2 className="text-xl font-bold text-[color:var(--forest)]">আবেদন ফর্ম</h2>
            <p className="mt-1 text-sm text-slate-500">
              <span className="text-red-500">*</span> চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক। আপনার তথ্য শুধু সদস্যপদ
              যাচাইয়ের জন্য ব্যবহার করা হবে।
            </p>
            <div className="mt-6">
              <JoinForm />
            </div>
          </div>

          <div className="grid content-start gap-6">
            <article className="surface p-6">
              <p className="section-kicker">ধাপগুলো</p>
              <h3 className="mt-1 text-lg font-bold text-[color:var(--forest)]">আবেদনের পর কী হয়?</h3>
              <ol className="mt-5 grid gap-4">
                {STEPS.map(([title, body], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--forest)] text-xs font-bold text-[#f5bf43]">
                      {toBn(index + 1)}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-slate-700">{title}</span>
                      <span className="mt-0.5 block text-sm leading-6 text-slate-500">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="texture-dots rounded-2xl bg-[color:var(--forest)] p-6 text-white">
              <p className="text-sm font-bold text-[#f5bf43]">যোগ্যতা</p>
              <ul className="mt-4 grid gap-2.5">
                {REQUIREMENTS.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-white/85">
                    <span className="text-[#f5bf43]" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
