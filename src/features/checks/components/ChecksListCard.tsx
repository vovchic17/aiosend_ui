import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayCheck,
} from "../../../api/crypto-pay";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";
import { Select } from "../../../components/ui/Select";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useLanguage } from "../../../i18n";
import { formatDateTime } from "../../../utils/date";

type CheckStatusFilter = "all" | CryptoPayCheck["status"];


function renderCheckStatus(status: CryptoPayCheck["status"]) {
  if (status === "active") {
    return (
      <Badge variant="active" className="w-[65px]">
        active
      </Badge>
    );
  }

  return (
    <Badge variant="primary" className="w-[65px]">
      activated
    </Badge>
  );
}

type ChecksListCardProps = {
  refreshKey?: number;
};

export function ChecksListCard({ refreshKey = 0 }: ChecksListCardProps) {
  const api = useCryptoPayApi();
  const { language, t } = useLanguage();
  const copy = t.checks.list;

  const [status, setStatus] = useState<CheckStatusFilter>("all");
  const [checks, setChecks] = useState<CryptoPayCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChecks() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await api.getChecks();
        if (!cancelled) setChecks(result);
      } catch (error) {
        if (!cancelled) {
          setChecks([]);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadChecks();
    return () => {
      cancelled = true;
    };
  }, [api, refreshKey]);

  const filteredChecks = useMemo(
    () =>
      status === "all"
        ? checks
        : checks.filter((check) => check.status === status),
    [checks, status],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: copy.statuses.all },
      { value: "active", label: copy.statuses.active },
      { value: "activated", label: copy.statuses.activated },
    ],
    [copy, language],
  );

  const columns = useMemo<TableColumn<CryptoPayCheck>[]>(
    () => [
      {
        id: "check_id",
        header: copy.columns.checkId,
        cell: (check) => check.check_id,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "amount",
        header: copy.columns.amount,
        cell: (check) => check.amount,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "asset",
        header: copy.columns.asset,
        cell: (check) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <CurrencyIcon code={check.asset} size={24} />
            <span>{check.asset}</span>
          </div>
        ),
        headerClassName: "whitespace-nowrap",
      },
      {
        id: "check_url",
        header: copy.columns.checkUrl,
        cell: (check) => check.bot_check_url,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "pin_to_user_id",
        header: copy.columns.pinToUserId,
        cell: (check) => check.pin_to_user_id ?? "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "pin_to_username",
        header: copy.columns.pinToUsername,
        cell: (check) => check.pin_to_username || "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "created_at",
        header: copy.columns.createdAt,
        cell: (check) => formatDateTime(check.created_at, language),
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "status",
        header: copy.columns.status,
        cell: (check) => renderCheckStatus(check.status),
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
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
      <div className="flex justify-stretch sm:justify-end">
        <Select
          value={status}
          onChange={(value) => setStatus(value as CheckStatusFilter)}
          options={statusOptions}
          ariaLabel={copy.statusFilterLabel}
          disabled={isLoading}
          className="w-full sm:w-32"
        />
      </div>

      <Table
        columns={columns}
        rows={filteredChecks}
        getRowKey={(check) => check.check_id}
        ariaLabel={copy.tableLabel}
        emptyContent={emptyContent}
        tableClassName="min-w-[1180px]"
      />
    </Card>
  );
}
