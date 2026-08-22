import type { MethodAvailability } from "../../../api/crypto-pay";
import { useLanguage } from "../../../i18n";
import { Card } from "../../../components/ui/Card";
import { SecurityStatusBadge } from "./SecurityStatusBadge";

type SecuritySectionProps = {
  botUsername: string;
  checksAvailability: MethodAvailability;
  transfersAvailability: MethodAvailability;
};

export function SecuritySection({
  botUsername,
  checksAvailability,
  transfersAvailability,
}: SecuritySectionProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <h2 className="text-h1 text-content">{t.dashboard.security}</h2>
        <p className="text-body text-content-muted">
          {t.dashboard.securityBeforeBot}{" "}
          <a
            href={`https://t.me/${botUsername}`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            @{botUsername}
          </a>
          {t.dashboard.securityAfterBot}
        </p>
      </div>

      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 sm:w-fit sm:grid-cols-[76px_auto]">
        <span className="text-body text-content">{t.dashboard.checks}</span>
        <SecurityStatusBadge availability={checksAvailability} />

        <span className="text-body text-content">{t.dashboard.transfers}</span>
        <SecurityStatusBadge availability={transfersAvailability} />
      </div>
    </Card>
  );
}
