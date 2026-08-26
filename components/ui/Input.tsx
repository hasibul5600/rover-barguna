import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** What every field accepts. The controls below supply their own children. */
type FieldProps = {
  label: ReactNode;
  error?: string;
  help?: string;
  required?: boolean;
  className?: string;
};

type FieldWrapProps = FieldProps & { children: ReactNode };

/** Label + control + error message. Shared by every input below. */
function FieldWrap({ label, error, help, required, className, children }: FieldWrapProps) {
  return (
    <label className={cn("field-label", className)}>
      <span>
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs font-semibold text-red-600">{error}</span>
      ) : help ? (
        <span className="text-xs font-normal text-slate-400">{help}</span>
      ) : null}
    </label>
  );
}

export default function Input({
  label,
  error,
  help,
  className,
  required,
  ...rest
}: FieldProps & Omit<ComponentProps<"input">, "className" | "children">) {
  return (
    <FieldWrap label={label} error={error} help={help} required={required} className={className}>
      <input className="field" aria-invalid={error ? true : undefined} required={required} {...rest} />
    </FieldWrap>
  );
}

export function Textarea({
  label,
  error,
  help,
  className,
  required,
  rows = 4,
  ...rest
}: FieldProps & Omit<ComponentProps<"textarea">, "className" | "children">) {
  return (
    <FieldWrap label={label} error={error} help={help} required={required} className={className}>
      <textarea className="field resize-y" rows={rows} aria-invalid={error ? true : undefined} required={required} {...rest} />
    </FieldWrap>
  );
}

/** Either a plain value (used as its own label) or an explicit value/label pair. */
export type SelectOption = string | { value: string; label: string };

export function Select({
  label,
  error,
  help,
  className,
  required,
  options,
  placeholder = "নির্বাচন করুন",
  ...rest
}: FieldProps & { options: SelectOption[]; placeholder?: string } & Omit<ComponentProps<"select">, "className" | "children">) {
  return (
    <FieldWrap label={label} error={error} help={help} required={required} className={className}>
      <select className="field" aria-invalid={error ? true : undefined} required={required} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </FieldWrap>
  );
}

/** Inline success / error banner for form submissions. */
export function FormNotice({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={cn("animate-pop rounded-xl border px-4 py-3 text-sm font-semibold", styles)}>
      {children}
    </p>
  );
}
