import ContactForm from "@/components/forms/ContactForm";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "যোগাযোগ | রোভার স্কাউট গ্রুপ",
  description: "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের সাথে যোগাযোগ করুন।",
};

const CHANNELS = [
  {
    icon: "⌂",
    label: "ঠিকানা",
    lines: ["বরগুনা পলিটেকনিক ইনস্টিটিউট", "বরগুনা সদর, বরগুনা ৮৭০০"],
  },
  {
    icon: "✉",
    label: "ইমেইল",
    lines: ["roverbarguna@gmail.com"],
    href: "mailto:roverbarguna@gmail.com",
  },
  {
    icon: "☏",
    label: "মোবাইল",
    lines: ["০১৭০০-০০০০০০"],
    href: "tel:01700000000",
  },
  {
    icon: "◷",
    label: "সময়",
    lines: ["রবি — বৃহস্পতি", "সকাল ৯:০০ — বিকাল ৫:০০"],
  },
];

const FAQ = [
  {
    q: "সদস্য হতে কী কী লাগে?",
    a: "ইনস্টিটিউটের যেকোনো বিভাগের নিয়মিত শিক্ষার্থী হলেই আবেদন করা যায়। শুধু নাম, বিভাগ, সেশন, রোল ও যোগাযোগের তথ্য দিয়ে আবেদন ফর্ম পূরণ করুন।",
  },
  {
    q: "কোনো ফি দিতে হয়?",
    a: "সদস্যপদের জন্য বাংলাদেশ স্কাউটস নির্ধারিত একটি সামান্য বার্ষিক নিবন্ধন ফি রয়েছে। দীক্ষা অনুষ্ঠানের আগে সে বিষয়ে বিস্তারিত জানানো হয়।",
  },
  {
    q: "কার্যক্রম কখন হয়?",
    a: "সাপ্তাহিক সভা ও প্রশিক্ষণ সাধারণত ক্লাসের পরে হয়, যাতে পড়াশোনার ক্ষতি না হয়। ক্যাম্প ও বড় কর্মসূচি ছুটির দিনে আয়োজন করা হয়।",
  },
  {
    q: "কত দিনে উত্তর পাব?",
    a: "আবেদন বা বার্তা পাওয়ার সাধারণত ৩–৫ কার্যদিবসের মধ্যে আমাদের দল যোগাযোগ করে।",
  },
];

export default function ContactPage() {
  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="যোগাযোগ"
        title="আমাদের লিখুন"
        lead="সদস্যপদ, কার্যক্রম বা যেকোনো জিজ্ঞাসা — নিচের ফর্মটি পূরণ করুন, আমরা দ্রুত উত্তর দেব।"
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_.85fr]">
        <div className="surface p-6 md:p-8">
          <h2 className="text-xl font-bold text-[color:var(--forest)]">বার্তা পাঠান</h2>
          <p className="mt-1 text-sm text-slate-500">
            <span className="text-red-500">*</span> চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক।
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="grid content-start gap-4">
          {CHANNELS.map((channel) => (
            <article key={channel.label} className="surface flex items-start gap-4 p-5">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e7f2eb] text-lg text-[color:var(--forest)]"
                aria-hidden
              >
                {channel.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-wider text-[color:var(--leaf)] uppercase">
                  {channel.label}
                </p>
                {channel.lines.map((line) =>
                  channel.href ? (
                    <a
                      key={line}
                      href={channel.href}
                      className="mt-0.5 block text-sm font-semibold break-all text-slate-700 hover:text-[color:var(--leaf)]"
                    >
                      {line}
                    </a>
                  ) : (
                    <p key={line} className="mt-0.5 text-sm text-slate-600">
                      {line}
                    </p>
                  )
                )}
              </div>
            </article>
          ))}

          <article className="rounded-2xl bg-[color:var(--forest)] p-6 text-white">
            <p className="text-sm font-bold text-[#f5bf43]">সদস্য হতে চান?</p>
            <p className="mt-2 text-sm leading-6 text-white/85">
              যোগাযোগ ফর্মের বদলে সদস্যপদের আলাদা আবেদন ফর্ম ব্যবহার করলে আপনার আবেদন দ্রুত পর্যালোচনা করা হয়।
            </p>
            <a href="/join" className="btn-light mt-5 text-sm">
              আবেদন ফর্মে যান →
            </a>
          </article>
        </div>
      </div>

      <div className="mt-16">
        <p className="section-kicker">সাধারণ জিজ্ঞাসা</p>
        <h2 className="section-title">প্রশ্ন ও উত্তর</h2>

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {FAQ.map((item) => (
            <details key={item.q} className="surface group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[color:var(--forest)]">
                {item.q}
                <span className="text-[color:var(--leaf)] transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
