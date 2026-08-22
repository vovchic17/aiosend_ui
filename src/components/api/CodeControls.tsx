import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type CodeOption = {
  value: string;
  label: string;
};

type CodeLineProps = {
  number: number;
  children?: ReactNode;
  parameter?: string;
  onParameterEnter?: (parameter: string) => void;
  onParameterLeave?: () => void;
};

type CodeSyntaxTone = "string" | "number" | "keyword";

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  type?: "text" | "number";
  tone?: Extract<CodeSyntaxTone, "string" | "number">;
  className?: string;
};

type CodeSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: CodeOption[];
  ariaLabel: string;
  disabled?: boolean;
  tone?: Extract<CodeSyntaxTone, "string" | "keyword">;
  className?: string;
};

export function CodeChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 3.33398L10.6667 8.00065L6 12.6673"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodeCopyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 9V6.2002C9 5.08009 9 4.51962 9.21799 4.0918C9.40973 3.71547 9.71547 3.40973 10.0918 3.21799C10.5196 3 11.0801 3 12.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21.0002 4.51962 21.0002 5.07967 21.0002 6.19978V11.7998C21.0002 12.9199 21.0002 13.48 20.7822 13.9078C20.5905 14.2841 20.2839 14.5905 19.9076 14.7822C19.4802 15 18.921 15 17.8031 15H15M15 15L15 12.1969C15 11.079 15 10.5192 14.7822 10.0918C14.5905 9.71547 14.2842 9.40973 13.9079 9.21799C13.4801 9 12.9203 9 11.8002 9H9H6.2002C5.08009 9 4.51962 9 4.0918 9.21799C3.71547 9.40973 3.40973 9.71547 3.21799 10.0918C3 10.5196 3 11.0801 3 12.2002V17.8002C3 18.9203 3 19.4801 3.21799 19.9079C3.40973 20.2842 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H11.8036C12.9215 21 13.4805 21 13.9079 20.7822C14.2842 20.5905 14.5905 20.2839 14.7822 19.9076C15 19.4802 15 18.921 15 17.8031V15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodeCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 12.0005L10.2426 16.2431L18.727 7.75781"
        stroke="#3AC53F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodePencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8.00002 5.33406L2.66669 10.6674V13.3341L5.33335 13.334L10.6667 8.00072M8.00002 5.33406L9.91244 3.42163L9.91359 3.42049C10.1768 3.15724 10.3087 3.02538 10.4607 2.97599C10.5946 2.93248 10.7388 2.93248 10.8727 2.97599C11.0246 3.02534 11.1563 3.15705 11.4192 3.41993L12.5791 4.5798C12.8431 4.84381 12.9752 4.97588 13.0246 5.1281C13.0681 5.26199 13.0681 5.40622 13.0246 5.54012C12.9752 5.69223 12.8433 5.82409 12.5797 6.08773L12.5791 6.08829L10.6667 8.00072M8.00002 5.33406L10.6667 8.00072"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodeLine({
  number,
  children,
  parameter,
  onParameterEnter,
  onParameterLeave,
}: CodeLineProps) {
  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (parameter && event.currentTarget.contains(event.target)) {
      onParameterEnter?.(parameter);
    }
  }

  return (
    <div
      className="grid min-h-7 grid-cols-[24px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[32px_minmax(0,1fr)] sm:gap-6"
      onMouseEnter={() => parameter && onParameterEnter?.(parameter)}
      onMouseLeave={onParameterLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={onParameterLeave}
    >
      <span className="select-none text-right text-code-m text-syntax-number">
        {number}
      </span>
      <div className="min-w-0 whitespace-pre-wrap text-code-m text-syntax-class">
        {children}
      </div>
    </div>
  );
}

function getInputToneClasses(tone: Extract<CodeSyntaxTone, "string" | "number">) {
  if (tone === "number") {
    return "border-syntax-parameter text-syntax-parameter";
  }

  return "border-syntax-string text-syntax-string";
}

function getSelectToneClasses(tone: Extract<CodeSyntaxTone, "string" | "keyword">) {
  if (tone === "keyword") {
    return "border-syntax-keyword text-syntax-keyword";
  }

  return "border-syntax-string text-syntax-string";
}

export function CodeInput({
  value,
  onChange,
  ariaLabel,
  type = "text",
  tone = type === "number" ? "number" : "string",
  className = "",
}: CodeInputProps) {
  const toneClasses = getInputToneClasses(tone);

  return (
    <span className={`relative inline-flex min-w-0 ${className}`}>
      <input
        type={type}
        value={value}
        aria-label={ariaLabel}
        min={type === "number" ? 1 : undefined}
        step={type === "number" ? 1 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`
          h-7 w-full min-w-0 rounded-lg border
          bg-code-surface py-0 pl-2.5 pr-8 text-code-m
          outline-none transition-colors
          hover:bg-field focus:bg-field-active
          ${toneClasses}
        `}
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-content-muted">
        <CodePencilIcon />
      </span>
    </span>
  );
}

