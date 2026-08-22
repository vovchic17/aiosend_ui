import type { CryptoPayAuthState } from "../../../api/crypto-pay";
import { useLanguage } from "../../../i18n";
import { useTheme } from "../../../theme";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";

import walletDark from "../../../assets/wallet_dark.svg";
import walletLight from "../../../assets/wallet_light.svg";

type AppOverviewCardProps = {
  auth: CryptoPayAuthState;
};

export function AppOverviewCard({ auth }: AppOverviewCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const botUsername = auth.app.payment_processing_bot_username;

  return (
    <Card>
      <div className="flex items-start gap-3 sm:items-center">
        <div className="shrink-0">
          <img
            src={walletLight}
            alt=""
            aria-hidden="true"
            className={isDark ? "hidden" : "block"}
            draggable={false}
          />
          <img
            src={walletDark}
            alt=""
            aria-hidden="true"
            className={isDark ? "block" : "hidden"}
            draggable={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-h1 text-content">{auth.app.name}</h1>
            <Badge variant={auth.network === "mainnet" ? "active" : "muted"}>
              {auth.network}
            </Badge>
          </div>
          <span className="text-body text-content-muted">ID #{auth.app.app_id}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-body text-content-muted">{t.dashboard.description}</p>
        <p className="text-body text-content-muted">
          {t.dashboard.paymentProcessingBot}{" "}
          <a
            href={`https://t.me/${botUsername}`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            @{botUsername}
          </a>
        </p>
      </div>
    </Card>
  );
}
