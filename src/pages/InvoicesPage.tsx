import { useState } from "react";

import { Card } from "../components/ui/Card";
import { MorphSwitch } from "../components/ui/MorphSwitch";
import { TabsSlider } from "../components/ui/TabsSlider";
import { CreateInvoicePlayground } from "../features/invoices/components/CreateInvoicePlayground";
import { DeleteAllInvoicesPlayground } from "../features/invoices/components/DeleteAllInvoicesPlayground";
import { DeleteInvoicePlayground } from "../features/invoices/components/DeleteInvoicePlayground";
import { InvoicesListCard } from "../features/invoices/components/InvoicesListCard";
import { useLanguage } from "../i18n";
import { useRevision } from "../hooks/useRevision";

type InvoiceTab = "create" | "delete" | "deleteAll";

function renderInvoiceTab(
  tab: InvoiceTab,
  onInvoicesChange: () => void,
) {
  switch (tab) {
    case "create":
      return <CreateInvoicePlayground onInvoicesChange={onInvoicesChange} />;
    case "delete":
      return <DeleteInvoicePlayground onInvoicesChange={onInvoicesChange} />;
    case "deleteAll":
      return <DeleteAllInvoicesPlayground onInvoicesChange={onInvoicesChange} />;
  }
}

export function InvoicesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<InvoiceTab>("create");
  const [invoicesRevision, invalidateInvoices] = useRevision();

  const tabs = [
    { value: "create", label: t.invoices.create },
    { value: "delete", label: t.invoices.delete },
    { value: "deleteAll", label: t.invoices.deleteAll },
  ] as const;

  return (
    <section className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-h1 text-content">{t.navigation.invoices}</h1>
          <p className="text-body text-content-muted">
            {t.invoices.description}
          </p>
        </div>
      </Card>

      <TabsSlider
        className="self-center"
        items={tabs}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel={t.invoices.tabsLabel}
      />

      <MorphSwitch
        value={activeTab}
        duration={600}
        render={(tab) => renderInvoiceTab(tab, invalidateInvoices)}
      />

      <InvoicesListCard refreshKey={invoicesRevision} />
    </section>
  );
}
