"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import StatCard, { type StatTone } from "@/components/admin/StatCard";
import { type AdminStats } from "@/lib/stats";
import { cn, timeAgoBn, toBn, truncate } from "@/lib/utils";

const POLL_MS = 10_000;

/** Which stat tiles to show, and where each one links. */
const TILES: Array<{
  key: keyof AdminStats;
  label: string;
  icon: string;
  href: string;
  tone: StatTone;
  detail: (stats: AdminStats) => string;
}> = [
  {
    key: "members",
    label: "মোট সদস্য",
    icon: "👥",
    href: "/admin/members",
    tone: "forest",
    detail: (s) => (s.membersThisMonth ? `+ ${toBn(s.membersThisMonth)} এই মাসে` : "এই মাসে নতুন কেউ নেই"),
  },
  {
    key: "requests",
    label: "সদস্য আবেদন",
    icon: "📝",
    href: "/admin/requests",
    tone: "amber",
    detail: (s) => (s.requestsNew ? `${toBn(s.requestsNew)}টি পর্যালোচনার অপেক্ষায়` : "সব আবেদন দেখা হয়েছে"),
  },
  {
    key: "events",
    label: "ইভেন্ট",
    icon: "📅",
    href: "/admin/events",
    tone: "green",
    detail: (s) => (s.eventsUpcoming ? `${toBn(s.eventsUpcoming)}টি আসন্ন` : "কোনো আসন্ন ইভেন্ট নেই"),
  },
  {
    key: "messages",
    label: "বার্তা",
    icon: "✉️",
    href: "/admin/messages",
    tone: "slate",
    detail: (s) => (s.messagesUnread ? `${toBn(s.messagesUnread)}টি অপঠিত` : "সব বার্তা পড়া হয়েছে"),
  },
];

/** Secondary counts that don't need their own tile. */
const MINI: Array<{ key: keyof AdminStats; label: string; href: string; icon: string }> = [
  { key: "activities", label: "কার্যক্রম", href: "/admin/activities", icon: "🎯" },
  { key: "notices", label: "নোটিশ", href: "/admin/notices", icon: "📢" },
  { key: "gallery", label: "গ্যালারি ছবি", href: "/admin/gallery", icon: "🖼️" },
];

const COLLECTION_LABELS: Record<string, { label: string; href: string; icon: string }> = {
  members: { label: "সদস্য", href: "/admin/members", icon: "👥" },
  requests: { label: "আবেদন", href: "/admin/requests", icon: "📝" },
  events: { label: "ইভেন্ট", href: "/admin/events", icon: "📅" },
  activities: { label: "কার্যক্রম", href: "/admin/activities", icon: "🎯" },
  notices: { label: "নোটিশ", href: "/admin/notices", icon: "📢" },
  gallery: { label: "গ্যালারি", href: "/admin/gallery", icon: "🖼️" },
  messages: { label: "বার্তা", href: "/admin/messages", icon: "✉️" },
};

const QUICK_ACTIONS: Array<[string, string]> = [
  ["নতুন নোটিশ প্রকাশ", "/admin/notices"],
  ["ইভেন্ট তৈরি করুন", "/admin/events"],
  ["গ্যালারিতে ছবি যোগ করুন", "/admin/gallery"],
  ["সদস্য যোগ করুন", "/admin/members"],
];

/**
 * The dashboard body. Server-rendered counts arrive as `initial`, then this polls
 * /api/admin/stats so the numbers stay live without a page reload. Polling pauses
 * while the tab is hidden and resumes (with an immediate fetch) on return, so a
 * dashboard left open overnight isn't hammering the database.
 */
