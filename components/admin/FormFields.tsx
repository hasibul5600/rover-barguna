"use client";

import Input, { Select, Textarea } from "@/components/ui/Input";
import type { FieldErrors, FieldSpec } from "@/lib/validators";

/**
 * Renders a form body from a FieldSpec list (see models/*). Keeps every admin
 * create/edit form consistent without hand-writing the inputs each time.
 */
export default function FormFields({
  fields,
  values,
  errors = {},
  onChange,
  disabled = false,
}: {
  fields: FieldSpec[];
  values: Record<string, string>;
  errors?: FieldErrors;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const common = {
          label: field.label,
          error: errors[field.name],
          help: field.help,
          required: field.required,
          disabled,
          value: values[field.name] ?? "",
          onChange: (event: { target: { value: string } }) => onChange(field.name, event.target.value),
        };

        // Long-form inputs get the full row.
        if (field.type === "textarea") {
          return (
            <Textarea
              key={field.name}
              {...common}
              placeholder={field.placeholder}
              rows={4}
              className="sm:col-span-2"
            />
          );
        }

        if (field.type === "select") {
          return <Select key={field.name} {...common} options={field.options || []} />;
        }

        return (
          <Input
            key={field.name}
            {...common}
            type={field.type === "number" ? "number" : field.type}
            placeholder={field.placeholder}
            inputMode={field.type === "tel" ? "numeric" : undefined}
          />
        );
      })}
    </div>
  );
}

/** Split a flat value bag into the ContentItem columns plus a meta object. */
export function splitFieldValues(fields: FieldSpec[], values: Record<string, string>) {
  const core = { title: "", description: "" };
  const meta: Record<string, string> = {};

  for (const field of fields) {
    const value = (values[field.name] ?? "").trim();
    if (field.name === "title") core.title = value;
    else if (field.name === "description") core.description = value;
    else if (value) meta[field.name] = value;
  }

  return { ...core, meta };
}

/** Rebuild a flat value bag from a saved item, for the edit form. */
export function mergeFieldValues(
  fields: FieldSpec[],
  item?: { title?: string; description?: string; meta?: Record<string, unknown> } | null
) {
  const values: Record<string, string> = {};
  for (const field of fields) {
    if (field.name === "title") values.title = item?.title || "";
    else if (field.name === "description") values.description = item?.description || "";
    else values[field.name] = String(item?.meta?.[field.name] ?? "");
  }
  return values;
}