export function CodeSelect({
  value,
  onChange,
  options,
  ariaLabel,
  disabled = false,
  tone = "string",
  className = "",
}: CodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    width: number;
    maxHeight: number;
    top?: number;
    bottom?: number;
    placement: "top" | "bottom";
  } | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const listboxId = useId();
  const toneClasses = getSelectToneClasses(tone);

  const matchedIndex = options.findIndex((option) => option.value === value);
  const selectedIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const selectedOption = matchedIndex >= 0 ? options[matchedIndex] : undefined;

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const gap = 6;
    const viewportPadding = 12;
    const preferredMaxHeight = 240;
    const availableBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
    const availableAbove = rect.top - gap - viewportPadding;
    const openAbove = availableBelow < 160 && availableAbove > availableBelow;
    const availableHeight = openAbove ? availableAbove : availableBelow;

    setMenuPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(80, Math.min(preferredMaxHeight, availableHeight)),
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
      placement: openAbove ? "top" : "bottom",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
      }
    };
  }, []);

  const closeMenu = useCallback(() => {
    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }

    setIsOpen(false);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setIsMenuMounted(false);
      closeTimerRef.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveIndex(selectedIndex);
    updateMenuPosition();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [closeMenu, isOpen, selectedIndex, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, listboxId]);

  function handleSelect(index: number) {
    const option = options[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setActiveIndex(index);
    closeMenu();
  }

  function openMenu() {
    if (disabled || options.length === 0) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }

    updateMenuPosition();
    setActiveIndex(selectedIndex);
    setIsMenuMounted(true);
    setIsOpen(false);

    openFrameRef.current = requestAnimationFrame(() => {
      setIsOpen(true);
      openFrameRef.current = null;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || options.length === 0) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => {
        return (current + direction + options.length) % options.length;
      });
      return;
    }

    if (isOpen && event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (isOpen && event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (isOpen) {
        handleSelect(activeIndex);
      } else {
        openMenu();
      }
    }
  }

  const dropdown =
    isMenuMounted && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <span
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-hidden={!isOpen}
            className={`
              fixed z-50 block overflow-y-auto overscroll-contain
              rounded-[10px] bg-field backdrop-glass
              transition-all duration-200 ease-out
              ${menuPosition.placement === "top" ? "origin-bottom" : "origin-top"}
              ${
                isOpen
                  ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
                  : menuPosition.placement === "top"
                    ? "opacity-0 translate-y-1 scale-y-95 pointer-events-none"
                    : "opacity-0 -translate-y-1 scale-y-95 pointer-events-none"
              }
            `}
            style={{
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              top: menuPosition.top,
              bottom: menuPosition.bottom,
            }}
            onWheel={(event) => event.stopPropagation()}
          >
            {options.map((option, index) => (
              <button
                id={`${listboxId}-option-${index}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => handleSelect(index)}
                className={`
                  w-full px-2.5 py-2 text-left text-code-m
                  cursor-pointer outline-none transition-colors
                  ${tone === "keyword" ? "text-syntax-keyword" : "text-syntax-string"}
                  ${activeIndex === index ? "bg-field-active" : "hover:bg-field-active"}
                `}
              >
                {option.label}
              </button>
            ))}
          </span>,
          document.body,
        )
      : null;

  return (
    <>
      <span ref={rootRef} className={`relative inline-flex min-w-0 ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled || options.length === 0}
          role="combobox"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen ? `${listboxId}-option-${activeIndex}` : undefined
          }
          onClick={() => {
            if (isOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
          onKeyDown={handleKeyDown}
          className={`
            flex h-7 w-full min-w-0 items-center justify-between gap-2
            rounded-lg border bg-code-surface py-0 pl-2.5 pr-2
            text-left text-code-m outline-none
            transition-colors
            hover:bg-field focus-visible:bg-field-active
            disabled:cursor-not-allowed disabled:opacity-50
            ${toneClasses}
          `}
        >
          <span className="min-w-0 truncate">{selectedOption?.label ?? "—"}</span>
          <span
            className={`
              flex shrink-0 items-center justify-center text-content-muted
              transition-transform duration-200 ease-out
              ${isOpen ? "rotate-90" : "rotate-0"}
            `}
          >
            <CodeChevronIcon />
          </span>
        </button>
      </span>
      {dropdown}
    </>
  );
}
