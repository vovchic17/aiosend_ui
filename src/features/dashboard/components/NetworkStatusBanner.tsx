import type { CryptoPayNetwork } from "../../../api/crypto-pay";
import { useLanguage } from "../../../i18n";
import { StatusBanner } from "../../../components/ui/StatusBanner";

type NetworkStatusBannerProps = {
  network: CryptoPayNetwork;
};

export function NetworkStatusBanner({ network }: NetworkStatusBannerProps) {
  const { t } = useLanguage();

  return (
    <StatusBanner
      variant="network"
      title={`${t.dashboard.networkUsing} ${network.toUpperCase()}`}
      subtitle={
        network === "testnet"
          ? t.dashboard.testnetDescription
          : t.dashboard.mainnetDescription
      }
    />
  );
}
