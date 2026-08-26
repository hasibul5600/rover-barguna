import EventCard, { type EventItem } from "@/components/home/EventCard";
import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { listPublic } from "@/lib/publicApi";
import { isUpcoming, toBn } from "@/lib/utils";
import { EVENT_COLLECTION, type EventMeta } from "@/models/Event";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ইভেন্ট | রোভার স্কাউট গ্রুপ",
  description: "রোভার স্কাউট গ্রুপের আসন্ন ও সম্পন্ন ইভেন্টের তালিকা।",
};

async function getEvents(): Promise<EventItem[]> {
  try {
    const items = await listPublic(EVENT_COLLECTION);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      meta: item.meta as EventMeta,
    }));
  } catch (error) {
    console.error("Events page failed:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  const upcoming = events
    .filter((event) => isUpcoming(event.meta?.date))
    // Soonest first, so the next thing happening is at the top.
    .sort((a, b) => String(a.meta?.date).localeCompare(String(b.meta?.date)));

  const past = events
    .filter((event) => !isUpcoming(event.meta?.date))
    .sort((a, b) => String(b.meta?.date).localeCompare(String(a.meta?.date)));

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="ক্যালেন্ডার"
        title="ইভেন্ট ও কর্মসূচি"
        lead="তাঁবু জলসা, প্রশিক্ষণ কর্মশালা, সেবা সপ্তাহ — কী কখন হচ্ছে তা এখান থেকে জেনে নিন।"
        action={
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-green">আসন্ন {toBn(upcoming.length)}</span>
            <span className="badge badge-slate">সম্পন্ন {toBn(past.length)}</span>
          </div>
        }
      />

      {events.length ? (
        <>
          <h2 className="mt-12 text-lg font-bold text-[color:var(--forest)]">আসন্ন ইভেন্ট</h2>
          {upcoming.length ? (
            <div className="stagger mt-4 grid gap-4 lg:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-emerald-800/20 bg-white px-6 py-10 text-center text-sm text-slate-500">
              এই মুহূর্তে কোনো আসন্ন ইভেন্ট নেই। নতুন ঘোষণার জন্য নোটিশ বোর্ড দেখুন।
            </p>
          )}

          {past.length ? (
            <>
              <h2 className="mt-14 text-lg font-bold text-[color:var(--forest)]">সম্পন্ন ইভেন্ট</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="◷"
            title="এখনও কোনো ইভেন্ট প্রকাশ করা হয়নি"
            hint="অ্যাডমিন প্যানেল থেকে ইভেন্ট যোগ করলে সেগুলো এখানে দেখা যাবে।"
            action={
              <ButtonLink href="/notices" variant="outline">
                নোটিশ বোর্ড দেখুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
