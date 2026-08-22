import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayTransfer,
} from "../../../api/crypto-pay";
import { Card } from "../../../components/ui/Card";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useLanguage } from "../../../i18n";
import { formatDateTime } from "../../../utils/date";


type TransfersListCardProps = {
  refreshKey?: number;
};

export function TransfersListCard({ refreshKey = 0 }: TransfersListCardProps) {
  const api = useCryptoPayApi();
  const { language, t } = useLanguage();
  const copy = t.transfers.list;

  const [transfers, setTransfers] = useState<CryptoPayTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTransfers() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await api.getTransfers();
        if (!cancelled) setTransfers(result);
      } catch (error) {
        if (!cancelled) {
          setTransfers([]);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadTransfers();
    return () => {
      cancelled = true;
    };
  }, [api, refreshKey]);

  const columns = useMemo<TableColumn<CryptoPayTransfer>[]>(
    () => [
      {
        id: "transfer_id",
        header: copy.columns.transferId,
        cell: (transfer) => transfer.transfer_id,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "user_id",
        header: copy.columns.userId,
        cell: (transfer) => transfer.user_id,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "amount",
        header: copy.columns.amount,
        cell: (transfer) => transfer.amount,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "asset",
        header: copy.columns.asset,
        cell: (transfer) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <CurrencyIcon code={transfer.asset} size={24} />
            <span>{transfer.asset}</span>
          </div>
        ),
        headerClassName: "whitespace-nowrap",
      },
      {
        id: "completed_at",
        header: copy.columns.completedAt,
        cell: (transfer) => formatDateTime(transfer.completed_at, language),
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "comment",
        header: copy.columns.comment,
        cell: (transfer) => transfer.comment || "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "min-w-[220px]",
      },
    ],
    [copy, language],
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
        rows={transfers}
        getRowKey={(transfer) => transfer.transfer_id}
        ariaLabel={copy.tableLabel}
        emptyContent={emptyContent}
        tableClassName="min-w-[980px]"
      />
    </Card>
  );
}
