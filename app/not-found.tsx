import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "পৃষ্ঠা পাওয়া যায়নি | রোভার স্কাউট গ্রুপ",
  description: "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি আর নেই বা ঠিকানা বদলে গেছে।",
  robots: { index: false, follow: true },
};

/** Shown for any unmatched route. Rendered inside SiteShell, so the navbar and footer stay. */
export default function NotFound() {
  return (
    <section className="container-x grid place-items-center py-24 text-center md:py-32">
      <span className="badge badge-gold">ত্রুটি ৪০৪</span>

      <p className="mt-6 text-6xl font-extrabold text-[color:var(--forest)] md:text-7xl">৪০৪</p>

      <h1 className="mt-4 text-2xl font-extrabold text-[color:var(--forest)] md:text-3xl">
        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="prose-bn mt-3 max-w-md text-slate-600">
        আপনি যে ঠিকানায় যেতে চেয়েছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে, নাম বদলেছে, অথবা কখনও ছিল না।
        নিচের যেকোনো পথে ফিরে যেতে পারেন।
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/">হোমপেজে ফিরুন</ButtonLink>
        <ButtonLink href="/notices" variant="outline">
          নোটিশ দেখুন
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          যোগাযোগ করুন
        </ButtonLink>
      </div>
    </section>
  );
}
