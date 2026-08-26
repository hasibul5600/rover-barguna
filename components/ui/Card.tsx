import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** White rounded panel used across the public site and admin panel. */
export default function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Lift slightly on hover — for cards that link somewhere. */
  hover?: boolean;
  as?: "div" | "article" | "section" | "li";
}) {
  return <Tag className={cn("surface", hover && "surface-hover", className)}>{children}</Tag>;
}

/** Title row with an optional action on the right. */
export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4", className)}>
      <div className="min-w-0">
        <h3 className="font-bold text-[color:var(--forest)]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

/** Placeholder shown where a list has nothing in it yet. */
export function EmptyState({
  title,
  hint,
  icon = "◌",
  action,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-[#eef4f0] text-2xl text-[color:var(--leaf)]">{icon}</span>
      <p className="mt-4 font-bold text-[color:var(--forest)]">{title}</p>
      {hint ? <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
