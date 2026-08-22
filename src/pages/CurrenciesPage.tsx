import { Card } from "../components/ui/Card";
import { CurrenciesListCard } from "../features/currencies/components/CurrenciesListCard";
import { useLanguage } from "../i18n";

export function CurrenciesPage() {
  const { t } = useLanguage();

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.currencies}</h1>
          <p className="text-body text-content-muted">
            {t.currencies.description}
          </p>
        </div>
      </Card>

      <CurrenciesListCard />
    </section>
  );
}
