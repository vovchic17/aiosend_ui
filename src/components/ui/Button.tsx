import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
  }
>;

export function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        px-6 py-3
        rounded-[10px]
        cursor-pointer
        outline-none
        bg-button
        hover:bg-button-hover
        active:bg-button-active
        text-on-button
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-button
        disabled:active:bg-button
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
