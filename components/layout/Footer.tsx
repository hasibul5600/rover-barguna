import Link from "next/link";
import { toBn } from "@/lib/utils";

const QUICK_LINKS: Array<[string, string]> = [
  ["/about", "আমাদের সম্পর্কে"],
  ["/activities", "কার্যক্রম"],
  ["/events", "ইভেন্ট"],
  ["/notices", "নোটিশ"],
  ["/gallery", "গ্যালারি"],
];

const GROUP_LINKS: Array<[string, string]> = [
  ["/leadership", "নেতৃত্ব ও সদস্য"],
  ["/alumni", "প্রাক্তন সদস্য"],
  ["/join", "সদস্য হোন"],
  ["/contact", "যোগাযোগ"],
  ["/admin/login", "অ্যাডমিন লগইন"],
];

export default function Footer() {
  return (
    <footer className="bg-[color:var(--forest)] text-white">
      <div className="texture-dots">
        <div className="container-x grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div>
            <p className="text-lg font-bold">বরগুনা পলিটেকনিক রোভার স্কাউট গ্রুপ</p>
            <div className="divider-gold mt-4" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              সেবার হাত বাড়িয়ে, দক্ষতা ও নেতৃত্বে গড়ে উঠছে আগামীর দায়িত্বশীল নাগরিক।
            </p>
          </div>

          <div>
            <p className="font-bold text-[#f5bf43]">দ্রুত লিংক</p>
            <ul className="mt-4 grid gap-2 text-sm text-white/75">
              {QUICK_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-underline hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-[#f5bf43]">গ্রুপ</p>
            <ul className="mt-4 grid gap-2 text-sm text-white/75">
              {GROUP_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-underline hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-[#f5bf43]">যোগাযোগ</p>
            <address className="mt-4 grid gap-2 text-sm leading-6 text-white/75 not-italic">
              <span>বরগুনা পলিটেকনিক ইনস্টিটিউট, বরগুনা সদর, বরগুনা ৮৭০০</span>
              <a href="mailto:roverbarguna@gmail.com" className="link-underline break-all hover:text-white">
                roverbarguna@gmail.com
              </a>
              <a href="tel:01700000000" className="link-underline hover:text-white">
                ০১৭০০-০০০০০০
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        © {toBn(new Date().getFullYear())} বরগুনা পলিটেকনিক রোভার স্কাউট গ্রুপ · সর্বস্বত্ব সংরক্ষিত
      </div>
    </footer>
  );
}
