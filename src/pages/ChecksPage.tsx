import { useState } from "react";

import { Card } from "../components/ui/Card";
import { MorphSwitch } from "../components/ui/MorphSwitch";
import { TabsSlider } from "../components/ui/TabsSlider";
import { ChecksListCard } from "../features/checks/components/ChecksListCard";
import { CreateCheckPlayground } from "../features/checks/components/CreateCheckPlayground";
import { DeleteAllChecksPlayground } from "../features/checks/components/DeleteAllChecksPlayground";
import { DeleteCheckPlayground } from "../features/checks/components/DeleteCheckPlayground";
import { useLanguage } from "../i18n";
import { useRevision } from "../hooks/useRevision";

type CheckTab = "create" | "delete" | "deleteAll";

function renderCheckTab(tab: CheckTab, onChecksChange: () => void) {
  switch (tab) {
    case "create":
      return <CreateCheckPlayground onChecksChange={onChecksChange} />;
    case "delete":
      return <DeleteCheckPlayground onChecksChange={onChecksChange} />;
    case "deleteAll":
      return <DeleteAllChecksPlayground onChecksChange={onChecksChange} />;
  }
}

export function ChecksPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<CheckTab>("create");
  const [checksRevision, invalidateChecks] = useRevision();

  const tabs = [
    { value: "create", label: t.checks.create },
    { value: "delete", label: t.checks.delete },
    { value: "deleteAll", label: t.checks.deleteAll },
  ] as const;

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.checks}</h1>
          <p className="text-body text-content-muted">{t.checks.description}</p>
        </div>
      </Card>

      <TabsSlider
        className="self-center"
        items={tabs}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel={t.checks.tabsLabel}
      />

      <MorphSwitch
        value={activeTab}
        duration={600}
        render={(tab) => renderCheckTab(tab, invalidateChecks)}
      />

      <ChecksListCard refreshKey={checksRevision} />
    </section>
  );
}