export default function LiveDashboard({ initial }: { initial: AdminStats }) {
  const [stats, setStats] = useState(initial);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  /** Keys whose value moved on the last poll — briefly highlighted. */
  const [changed, setChanged] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  const previous = useRef(initial);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const refresh = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));

      const next: AdminStats = await response.json();
      const moved = [...TILES, ...MINI]
        .map((tile) => tile.key)
        .filter((key) => next[key] !== previous.current[key]);

      previous.current = next;
      setStats(next);
      setError("");

      if (moved.length) {
        setChanged(moved as string[]);
        clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setChanged([]), 2500);
      }
    } catch {
      setError("লাইভ আপডেট পাওয়া যাচ্ছে না। সংযোগ পরীক্ষা করুন।");
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      stop();
      timer = setInterval(() => refresh(), POLL_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(highlightTimer.current);
    };
  }, [refresh]);

  // Re-render once a second so the "শেষ আপডেট" label counts up on its own.
  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  void tick;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--forest)]">স্বাগতম, অ্যাডমিন</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--leaf)]">
              <span className="live-dot" aria-hidden />
              লাইভ
            </span>
            <span className="text-slate-300">•</span>
            <span>শেষ আপডেট {stats.at ? timeAgoBn(stats.at) : "—"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refresh(true)}
            disabled={refreshing}
            className="btn-outline text-sm"
          >
            <span className={cn("inline-block", refreshing && "animate-spin")} aria-hidden>
              ↻
            </span>
            {refreshing ? "আপডেট হচ্ছে…" : "রিফ্রেশ"}
          </button>
          <Link href="/admin/requests" className="btn-primary text-sm">
            আবেদন দেখুন →
          </Link>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {error}
        </p>
      ) : null}

      <section className="mt-7 grid gap-4 stagger sm:grid-cols-2 xl:grid-cols-4">
        {TILES.map((tile) => (
          <StatCard
            key={tile.key}
            label={tile.label}
            value={stats[tile.key] as number}
            detail={tile.detail(stats)}
            icon={tile.icon}
            href={tile.href}
            tone={tile.tone}
            changed={changed.includes(tile.key)}
          />
        ))}
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {MINI.map((mini) => (
          <Link
            key={mini.key}
            href={mini.href}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgb(6_55_42_/_0.08)]",
              changed.includes(mini.key) ? "border-[#f5bf43] ring-2 ring-[#f5bf43]/30" : "border-emerald-950/6"
            )}
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <span aria-hidden>{mini.icon}</span>
              {mini.label}
            </span>
            <span className="text-lg font-bold text-[color:var(--forest)] tabular-nums">
              {toBn(stats[mini.key] as number)}
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_.8fr]">
        <article className="overflow-hidden rounded-2xl border border-emerald-950/6 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-bold text-[color:var(--forest)]">সাম্প্রতিক কার্যকলাপ</h3>
              <p className="text-xs text-slate-500">সব বিভাগ থেকে সর্বশেষ যোগ হওয়া তথ্য</p>
            </div>
            <span className="badge badge-green shrink-0">
              <span className="live-dot" aria-hidden />
              রিয়েলটাইম
            </span>
          </div>

          {stats.recent.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.recent.map((item) => {
                const meta = COLLECTION_LABELS[item.collection] || {
                  label: item.collection,
                  href: "/admin",
                  icon: "•",
                };
                const subtitle = String(item.meta.department || item.meta.name || item.meta.venue || "");

                return (
                  <li key={item.id}>
                    <Link
                      href={meta.href}
                      className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#fafcfa]"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e7f2eb] text-sm" aria-hidden>
                        {meta.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-700">
                          {truncate(item.title || "শিরোনামহীন", 60)}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {meta.label}
                          {subtitle ? ` • ${truncate(subtitle, 28)}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs whitespace-nowrap text-slate-400">
                        {timeAgoBn(item.createdAt)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-3xl" aria-hidden>
                🗂️
              </p>
              <p className="mt-3 font-semibold text-slate-600">এখনো কোনো তথ্য নেই</p>
              <p className="mt-1 text-sm text-slate-500">
                সাইডবার থেকে সদস্য, ইভেন্ট বা নোটিশ যোগ করুন — এখানে সাথে সাথে দেখা যাবে।
              </p>
            </div>
          )}
        </article>

        <article className="texture-dots rounded-2xl bg-[color:var(--forest)] p-6 text-white">
          <p className="text-sm font-semibold text-[#f5bf43]">দ্রুত কাজ</p>
          <h3 className="mt-2 text-xl font-bold">আজ কী পরিচালনা করবেন?</h3>

          <div className="mt-5 grid gap-2">
            {QUICK_ACTIONS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20"
              >
                {label}
                <span className="text-[#f5bf43]" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-semibold text-[#f5bf43]">অপেক্ষমাণ</p>
            <p className="mt-1 text-sm text-white/80">
              {stats.requestsNew || stats.messagesUnread
                ? `${toBn(stats.requestsNew)}টি নতুন আবেদন ও ${toBn(stats.messagesUnread)}টি অপঠিত বার্তা রয়েছে।`
                : "সব কাজ শেষ — নতুন কিছু অপেক্ষা করছে না।"}
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
