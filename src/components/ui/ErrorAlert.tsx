import type { PropsWithChildren } from "react";

import warningIcon from "../../assets/warning.svg";

type ErrorAlertProps = PropsWithChildren<{
  className?: string;
}>;

export function ErrorAlert({
  children,
  className = "",
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={`
        w-full p-3
        flex items-center justify-center gap-2
        rounded-lg
        bg-danger-surface text-danger text-body
        ${className}
      `}
    >
      <img src={warningIcon} alt="" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
