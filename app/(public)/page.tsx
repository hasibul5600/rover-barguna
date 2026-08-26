import Image from "next/image";
import ActivityCard, { type ActivityItem } from "@/components/home/ActivityCard";
import EventCard, { type EventItem } from "@/components/home/EventCard";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import { ButtonLink } from "@/components/ui/Button";
import { listPublic } from "@/lib/publicApi";
import { formatBnDate, isUpcoming, timeAgoBn, truncate } from "@/lib/utils";
import type { ActivityMeta } from "@/models/Activity";
import type { EventMeta } from "@/models/Event";
import type { NoticeMeta } from "@/models/Notice";

export const dynamic = "force-dynamic";

const PILLARS = [
  ["✦", "সেবা", "মানুষ ও সমাজের পাশে দাঁড়ানো আমাদের অঙ্গীকার।"],
  ["◒", "দক্ষতা", "প্রশিক্ষণ ও অভিজ্ঞতায় নিজেকে প্রতিদিন গড়ে তুলি।"],
  ["⌁", "নেতৃত্ব", "দলগত কাজে নেতৃত্বের গুণে আলোকিত হই।"],
] as const;

/**
 * One pass over the database for everything the homepage shows. Each list is
 * fetched independently so a single failure can't blank the whole page.
 */
async function getHomeData() {
  const [members, activities, events, notices, gallery] = await Promise.all([
    listPublic("members", 200).catch(() => []),
    listPublic("activities", 6).catch(() => []),
    listPublic("events", 50).catch(() => []),
    listPublic("notices", 3).catch(() => []),
    listPublic("gallery", 6).catch(() => []),
  ]);

  return { members, activities, events, notices, gallery };
}

export default async function HomePage() {
  const { members, activities, events, notices, gallery } = await getHomeData();

  const upcoming = events
    .filter((event) => isUpcoming((event.meta as EventMeta).date))
    .sort((a, b) => String((a.meta as EventMeta).date).localeCompare(String((b.meta as EventMeta).date)))
    .slice(0, 4);

  const stats = [
    { label: "সক্রিয় সদস্য", value: members.length, icon: "👥" },
    { label: "নিয়মিত কার্যক্রম", value: activities.length, icon: "✦" },
    { label: "আয়োজিত ইভেন্ট", value: events.length, icon: "◷" },
    { label: "গ্যালারির ছবি", value: gallery.length, icon: "▧" },
  ];

  // Only worth a strip of its own once there's something in the database.
  const hasStats = stats.some((stat) => stat.value > 0);

  return (
    <>
      <Hero />

      {hasStats ? <Stats items={stats} /> : null}

      {notices.length ? (
        <section className="border-b border-emerald-950/6 bg-[#fffaed]">
          <div className="container-x flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
            <span className="badge badge-gold shrink-0">
              <span className="live-dot" aria-hidden />
              সর্বশেষ নোটিশ
            </span>
            <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-2 text-sm">
              {notices.map((notice) => (
                <li key={notice.id} className="min-w-0">
                  <a href="/notices" className="link-underline font-semibold text-[color:var(--forest)]">
                    {truncate(notice.title, 64)}
                  </a>
                  {(notice.meta as NoticeMeta).deadline ? (
                    <span className="ml-2 text-xs text-amber-700">
                      শেষ {formatBnDate((notice.meta as NoticeMeta).deadline)}
                    </span>
                  ) : (
                    <span className="ml-2 text-xs text-slate-400">{timeAgoBn(notice.createdAt)}</span>
                  )}
                </li>
              ))}
            </ul>
            <a href="/notices" className="ml-auto shrink-0 text-sm font-bold text-[color:var(--leaf)] hover:underline">
              সব নোটিশ →
            </a>
          </div>
        </section>
      ) : null}

      <section className="container-x py-18 md:py-24">
        <div className="max-w-2xl">
          <p className="section-kicker">আমাদের পরিচয়</p>
          <h2 className="section-title">ভালো মানুষ গড়ার এক অনুপ্রেরণার ঠিকানা</h2>
          <p className="section-lead">
            রোভারিং শুধু একটি সংগঠন নয় — এটি শেখা, সেবা করা এবং সম্মিলিত শক্তিতে ইতিবাচক পরিবর্তন আনার একটি
            জীবনধারা।
          </p>
        </div>

        <div className="stagger mt-10 grid gap-5 md:grid-cols-3">
          {PILLARS.map(([icon, title, text]) => (
            <article key={title} className="surface surface-hover p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#e7f2eb] text-xl font-bold text-[color:var(--leaf)]">
                {icon}
              </span>
              <h3 className="mt-5 text-xl font-bold text-[color:var(--forest)]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {activities.length ? (
        <section className="bg-white py-16 md:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="section-kicker">কার্যক্রম</p>
                <h2 className="section-title">আমরা যা করি</h2>
              </div>
              <ButtonLink href="/activities" variant="outline">
                সব কার্যক্রম →
              </ButtonLink>
            </div>

            <div className="stagger mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {activities.slice(0, 3).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={
                    {
                      id: activity.id,
                      title: activity.title,
                      description: activity.description,
                      meta: activity.meta as ActivityMeta,
                    } satisfies ActivityItem
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {upcoming.length ? (
        <section className="container-x py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="section-kicker">ক্যালেন্ডার</p>
              <h2 className="section-title">আসন্ন ইভেন্ট</h2>
            </div>
            <ButtonLink href="/events" variant="outline">
              সব ইভেন্ট →
            </ButtonLink>
          </div>

          <div className="stagger mt-10 grid gap-4 lg:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={
                  {
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    meta: event.meta as EventMeta,
                  } satisfies EventItem
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="bg-white py-16 md:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="section-kicker">স্মৃতিচারণ</p>
                <h2 className="section-title">সাম্প্রতিক ছবি</h2>
              </div>
              <ButtonLink href="/gallery" variant="outline">
                পুরো গ্যালারি →
              </ButtonLink>
            </div>

            <div className="stagger mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {gallery.map((photo) => {
                const image = typeof photo.meta.image === "string" ? photo.meta.image : "";
                if (!image) return null;

                return (
                  <a
                    key={photo.id}
                    href="/gallery"
                    title={photo.title}
                    className="zoom-parent aspect-square overflow-hidden rounded-2xl bg-[#e7f2eb]"
                  >
                    {/* Cloudinary-hosted; next/image isn't configured for that domain. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={photo.title}
                      loading="lazy"
                      className="zoom-img size-full object-cover"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#e8f0ea]">
        <div className="container-x grid items-center gap-10 py-14 md:grid-cols-[.85fr_1.15fr] md:py-20">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem]">
            <Image
              src="/images/rover-team.jpg"
              alt="রোভারদের কার্যক্রম"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="section-kicker">আমাদের সাথে পথচলা</p>
            <h2 className="section-title">শিখুন, অংশ নিন, পরিবর্তন আনুন</h2>
            <p className="section-lead max-w-xl">
              স্বেচ্ছাসেবা, দক্ষতা উন্নয়ন এবং আনন্দময় ক্যাম্পের অভিজ্ঞতার জন্য আজই আমাদের রোভার পরিবারে যুক্ত হোন।
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/join" variant="primary" size="lg">
                যোগদানের আবেদন করুন →
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" size="lg">
                আমাদের সম্পর্কে
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
