import type { PropsWithChildren } from "react";

type BadgeVariant = "active" | "primary" | "muted";

type BadgeProps = PropsWithChildren<{
  variant?: BadgeVariant;
  className?: string;
}>;

const variants: Record<BadgeVariant, string> = {
  active: "bg-badge-active-surface text-badge-active",
  primary: "bg-badge-primary-surface text-badge-primary",
  muted: "bg-badge-muted-surface text-badge-muted",
};

export function Badge({
  children,
  variant = "muted",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        h-5.5 px-3
        inline-flex items-center justify-center
        rounded-full whitespace-nowrap text-small
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
