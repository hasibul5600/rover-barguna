import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  light: "btn-light",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-outline !border-red-200 !text-red-600 hover:!bg-red-50 hover:!border-red-300",
};

const SIZES: Record<Size, string> = {
  sm: "!px-3.5 !py-2 text-sm",
  md: "text-sm sm:text-base",
  lg: "!px-6 !py-3.5 text-base",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

function classes({ variant = "primary", size = "md", className }: BaseProps) {
  return cn(VARIANTS[variant], SIZES[size], className);
}

/** Anchor-flavoured button. Use for navigation. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={classes({ variant, size, className, children })} {...rest}>
      {children}
    </Link>
  );
}

/** Real <button>. Shows a spinner and blocks input while `loading`. */
export default function Button({
  variant,
  size,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      className={classes({ variant, size, className, children })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
