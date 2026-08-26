import { toBn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
};

/**
 * Headline counts for the public homepage. Values come from the database, so
 * they move as the admin adds members, events and photos.
 */
export default function Stats({ items }: { items: StatItem[] }) {
  return (
    <section className="border-y border-emerald-950/6 bg-white">
      <div className="container-x stagger grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e7f2eb] text-xl text-[color:var(--leaf)]">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-3xl font-bold leading-none text-[color:var(--forest)]">
                {toBn(item.value)}
                {item.suffix ? <span className="text-xl text-[color:var(--leaf)]">{item.suffix}</span> : null}
              </p>
              <p className="mt-1.5 truncate text-sm font-semibold text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
