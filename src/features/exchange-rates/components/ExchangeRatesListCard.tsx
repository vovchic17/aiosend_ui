import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayCurrency,
  type CryptoPayExchangeRate,
} from "../../../api/crypto-pay";
import { BooleanIcon } from "../../../components/ui/BooleanIcon";
import { Card } from "../../../components/ui/Card";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useLanguage } from "../../../i18n";


export function ExchangeRatesListCard() {
  const api = useCryptoPayApi();
  const { t } = useLanguage();
  const copy = t.exchangeRates.list;

  const [rates, setRates] = useState<CryptoPayExchangeRate[]>([]);
  const [currencies, setCurrencies] = useState<CryptoPayCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [ratesResult, currenciesResult] = await Promise.all([
          api.getExchangeRates(),
          api.getCurrencies(),
        ]);
        if (cancelled) return;
        setRates(ratesResult);
        setCurrencies(currenciesResult);
      } catch (error) {
        if (!cancelled) {
          setRates([]);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const fiatCodes = useMemo(
    () =>
      new Set(
        currencies
          .filter((currency) => currency.is_fiat)
          .map((currency) => currency.code.toUpperCase()),
      ),
    [currencies],
  );

  const columns = useMemo<TableColumn<CryptoPayExchangeRate>[]>(
    () => [
      {
        id: "source",
        header: copy.columns.source,
        cell: (rate) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <CurrencyIcon
              code={rate.source}
              size={24}
              type={fiatCodes.has(rate.source.toUpperCase()) ? "fiat" : "crypto"}
            />
            <span>{rate.source}</span>
          </div>
        ),
      },
      {
        id: "target",
        header: copy.columns.target,
        cell: (rate) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <CurrencyIcon
              code={rate.target}
              size={24}
              type={fiatCodes.has(rate.target.toUpperCase()) ? "fiat" : "crypto"}
            />
            <span>{rate.target}</span>
          </div>
        ),
      },
      {
        id: "rate",
        header: copy.columns.rate,
        cell: (rate) => rate.rate,
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "is_crypto",
        header: copy.columns.crypto,
        cell: (rate) => <BooleanIcon value={rate.is_crypto} />,
      },
      {
        id: "is_fiat",
        header: copy.columns.fiat,
        cell: (rate) => <BooleanIcon value={rate.is_fiat} />,
      },
      {
        id: "is_valid",
        header: copy.columns.valid,
        cell: (rate) => <BooleanIcon value={rate.is_valid} />,
      },
    ],
    [copy, fiatCodes],
  );

  const emptyContent = isLoading
    ? t.common.loading
    : errorMessage
      ? errorMessage
      : copy.empty;

  return (
    <Card>
      <Table
        columns={columns}
        rows={rates}
        getRowKey={(rate, index) => `${rate.source}-${rate.target}-${index}`}
        ariaLabel={copy.tableLabel}
        emptyContent={emptyContent}
        tableClassName="min-w-[920px]"
      />
    </Card>
  );
}
