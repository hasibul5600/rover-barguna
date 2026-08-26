import type { ReactNode } from "react";

/** The kicker + title + lead block that opens every public page. */
export default function PageHeader({
  kicker,
  title,
  lead,
  action,
}: {
  kicker: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl animate-rise">
        <p className="section-kicker">{kicker}</p>
        <h1 className="section-title">{title}</h1>
        {lead ? <p className="section-lead">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}
