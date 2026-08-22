import { useCallback, useState } from "react";

export function useRevision() {
  const [revision, setRevision] = useState(0);
  const invalidate = useCallback(() => {
    setRevision((current) => current + 1);
  }, []);

  return [revision, invalidate] as const;
}
