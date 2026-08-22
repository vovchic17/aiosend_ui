import { Card } from "../components/ui/Card";
import { ExchangeRatePlayground } from "../features/exchange-rates/components/ExchangeRatePlayground";
import { ExchangeRatesListCard } from "../features/exchange-rates/components/ExchangeRatesListCard";
import { useLanguage } from "../i18n";

export function ExchangeRatesPage() {
  const { t } = useLanguage();

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.exchangeRates}</h1>
          <p className="text-body text-content-muted">
            {t.exchangeRates.description}
          </p>
        </div>
      </Card>

      <ExchangeRatePlayground />
      <ExchangeRatesListCard />
    </section>
  );
}
