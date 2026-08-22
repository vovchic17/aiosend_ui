import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayCurrency,
} from "../../../api/crypto-pay";
import { BooleanIcon } from "../../../components/ui/BooleanIcon";
import { Card } from "../../../components/ui/Card";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useLanguage } from "../../../i18n";


export function CurrenciesListCard() {
  const api = useCryptoPayApi();
  const { t } = useLanguage();
  const copy = t.currencies.list;

  const [currencies, setCurrencies] = useState<CryptoPayCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await api.getCurrencies();
        if (cancelled) return;
        setCurrencies(result);
      } catch (error) {
        if (!cancelled) {
          setCurrencies([]);
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

  const columns = useMemo<TableColumn<CryptoPayCurrency>[]>(
    () => [
      {
        id: "name",
        header: copy.columns.name,
        cell: (currency) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <CurrencyIcon
              code={currency.code}
              size={24}
              type={currency.is_fiat ? "fiat" : "crypto"}
            />
            <span>{currency.name ?? currency.code}</span>
          </div>
        ),
      },
      {
        id: "code",
        header: copy.columns.code,
        cell: (currency) => currency.code,
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "fiat",
        header: copy.columns.fiat,
        cell: (currency) => <BooleanIcon value={currency.is_fiat ?? false} />,
      },
      {
        id: "blockchain",
        header: copy.columns.blockchain,
        cell: (currency) => (
          <BooleanIcon value={currency.is_blockchain ?? false} />
        ),
      },
      {
        id: "stablecoin",
        header: copy.columns.stablecoin,
        cell: (currency) => (
          <BooleanIcon value={currency.is_stablecoin ?? false} />
        ),
      },
      {
        id: "decimals",
        header: copy.columns.decimals,
        cell: (currency) => currency.decimals ?? "-",
        cellClassName: "whitespace-nowrap",
      },
    ],
    [copy],
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
        rows={currencies}
        getRowKey={(currency) => currency.code}
        ariaLabel={copy.tableLabel}
        emptyContent={emptyContent}
        tableClassName="min-w-[900px]"
      />
    </Card>
  );
}
