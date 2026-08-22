import { Link } from "react-router-dom";

import type { CryptoPayNetwork } from "../../api/crypto-pay";
import { useLanguage } from "../../i18n";
import { Badge } from "../ui/Badge";

type AppProfileProps = {
  name: string;
  appId: number;
  network: CryptoPayNetwork;
};

export function AppProfile({
  name,
  appId,
  network,
}: AppProfileProps) {
  const { t } = useLanguage();

  return (
    <Link
      to="/"
      className="flex items-center"
      aria-label={t.common.dashboard}
    >
      <div className="flex flex-col items-end gap-1">
        <span className="text-secondary text-content">{name}</span>

        <div className="flex items-center gap-2">
          <span className="text-secondary text-content-muted">#{appId}</span>
          <Badge variant="muted">{network}</Badge>
        </div>
      </div>
    </Link>
  );
}
