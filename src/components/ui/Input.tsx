import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full h-11 px-5 py-2
        rounded-[10px]
        bg-field text-content
        placeholder:text-field-content
        focus:bg-field-active
        outline-none transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
