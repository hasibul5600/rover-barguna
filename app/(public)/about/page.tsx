import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { listPublic } from "@/lib/publicApi";
import { toBn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "আমাদের সম্পর্কে | রোভার স্কাউট গ্রুপ",
  description:
    "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের পরিচিতি, লক্ষ্য, স্কাউট প্রতিজ্ঞা ও আদর্শ।",
};

const PILLARS = [
  {
    icon: "🤝",
    title: "সেবা",
    body: "রক্তদান, বৃক্ষরোপণ, দুর্যোগে সহায়তা — সমাজের প্রয়োজনে সবার আগে এগিয়ে আসা আমাদের প্রথম কাজ।",
  },
  {
    icon: "🎓",
    title: "প্রশিক্ষণ",
    body: "প্রাথমিক চিকিৎসা, তাঁবু গাড়া, দিকনির্ণয় ও নেতৃত্বের ব্যবহারিক প্রশিক্ষণ নিয়মিত আয়োজন করা হয়।",
  },
  {
    icon: "🌿",
    title: "চরিত্র গঠন",
    body: "শৃঙ্খলা, সততা ও দায়িত্ববোধ — স্কাউটিং একজন শিক্ষার্থীকে দক্ষ নাগরিক হিসেবে গড়ে তোলে।",
  },
  {
    icon: "🌍",
    title: "ভ্রাতৃত্ব",
    body: "দেশ-বিদেশের স্কাউটদের সঙ্গে বন্ধুত্ব ও পারস্পরিক শ্রদ্ধার একটি বিশ্বব্যাপী পরিবারের অংশ আমরা।",
  },
];

const PROMISE = [
  "আমি আমার আত্মমর্যাদার উপর নির্ভর করে প্রতিজ্ঞা করছি যে,",
  "আমি ঈশ্বর/সৃষ্টিকর্তা ও আমার দেশের প্রতি কর্তব্য পালন করব,",
  "অপরকে সাহায্য করব এবং স্কাউট আইন মেনে চলব।",
];

const LAWS = [
  "স্কাউট বিশ্বাসভাজন",
  "স্কাউট অনুগত",
  "স্কাউট সকলের বন্ধু",
  "স্কাউট শিষ্টাচারী",
  "স্কাউট জীব ও প্রকৃতির প্রতি সদয়",
  "স্কাউট আদেশ পালনকারী",
  "স্কাউট মিতব্যয়ী",
  "স্কাউট সাহসী ও চিন্তায়-কর্মে পরিচ্ছন্ন",
];

const TIMELINE = [
  ["প্রতিষ্ঠা", "বরগুনা পলিটেকনিক ইনস্টিটিউটে রোভার স্কাউট ইউনিট গঠিত হয়।"],
  ["দীক্ষা", "নতুন সদস্যদের প্রতিজ্ঞা গ্রহণ ও প্রাথমিক প্রশিক্ষণের মাধ্যমে যাত্রা শুরু।"],
  ["সেবা কর্মসূচি", "নিয়মিত রক্তদান, পরিচ্ছন্নতা অভিযান ও ত্রাণ বিতরণ কার্যক্রম চালু।"],
  ["আজ", "প্রশিক্ষিত রোভারদের একটি সক্রিয় দল, যারা প্রতিটি জাতীয় কর্মসূচিতে অংশ নেয়।"],
];

/** Real numbers where we have them, so the page never claims figures we can't back. */
async function getCounts() {
  try {
    const [members, activities, events] = await Promise.all([
      listPublic("members", 200),
      listPublic("activities", 200),
      listPublic("events", 200),
    ]);
    return { members: members.length, activities: activities.length, events: events.length };
  } catch (error) {
    console.error("About page counts failed:", error);
    return { members: 0, activities: 0, events: 0 };
  }
}

