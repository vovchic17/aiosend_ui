import { getErrorMessage } from "../../../utils/error";
import { useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { PlaygroundOutput } from "../types";
import { DeleteAllInvoicesCode } from "./DeleteAllInvoicesCode";
import { DeleteAllInvoicesDocumentation } from "./DeleteAllInvoicesDocumentation";

function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildDeleteAllInvoicesPythonCode({ token }: { token: string }): string {
  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "cp.delete_all_invoices()",
  ].join("\n");
}

async function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Clipboard API is unavailable.");
  }
}


type DeleteAllInvoicesPlaygroundProps = {
  onInvoicesChange?: () => void;
};

export function DeleteAllInvoicesPlayground({
  onInvoicesChange,
}: DeleteAllInvoicesPlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.invoices.playground;

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<PlaygroundOutput | null>(null);

  async function handleCopyCode() {
    if (!auth?.token) {
      return;
    }

    await writeToClipboard(buildDeleteAllInvoicesPythonCode({ token: auth.token }));
  }

  async function handleRun() {
    setIsRunning(true);
    setOutput(null);

    try {
      const invoices = await api.getInvoices({ status: "active" });

      if (invoices.length === 0) {
        setOutput({ kind: "success", text: copy.noInvoicesToDelete });
        onInvoicesChange?.();
        return;
      }

      await Promise.all(
        invoices.map((invoice) => api.deleteInvoice({ invoice_id: invoice.invoice_id })),
      );

      setOutput({
        kind: "success",
        text: `${copy.allInvoicesDeleted}: ${invoices.length}`,
      });
      onInvoicesChange?.();
    } catch (error) {
      setOutput({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <ApiPlaygroundCard
      playground={
        <DeleteAllInvoicesCode
          isRunning={isRunning}
          canRun={!isRunning}
          output={output}
          copy={copy}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={<DeleteAllInvoicesDocumentation copy={copy} />}
    />
  );
}
