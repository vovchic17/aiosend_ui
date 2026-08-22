import { getErrorMessage } from "../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPay,
  useCryptoPayApi,
  type CryptoPayAppStats,
} from "../api/crypto-pay";
import conversionDarkIcon from "../assets/conversion_dark.svg";
import conversionLightIcon from "../assets/conversion_light.svg";
import createdInvoiceCountDarkIcon from "../assets/created_invoice_count_dark.svg";
import createdInvoiceCountLightIcon from "../assets/created_invoice_count_light.svg";
import networkDarkIcon from "../assets/network_dark.svg";
import networkLightIcon from "../assets/network_light.svg";
import paidInvoiceCountDarkIcon from "../assets/paid_invoice_count_dark.svg";
import paidInvoiceCountLightIcon from "../assets/paid_invoice_count_light.svg";
import uniqueUsersCountDarkIcon from "../assets/unique_users_count_dark.svg";
import uniqueUsersCountLightIcon from "../assets/unique_users_count_light.svg";
import volumeDarkIcon from "../assets/volume_dark.svg";
import volumeLightIcon from "../assets/volume_light.svg";
import { Card } from "../components/ui/Card";
import { useLanguage } from "../i18n";
import { useTheme } from "../theme";
import { formatDateTime } from "../utils/date";

function formatNumber(value: number | undefined): string {
  if (value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });
}

type MetricCardProps = {
  icon: string;
  label: string;
  value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Card className="py-5 sm:py-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <img
          src={icon}
          alt=""
          width={62}
          height={62}
          className="h-12 w-12 shrink-0 sm:h-[62px] sm:w-[62px]"
          draggable={false}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-body-accent text-content-muted">{label}</p>
          <p className="text-h1 break-words text-content">{value}</p>
        </div>
      </div>
    </Card>
  );
}

type DateCardProps = {
  label: string;
  value: string;
};

function DateCard({ label, value }: DateCardProps) {
  return (
    <Card className="py-5 sm:py-6">
      <div className="flex flex-col gap-3">
        <p className="text-body-accent text-content">{label}</p>
        <p className="text-body break-all text-content-muted">{value}</p>
      </div>
    </Card>
  );
}

export function StatsPage() {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { language, t } = useLanguage();
  const { theme } = useTheme();

  const [stats, setStats] = useState<CryptoPayAppStats | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setErrorMessage(null);

      try {
        const result = await api.getStats();
        if (!cancelled) {
          setStats(result);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [api]);

  const icons = useMemo(
    () =>
      theme === "dark"
        ? {
            volume: volumeDarkIcon,
            conversion: conversionDarkIcon,
            uniqueUsers: uniqueUsersCountDarkIcon,
            createdInvoices: createdInvoiceCountDarkIcon,
            paidInvoices: paidInvoiceCountDarkIcon,
            network: networkDarkIcon,
          }
        : {
            volume: volumeLightIcon,
            conversion: conversionLightIcon,
            uniqueUsers: uniqueUsersCountLightIcon,
            createdInvoices: createdInvoiceCountLightIcon,
            paidInvoices: paidInvoiceCountLightIcon,
            network: networkLightIcon,
          },
    [theme],
  );

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.stats}</h1>
          <p className="text-body text-content-muted">{t.stats.description}</p>
        </div>
      </Card>

      {errorMessage && (
        <Card className="py-5 sm:py-6">
          <p className="text-body text-danger">{errorMessage}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={icons.volume}
          label={t.stats.volume}
          value={formatNumber(stats?.volume)}
        />
        <MetricCard
          icon={icons.conversion}
          label={t.stats.conversion}
          value={stats ? `${formatNumber(stats.conversion)}%` : "—"}
        />
        <MetricCard
          icon={icons.uniqueUsers}
          label={t.stats.uniqueUsersCount}
          value={formatNumber(stats?.unique_users_count)}
        />
        <MetricCard
          icon={icons.createdInvoices}
          label={t.stats.createdInvoiceCount}
          value={formatNumber(stats?.created_invoice_count)}
        />
        <MetricCard
          icon={icons.paidInvoices}
          label={t.stats.paidInvoiceCount}
          value={formatNumber(stats?.paid_invoice_count)}
        />
        <MetricCard
          icon={icons.network}
          label={t.stats.network}
          value={auth?.network ?? "—"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DateCard
          label={t.stats.startAt}
          value={formatDateTime(stats?.start_at, language)}
        />
        <DateCard
          label={t.stats.endAt}
          value={formatDateTime(stats?.end_at, language)}
        />
      </div>
    </section>
  );
}
