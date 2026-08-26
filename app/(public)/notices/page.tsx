import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { listPublic } from "@/lib/publicApi";
import { cn, formatBnDate, isUpcoming, timeAgoBn } from "@/lib/utils";
import { NOTICE_COLLECTION, type NoticeMeta } from "@/models/Notice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "নোটিশ | রোভার স্কাউট গ্রুপ",
  description: "রোভার স্কাউট গ্রুপের সর্বশেষ নোটিশ ও ঘোষণা।",
};

type Notice = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  meta: NoticeMeta;
};

async function getNotices(): Promise<Notice[]> {
  try {
    const items = await listPublic(NOTICE_COLLECTION);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      createdAt: item.createdAt,
      meta: item.meta as NoticeMeta,
    }));
  } catch (error) {
    console.error("Notices page failed:", error);
    return [];
  }
}

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="ঘোষণা"
        title="নোটিশ বোর্ড"
        lead="নিবন্ধন, প্রশিক্ষণ ও সভার সব ঘোষণা এখানে প্রকাশ করা হয়। নিয়মিত চোখ রাখুন।"
        action={
          <ButtonLink href="/contact" variant="outline">
            প্রশ্ন আছে?
          </ButtonLink>
        }
      />

      {notices.length ? (
        <ul className="stagger mt-10 grid gap-4">
          {notices.map((notice) => {
            const urgent = notice.meta.category === "জরুরি";
            // A deadline that hasn't passed is worth calling out.
            const deadlineLive = notice.meta.deadline ? isUpcoming(notice.meta.deadline) : false;

            return (
              <li
                key={notice.id}
                className={cn(
                  "surface surface-hover p-6",
                  urgent && "border-red-200 bg-red-50/40"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {notice.meta.category ? (
                    <span className={cn("badge", urgent ? "badge-red" : "badge-green")}>
                      {notice.meta.category}
                    </span>
                  ) : null}
                  {notice.meta.deadline ? (
                    <span className={cn("badge", deadlineLive ? "badge-gold" : "badge-slate")}>
                      শেষ তারিখ {formatBnDate(notice.meta.deadline)}
                    </span>
                  ) : null}
                  <span className="ml-auto text-xs font-semibold text-slate-400">
                    {timeAgoBn(notice.createdAt)}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-[color:var(--forest)]">{notice.title}</h2>

                {notice.description ? (
                  <p className="prose-bn mt-2 whitespace-pre-line text-slate-600">{notice.description}</p>
                ) : null}

                {notice.meta.attachment ? (
                  <a
                    href={notice.meta.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--leaf)] hover:underline"
                  >
                    সংযুক্তি দেখুন
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="◈"
            title="এখনও কোনো নোটিশ প্রকাশ করা হয়নি"
            hint="নতুন ঘোষণা এলে সেটি এখানে সবার আগে দেখা যাবে।"
            action={
              <ButtonLink href="/events" variant="outline">
                ইভেন্ট দেখুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
