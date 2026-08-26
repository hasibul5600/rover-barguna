import { formatBnDate, isUpcoming, toBn, truncate } from "@/lib/utils";
import type { EventMeta } from "@/models/Event";

export type EventItem = {
  id: string;
  title: string;
  description?: string;
  meta?: EventMeta;
};

const BN_MONTHS_SHORT = ["জান", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ", "অক্টো", "নভে", "ডিসে"];

/** Event card with a date chip. Used on the homepage and the /events listing. */
export default function EventCard({ event }: { event: EventItem }) {
  const { date, time, venue, seats } = event.meta || {};
  const parsed = date ? new Date(date) : null;
  const valid = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
  const upcoming = isUpcoming(date);

  return (
    <article className="surface surface-hover flex gap-5 p-5 sm:p-6">
      <div
        className={`grid h-20 w-16 shrink-0 place-items-center rounded-xl text-center leading-none ${
          upcoming ? "bg-[color:var(--forest)] text-white" : "bg-[#eef2f0] text-slate-500"
        }`}
      >
        {valid ? (
          <div>
            <p className="text-2xl font-bold">{toBn(valid.getDate())}</p>
            <p className={`mt-1 text-xs font-semibold ${upcoming ? "text-[#f5bf43]" : ""}`}>
              {BN_MONTHS_SHORT[valid.getMonth()]}
            </p>
          </div>
        ) : (
          <span className="text-xl">◷</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`badge ${upcoming ? "badge-green" : "badge-slate"}`}>
            {upcoming ? "আসন্ন" : "সম্পন্ন"}
          </span>
          {seats ? <span className="badge badge-gold">আসন {toBn(seats)}</span> : null}
        </div>

        <h3 className="mt-2 font-bold text-[color:var(--forest)]">{event.title}</h3>

        {event.description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">{truncate(event.description, 120)}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
          {valid ? <span>◷ {formatBnDate(valid)}</span> : null}
          {time ? <span>⏱ {time}</span> : null}
          {venue ? <span>⌂ {venue}</span> : null}
        </div>
      </div>
    </article>
  );
}
