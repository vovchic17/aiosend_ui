import { StatusBanner } from "../../../components/ui/StatusBanner";
import { useLanguage } from "../../../i18n";

export function AppSuspendedBanner() {
  const { t } = useLanguage();

  return (
    <StatusBanner
      variant="suspended"
      title={t.dashboard.suspendedTitle}
      subtitle={t.dashboard.suspendedDescription}
    />
  );
}
