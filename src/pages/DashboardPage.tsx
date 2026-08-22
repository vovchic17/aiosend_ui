import { useOutletContext } from "react-router-dom";

import { useCryptoPay, type MethodAvailability } from "../api/crypto-pay";
import { ErrorState } from "../components/ui/ErrorState";
import { AppOverviewCard } from "../features/dashboard/components/AppOverviewCard";
import { BalancesSection } from "../features/dashboard/components/BalancesSection";
import { NetworkStatusBanner } from "../features/dashboard/components/NetworkStatusBanner";
import { SecuritySection } from "../features/dashboard/components/SecuritySection";
import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";
import { useLanguage } from "../i18n";

export function DashboardPage() {
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const dashboard = useDashboardData();
  const { checksAvailability, transfersAvailability } = useOutletContext<{
    checksAvailability: MethodAvailability;
    transfersAvailability: MethodAvailability;
  }>();

  if (!auth) {
    return null;
  }

  const botUsername = auth.app.payment_processing_bot_username;

  return (
    <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <AppOverviewCard auth={auth} />

      {dashboard.hasError && (
        <ErrorState
          message={t.dashboard.loadError}
          retryLabel={t.common.retry}
          onRetry={dashboard.refresh}
          className="py-5"
        />
      )}

      <BalancesSection
        balances={dashboard.balances}
        exchangeRates={dashboard.exchangeRates}
        currencyNames={dashboard.currencyNames}
        currencyOptions={dashboard.currencyOptions}
        selectedCurrency={dashboard.selectedCurrency}
        onCurrencyChange={dashboard.setSelectedCurrency}
        isLoading={dashboard.isLoading}
        hasLoaded={dashboard.hasLoaded}
      />

      <SecuritySection
        botUsername={botUsername}
        checksAvailability={checksAvailability}
        transfersAvailability={transfersAvailability}
      />

      <NetworkStatusBanner network={auth.network} />
    </div>
  );
}
