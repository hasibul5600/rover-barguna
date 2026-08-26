"use client";

import { useEffect } from "react";
import Button, { ButtonLink } from "@/components/ui/Button";

/**
 * Error boundary for the whole app. Catches render/data failures — for example
 * MongoDB being unreachable — and offers a retry instead of a blank screen.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaces in the Vercel function logs; the digest ties this render to that entry.
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <section className="container-x grid place-items-center py-24 text-center md:py-32">
      <span className="badge badge-red">সমস্যা হয়েছে</span>

      <h1 className="mt-6 text-2xl font-extrabold text-[color:var(--forest)] md:text-3xl">
        দুঃখিত, কিছু একটা ভুল হয়েছে
      </h1>

      <p className="prose-bn mt-3 max-w-md text-slate-600">
        পৃষ্ঠাটি লোড করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন — সমস্যা থেকে গেলে
        আমাদের জানান।
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>আবার চেষ্টা করুন</Button>
        <ButtonLink href="/" variant="outline">
          হোমপেজে ফিরুন
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          সমস্যা জানান
        </ButtonLink>
      </div>

      {error.digest ? (
        <p className="mt-8 text-xs text-slate-400">
          রেফারেন্স কোড: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
    </section>
  );
}
