import Link from "next/link";
import { cn, toBn } from "@/lib/utils";

export type StatTone = "forest" | "amber" | "green" | "slate";

const TONES: Record<StatTone, { chip: string; accent: string }> = {
  forest: { chip: "bg-[#e7f2eb] text-[color:var(--forest)]", accent: "text-[color:var(--leaf)]" },
  amber: { chip: "bg-amber-50 text-amber-700", accent: "text-amber-600" },
  green: { chip: "bg-emerald-50 text-emerald-700", accent: "text-emerald-600" },
  slate: { chip: "bg-slate-100 text-slate-600", accent: "text-slate-500" },
};

/**
 * One metric tile on the admin dashboard. `changed` briefly highlights the tile
 * when its value moves, so a live-polling dashboard shows what just updated.
 */
export default function StatCard({
  label,
  value,
  detail,
  icon,
  href,
  tone = "forest",
  loading = false,
  changed = false,
}: {
  label: string;
  value: number;
  detail?: string;
  icon: string;
  href?: string;
  tone?: StatTone;
  loading?: boolean;
  changed?: boolean;
}) {
  const { chip, accent } = TONES[tone];

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-lg", chip)}>{icon}</span>
      </div>

      {loading ? (
        <div className="mt-4 h-9 w-16 skeleton" />
      ) : (
        <p className="mt-4 text-3xl font-bold text-[color:var(--forest)] tabular-nums">{toBn(value)}</p>
      )}

      {detail ? <p className={cn("mt-1 text-xs font-semibold", accent)}>{detail}</p> : null}
    </>
  );

  const shell = cn(
    "block rounded-2xl border bg-white p-5 shadow-[0_8px_24px_rgb(6_55_42_/_0.05)] transition duration-300",
    changed ? "border-[#f5bf43] ring-2 ring-[#f5bf43]/30" : "border-emerald-950/6",
    href && "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgb(6_55_42_/_0.1)]"
  );

  return href ? (
    <Link href={href} className={shell}>
      {body}
    </Link>
  ) : (
    <article className={shell}>{body}</article>
  );
}
