import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

function ChevronIcon() {
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

export function Select({
  options,
  value,
  onChange,
  ariaLabel,
  disabled = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const matchedIndex = options.findIndex((option) => option.value === value);
  const selectedIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const selectedOption = matchedIndex >= 0 ? options[matchedIndex] : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveIndex(selectedIndex);

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, options.length, selectedIndex]);

  function handleSelect(index: number) {
    const option = options[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || options.length === 0) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(selectedIndex);
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
        setIsOpen(true);
        setActiveIndex(selectedIndex);
      }
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
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
          if (!disabled && options.length > 0) {
            setIsOpen((current) => !current);
          }
        }}
        onKeyDown={handleKeyDown}
        className="
          w-full px-3 py-2
          flex items-center justify-between gap-2
          rounded-[10px]
          bg-field text-small text-content
          backdrop-glass
          cursor-pointer outline-none
          transition-colors
          hover:bg-field-active
          focus-visible:bg-field-active
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        <span>{selectedOption?.label ?? "—"}</span>

        <span
          className={`
            flex items-center justify-center text-content-muted
            transition-transform duration-200 ease-out
            ${isOpen ? "rotate-90" : "rotate-0"}
          `}
        >
          <ChevronIcon />
        </span>
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-hidden={!isOpen}
        className={`
          absolute top-full left-0 z-10 mt-1.5
          w-full max-h-60 overflow-y-auto
          rounded-[10px] bg-field backdrop-glass
          origin-top
          transition-all duration-200 ease-out
          ${
            isOpen
              ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
              : "opacity-0 -translate-y-1 scale-y-95 pointer-events-none"
          }
        `}
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
              w-full px-3 py-2
              text-left text-small text-content
              cursor-pointer outline-none
              transition-colors
              ${activeIndex === index ? "bg-field-active" : "hover:bg-field-active"}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