export default async function AboutPage() {
  const counts = await getCounts();

  const figures = [
    ["সক্রিয় সদস্য", counts.members],
    ["নিয়মিত কার্যক্রম", counts.activities],
    ["আয়োজিত ইভেন্ট", counts.events],
  ] as const;

  return (
    <>
      <section className="container-x py-16 md:py-24">
        <PageHeader
          kicker="পরিচিতি"
          title="আমাদের সম্পর্কে"
          lead="বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ — শিক্ষার্থীদের একটি স্বেচ্ছাসেবী দল, যারা সেবা ও প্রশিক্ষণের মাধ্যমে নিজেদের ও সমাজকে গড়ে তোলে।"
          action={
            <ButtonLink href="/join" variant="primary">
              সদস্য হোন →
            </ButtonLink>
          }
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/images/rover-team.jpg"
              alt="রোভার স্কাউট দলের সদস্যরা"
              width={900}
              height={640}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[color:var(--forest)]">আমাদের লক্ষ্য</h2>
            <div className="divider-gold mt-4" />
            <div className="prose-bn mt-5 text-slate-600">
              <p>
                স্কাউটিং কেবল একটি সংগঠন নয় — এটি একটি জীবনদর্শন। আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীর মধ্যে
                আত্মনির্ভরতা, নেতৃত্বের গুণ ও মানুষের পাশে দাঁড়ানোর মানসিকতা গড়ে তোলা। কারিগরি শিক্ষার
                পাশাপাশি এই মানবিক প্রশিক্ষণই একজন শিক্ষার্থীকে পূর্ণ মানুষ হিসেবে তৈরি করে।
              </p>
              <p>
                বাংলাদেশ স্কাউটস-এর রোভার অঞ্চলের অংশ হিসেবে আমরা জাতীয় ও আঞ্চলিক কর্মসূচিতে নিয়মিত
                অংশগ্রহণ করি এবং ইনস্টিটিউটের ভেতরে সারা বছর সেবামূলক কাজ পরিচালনা করি।
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              {figures.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-emerald-950/8 bg-white p-4 text-center">
                  <dt className="order-2 mt-1 text-xs font-semibold text-slate-500">{label}</dt>
                  <dd className="text-2xl font-bold text-[color:var(--forest)]">{toBn(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-x">
          <p className="section-kicker">আমাদের ভিত্তি</p>
          <h2 className="section-title">চারটি স্তম্ভ</h2>

          <div className="stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-emerald-950/8 bg-[#f8f7f0] p-6">
                <span className="grid size-12 place-items-center rounded-xl bg-white text-xl shadow-sm" aria-hidden>
                  {pillar.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-[color:var(--forest)]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="texture-dots rounded-3xl bg-[color:var(--forest)] p-8 text-white md:p-10">
            <p className="text-sm font-bold text-[#f5bf43]">স্কাউট প্রতিজ্ঞা</p>
            <blockquote className="mt-5 space-y-3 text-lg leading-8">
              {PROMISE.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </blockquote>
            <p className="mt-8 border-t border-white/15 pt-5 text-sm text-white/70">
              প্রতিটি নতুন সদস্য দীক্ষা অনুষ্ঠানে এই প্রতিজ্ঞা গ্রহণ করেন।
            </p>
          </article>

          <article className="surface p-8 md:p-10">
            <p className="section-kicker">স্কাউট আইন</p>
            <h3 className="mt-1 text-2xl font-bold text-[color:var(--forest)]">আটটি নীতি</h3>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {LAWS.map((law, index) => (
                <li key={law} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e7f2eb] text-xs font-bold text-[color:var(--forest)]">
                    {toBn(index + 1)}
                  </span>
                  {law}
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-x">
          <p className="section-kicker">পথচলা</p>
          <h2 className="section-title">আমাদের যাত্রা</h2>

          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {TIMELINE.map(([title, body], index) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--forest)] text-sm font-bold text-[#f5bf43]">
                    {toBn(index + 1)}
                  </span>
                  <span className="hidden h-0.5 flex-1 bg-[#e7f2eb] md:block" aria-hidden />
                </div>
                <h3 className="mt-4 font-bold text-[color:var(--forest)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#f8f7f0] p-8">
            <div>
              <h3 className="text-xl font-bold text-[color:var(--forest)]">আমাদের দলে যোগ দিতে চান?</h3>
              <p className="mt-1 text-sm text-slate-600">
                ইনস্টিটিউটের যেকোনো বিভাগের শিক্ষার্থী আবেদন করতে পারেন।
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/join" variant="primary">
                আবেদন করুন
              </ButtonLink>
              <ButtonLink href="/leadership" variant="outline">
                সদস্যদের দেখুন
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
