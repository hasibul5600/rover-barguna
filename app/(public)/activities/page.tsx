import ActivityCard, { type ActivityItem } from "@/components/home/ActivityCard";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { listPublic } from "@/lib/publicApi";
import { toBn } from "@/lib/utils";
import { ACTIVITY_CATEGORIES, ACTIVITY_COLLECTION, type ActivityMeta } from "@/models/Activity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "কার্যক্রম | রোভার স্কাউট গ্রুপ",
  description: "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের নিয়মিত কার্যক্রম ও সেবামূলক কর্মসূচি।",
};

async function getActivities(): Promise<ActivityItem[]> {
  try {
    const items = await listPublic(ACTIVITY_COLLECTION);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      meta: item.meta as ActivityMeta,
    }));
  } catch (error) {
    console.error("Activities page failed:", error);
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  // Only show category chips that actually have something behind them.
  const counts = new Map<string, number>();
  for (const activity of activities) {
    const category = activity.meta?.category;
    if (category) counts.set(category, (counts.get(category) || 0) + 1);
  }
  const categories = ACTIVITY_CATEGORIES.filter((category) => counts.has(category));

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="আমরা যা করি"
        title="আমাদের কার্যক্রম"
        lead="সমাজসেবা, প্রশিক্ষণ, পরিবেশ সংরক্ষণ ও দুর্যোগে সহায়তা — সারা বছর ধরে চলা কর্মসূচিগুলো এখানে।"
        action={
          <ButtonLink href="/join" variant="primary">
            আমাদের সাথে যোগ দিন →
          </ButtonLink>
        }
      />

      {categories.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="badge badge-green">
              {category} · {toBn(counts.get(category) || 0)}
            </span>
          ))}
        </div>
      ) : null}

      {activities.length ? (
        <div className="stagger mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="✦"
            title="এখনও কোনো কার্যক্রম প্রকাশ করা হয়নি"
            hint="অ্যাডমিন প্যানেল থেকে কার্যক্রম যোগ করলে সেগুলো এখানে দেখা যাবে।"
            action={
              <ButtonLink href="/contact" variant="outline">
                যোগাযোগ করুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
