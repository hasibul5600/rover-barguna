import Image from "next/image";
import Link from "next/link";

const marks = [
  ["সেবা", "মানুষের জন্য কাজ"],
  ["শৃঙ্খলা", "নিজেকে গড়ার অভ্যাস"],
  ["ভ্রাতৃত্ব", "একটি শক্তিশালী পরিবার"],
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[color:var(--forest)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,#2a8b68_0,transparent_28%),radial-gradient(circle_at_8%_80%,#176346_0,transparent_25%)]" />
      <div className="dot-grid absolute inset-0 opacity-60" />

      <div className="container-x relative grid items-center gap-10 py-16 md:grid-cols-[1.04fr_.96fr] md:py-24">
        <div className="animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5bf43]/50 bg-white/8 px-4 py-1 text-sm font-semibold text-[#f9d87f] backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#f5bf43]" />
            প্রতিজ্ঞায় এক • সেবায় অগ্রণী
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.16] md:text-5xl lg:text-6xl">
            সেবার পথে
            <br />
            <span className="text-[#f5bf43]">একসাথে এগিয়ে চলি</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78 md:text-lg">
            বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপে স্বাগতম। প্রশিক্ষণ, ক্যাম্প ও সমাজসেবার
            মাধ্যমে আমরা গড়ি মানবিক নেতৃত্বের আগামী।
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="btn-primary">
              সদস্য হতে চাই →
            </Link>
            <Link href="/activities" className="btn-light">
              কার্যক্রম দেখুন
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-rise [animation-delay:.12s]">
          <div className="absolute -inset-3 rotate-3 rounded-[2rem] border border-[#f5bf43]/30" />
          <div className="relative aspect-4/3 overflow-hidden rounded-[1.6rem] shadow-2xl">
            <Image
              src="/images/rover-team.jpg"
              alt="বরগুনা পলিটেকনিক রোভার স্কাউট গ্রুপ"
              fill
              priority
              sizes="(max-width:768px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062d22]/70 via-transparent" />
            <p className="absolute bottom-5 left-5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              আমাদের রোভার পরিবার
            </p>
          </div>
        </div>
      </div>

      <div className="container-x relative grid border-t border-white/10 sm:grid-cols-3">
        {marks.map(([title, text]) => (
          <div key={title} className="border-white/10 py-5 last:border-0 sm:border-r sm:px-6 sm:first:pl-0">
            <p className="font-bold text-[#f5bf43]">{title}</p>
            <p className="text-sm text-white/65">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
