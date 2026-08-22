import type { MethodAvailability } from "../../../api/crypto-pay";
import { Badge } from "../../../components/ui/Badge";

type SecurityStatusBadgeProps = {
  availability: MethodAvailability;
};

export function SecurityStatusBadge({
  availability,
}: SecurityStatusBadgeProps) {
  if (availability === "unknown") {
    return <Badge variant="muted">...</Badge>;
  }

  if (availability === "enabled") {
    return <Badge variant="active">ON</Badge>;
  }

  return <Badge variant="muted">OFF</Badge>;
}
