import type { ReactNode } from "react";

import { Card } from "../ui/Card";

type ApiPlaygroundCardProps = {
  playground: ReactNode;
  documentation: ReactNode;
  className?: string;
};

export function ApiPlaygroundCard({
  playground,
  documentation,
  className = "",
}: ApiPlaygroundCardProps) {
  return (
    <Card className={`gap-0 ${className}`}>
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2 xl:gap-8">
        <div className="api-playground-code-transition min-w-0">{playground}</div>
        <div className="api-playground-docs-transition min-w-0">{documentation}</div>
      </div>
    </Card>
  );
}
