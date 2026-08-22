import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayInvoice,
} from "../../../api/crypto-pay";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { CurrencyIcon } from "../../../components/ui/CurrencyIcon";
import { Select } from "../../../components/ui/Select";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useLanguage } from "../../../i18n";
import { formatDateTime } from "../../../utils/date";

type InvoiceStatusFilter = "all" | CryptoPayInvoice["status"];


function getInvoiceCurrency(invoice: CryptoPayInvoice): string {
  return invoice.asset ?? invoice.fiat ?? "—";
}

function renderInvoiceStatus(status: CryptoPayInvoice["status"]) {
  if (status === "active") {
    return <Badge variant="active" className="w-[65px]">active</Badge>;
  }

  if (status === "paid") {
    return <Badge variant="primary" className="w-[65px]">paid</Badge>;
  }

  return <Badge variant="muted" className="w-[65px]">expired</Badge>;
}

type InvoicesListCardProps = {
  refreshKey?: number;
};

export function InvoicesListCard({ refreshKey = 0 }: InvoicesListCardProps) {
  const api = useCryptoPayApi();
  const { language, t } = useLanguage();
  const copy = t.invoices.list;

  const [status, setStatus] = useState<InvoiceStatusFilter>("all");
  const [invoices, setInvoices] = useState<CryptoPayInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInvoices() {
      setIsLoading(true);
      setErrorMessage(null);

      try {


        const result = await api.getInvoices();

        if (!cancelled) {
          setInvoices(result);
        }
      } catch (error) {
        if (!cancelled) {
          setInvoices([]);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInvoices();

    return () => {
      cancelled = true;
    };
  }, [api, refreshKey]);

  const filteredInvoices = useMemo(
    () =>
      status === "all"
        ? invoices
        : invoices.filter((invoice) => invoice.status === status),
    [invoices, status],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: copy.statuses.all },
      { value: "active", label: copy.statuses.active },
      { value: "paid", label: copy.statuses.paid },
      { value: "expired", label: copy.statuses.expired },
    ],
    [copy, language],
  );

  const columns = useMemo<TableColumn<CryptoPayInvoice>[]>(
    () => [
      {
        id: "invoice_id",
        header: copy.columns.invoiceId,
        cell: (invoice) => invoice.invoice_id,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "amount",
        header: copy.columns.amount,
        cell: (invoice) => invoice.amount,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "currency",
        header: copy.columns.currency,
        cell: (invoice) => {
          const currency = getInvoiceCurrency(invoice);

          return (
            <div className="flex items-center gap-3 whitespace-nowrap">
              {currency !== "—" && (
                <CurrencyIcon
                  code={currency}
                  size={24}
                  type={invoice.currency_type}
                />
              )}
              <span>{currency}</span>
            </div>
          );
        },
        headerClassName: "whitespace-nowrap",
      },
      {
        id: "invoice_url",
        header: copy.columns.invoiceUrl,
        cell: (invoice) => invoice.bot_invoice_url,
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "description",
        header: copy.columns.description,
        cell: (invoice) => invoice.description || "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "hidden_message",
        header: copy.columns.hiddenMessage,
        cell: (invoice) => invoice.hidden_message || "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "comment",
        header: copy.columns.comment,
        cell: (invoice) => invoice.comment || "-",
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "created_at",
        header: copy.columns.createdAt,
        cell: (invoice) => formatDateTime(invoice.created_at, language),
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "status",
        header: copy.columns.status,
        cell: (invoice) => renderInvoiceStatus(invoice.status),
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
          onChange={(value) => setStatus(value as InvoiceStatusFilter)}
          options={statusOptions}
          ariaLabel={copy.statusFilterLabel}
          disabled={isLoading}
          className="w-full sm:w-32"
        />
      </div>

      <Table
        columns={columns}
        rows={filteredInvoices}
        getRowKey={(invoice) => invoice.invoice_id}
        ariaLabel={copy.tableLabel}
        emptyContent={emptyContent}
        tableClassName="min-w-[1320px]"
      />
    </Card>
  );
}
