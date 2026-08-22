import { Badge } from "../../../components/ui/Badge";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";

type BalanceCardProps = {
  currencyCode: string;
  name: string;
  amount: string;
  equivalent: string;
  onHold?: string;
  onHoldLabel: string;
  className?: string;
};

export function BalanceCard({
  currencyCode,
  name,
  amount,
  equivalent,
  onHold,
  onHoldLabel,
  className = "",
}: BalanceCardProps) {
  return (
    <div
      className={`
        w-full px-4 py-5 sm:px-6 lg:px-8
        flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center
        rounded-[10px] border-2 border-balance-rule bg-surface
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        <CurrencyIcon code={currencyCode} size={44} />

        <div className="flex flex-col gap-1">
          <span className="text-h2 text-content">{currencyCode}</span>
          <span className="text-body text-content-muted">{name}</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-1 sm:items-end">
        <div className="flex min-w-0 items-center gap-3">
          {onHold !== undefined && (
            <Badge variant="muted" className="max-w-full">
              <span className="truncate">
                {onHoldLabel}: {onHold}
              </span>
            </Badge>
          )}
          <span className="text-h2 text-content whitespace-nowrap">{amount}</span>
        </div>
        <div className="flex min-w-0 items-center text-body text-content-muted">
          <span className="whitespace-nowrap">{equivalent}</span>
        </div>
      </div>
    </div>
  );
}
