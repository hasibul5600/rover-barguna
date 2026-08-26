"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  /** Cell renderer. Falls back to the raw value at `key`. */
  render?: (row: T) => ReactNode;
  className?: string;
  /** Hide on small screens to keep the table readable on phones. */
  hideBelow?: "sm" | "md" | "lg";
};

const HIDE: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

/**
 * Generic admin table with a sticky header, loading skeleton and empty state.
 * Keeps every management screen looking the same.
 */
export default function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  rows,
  loading = false,
  empty,
  actions,
  minWidth = "40rem",
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: ReactNode;
  /** Right-aligned per-row controls. */
  actions?: (row: T) => ReactNode;
  minWidth?: string;
}) {
  if (loading) {
    return (
      <div className="grid gap-2 p-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-11 skeleton" />
        ))}
      </div>
    );
  }

  if (!rows.length) return <>{empty}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-[#f8faf8] text-xs text-slate-500">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn("px-5 py-3 font-semibold", column.hideBelow && HIDE[column.hideBelow], column.className)}
              >
                {column.header}
              </th>
            ))}
            {actions ? (
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                কাজ
              </th>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row._id || row.id || index}
              className="border-t border-slate-100 transition-colors hover:bg-[#fafcfa]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn("px-5 py-4 align-middle", column.hideBelow && HIDE[column.hideBelow], column.className)}
                >
                  {column.render ? column.render(row) : ((row as Record<string, unknown>)[column.key] as ReactNode) ?? "—"}
                </td>
              ))}
              {actions ? <td className="px-5 py-4 text-right whitespace-nowrap">{actions(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
