import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        w-full min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8
        flex flex-col gap-5 sm:gap-6
        rounded-[20px] sm:rounded-3xl bg-surface
        ${className}
      `}
    >
      {children}
    </div>
  );
}
