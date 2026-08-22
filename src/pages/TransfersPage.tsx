import { Card } from "../components/ui/Card";
import { TransferPlayground } from "../features/transfers/components/TransferPlayground";
import { TransfersListCard } from "../features/transfers/components/TransfersListCard";
import { useLanguage } from "../i18n";
import { useRevision } from "../hooks/useRevision";

export function TransfersPage() {
  const { t } = useLanguage();
  const [transfersRevision, invalidateTransfers] = useRevision();

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.transfers}</h1>
          <p className="text-body text-content-muted">
            {t.transfers.description}
          </p>
        </div>
      </Card>

      <TransferPlayground onTransfersChange={invalidateTransfers} />

      <TransfersListCard refreshKey={transfersRevision} />
    </section>
  );
}
