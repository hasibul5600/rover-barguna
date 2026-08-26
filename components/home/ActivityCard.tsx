import { truncate } from "@/lib/utils";
import type { ActivityMeta } from "@/models/Activity";

export type ActivityItem = {
  id: string;
  title: string;
  description?: string;
  meta?: ActivityMeta;
};

/** One programme card, used on the homepage and the /activities listing. */
export default function ActivityCard({ activity }: { activity: ActivityItem }) {
  const { category, icon, frequency, participants } = activity.meta || {};

  return (
    <article className="surface surface-hover flex flex-col p-7">
      <span className="grid size-12 place-items-center rounded-xl bg-[#e7f2eb] text-xl font-bold text-[color:var(--leaf)]">
        {icon || "✦"}
      </span>

      {category ? <p className="mt-5 text-xs font-bold tracking-wider text-[color:var(--leaf)] uppercase">{category}</p> : null}

      <h3 className="mt-1.5 text-xl font-bold text-[color:var(--forest)]">{activity.title}</h3>

      {activity.description ? (
        <p className="mt-2 grow text-sm leading-6 text-slate-600">{truncate(activity.description, 160)}</p>
      ) : (
        <div className="grow" />
      )}

      {frequency || participants ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs">
          {frequency ? <span className="badge badge-slate">⟳ {frequency}</span> : null}
          {participants ? <span className="badge badge-green">◍ {participants} জন</span> : null}
        </div>
      ) : null}
    </article>
  );
}
