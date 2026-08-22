import { CurrencyFullIcon } from "../../icons/Currencies/CurrencyFull";

type CurrencyIconProps = {
  code: string;
  size?: number;
  className?: string;
  type?: "crypto" | "fiat";
};

export function CurrencyIcon({
  code,
  size = 24,
  className = "",
  type = "crypto",
}: CurrencyIconProps) {
  const normalizedCode = code.toUpperCase();

  if (type === "fiat") {
    return (
      <CurrencyFullIcon
        code={normalizedCode}
        size={size}
        padding={4}
        bgColor="var(--color-text-muted)"
        className={`shrink-0 ${className}`}
      />
    );
  }

  const imageSrc = `https://app.cr.bot/images/coins/${normalizedCode}.webp`;

  return (
    <img
      src={imageSrc}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`}
      loading="lazy"
      draggable={false}
    />
  );
}
