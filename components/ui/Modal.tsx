"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centred dialog. Closes on Escape and on backdrop click, locks background
 * scroll while open, and moves focus inside on mount.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first control so keyboard users land inside the dialog.
    panel.current?.querySelector<HTMLElement>("input, textarea, select, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-3xl" };

  return (
    <div
      className="fixed inset-0 z-100 grid animate-fade place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={cn("w-full animate-pop rounded-2xl bg-white shadow-2xl", widths[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-[color:var(--forest)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="grid size-8 shrink-0 place-items-center rounded-full text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

/** Small confirm dialog for destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "আপনি কি নিশ্চিত?",
  message,
  confirmLabel = "হ্যাঁ, মুছে ফেলুন",
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost !px-4 !py-2 text-sm">
            বাতিল
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="btn-outline !border-red-200 !px-4 !py-2 text-sm !text-red-600 hover:!border-red-300 hover:!bg-red-50 disabled:opacity-60"
          >
            {busy ? "মুছে ফেলা হচ্ছে…" : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-slate-600">{message}</p>
    </Modal>
  );
}
