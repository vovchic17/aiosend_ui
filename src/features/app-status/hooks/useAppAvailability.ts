import { useEffect, useState } from "react";

import {
  useCryptoPayApi,
  type MethodAvailability,
} from "../../../api/crypto-pay";

export function useAppAvailability() {
  const api = useCryptoPayApi();
  const [checksAvailability, setChecksAvailability] =
    useState<MethodAvailability>("unknown");
  const [transfersAvailability, setTransfersAvailability] =
    useState<MethodAvailability>("unknown");

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      const [checksResult, transfersResult] = await Promise.allSettled([
        api.getChecksAvailability(),
        api.getTransfersAvailability(),
      ]);

      if (cancelled) {
        return;
      }

      setChecksAvailability(
        checksResult.status === "fulfilled" ? checksResult.value : "unknown",
      );
      setTransfersAvailability(
        transfersResult.status === "fulfilled"
          ? transfersResult.value
          : "unknown",
      );
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [api]);

  return {
    checksAvailability,
    transfersAvailability,
    isSuspended:
      checksAvailability === "blocked" || transfersAvailability === "blocked",
  };
}
