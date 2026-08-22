import type {
  CryptoPayBalance,
  CryptoPayExchangeRate,
} from "../../../api/crypto-pay";
import { useLanguage } from "../../../i18n";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { Select } from "../../../components/ui/Select";
import { BalanceCard } from "./BalanceCard";
import { formatBalance, formatEquivalent, getRate } from "../utils";

type SelectOption = {
  value: string;
  label: string;
};

type BalancesSectionProps = {
  balances: CryptoPayBalance[];
  exchangeRates: CryptoPayExchangeRate[];
  currencyNames: Map<string, string>;
  currencyOptions: SelectOption[];
  selectedCurrency: string;
  onCurrencyChange: (value: string) => void;
  isLoading: boolean;
  hasLoaded: boolean;
};

export function BalancesSection({
  balances,
  exchangeRates,
  currencyNames,
  currencyOptions,
  selectedCurrency,
  onCurrencyChange,
  isLoading,
  hasLoaded,
}: BalancesSectionProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-h1 text-content">{t.dashboard.balances}</h2>

        {currencyOptions.length > 0 && (
          <Select
            value={selectedCurrency}
            onChange={onCurrencyChange}
            options={currencyOptions}
            ariaLabel={t.accessibility.currencySelect}
          />
        )}
      </div>

      {isLoading && !hasLoaded ? (
        <LoadingState label={t.common.loading} />
      ) : balances.length === 0 ? (
        <EmptyState message={t.dashboard.balancesEmpty} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {balances.map((balance) => {
            const amount = Number(balance.available);
            const onHold = balance.onhold;
            const rate = getRate(
              balance.currency_code,
              selectedCurrency,
              exchangeRates,
            );
            const equivalent =
              rate !== null && Number.isFinite(amount) ? amount * rate : null;

            return (
              <BalanceCard
                key={balance.currency_code}
                currencyCode={balance.currency_code}
                name={
                  currencyNames.get(balance.currency_code) ?? balance.currency_code
                }
                amount={formatBalance(balance.available)}
                equivalent={
                  equivalent !== null
                    ? `≈ ${formatEquivalent(equivalent, selectedCurrency)}`
                    : "≈ —"
                }
                onHold={
                  onHold !== undefined && onHold !== "0"
                    ? formatBalance(onHold)
                    : undefined
                }
                onHoldLabel={t.dashboard.onHold}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
}
