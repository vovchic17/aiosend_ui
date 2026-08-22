import { getErrorMessage } from "../../../utils/error";
import { useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { DeleteInvoiceParameterName, PlaygroundOutput } from "../types";
import { DeleteInvoiceCode } from "./DeleteInvoiceCode";
import { DeleteInvoiceDocumentation } from "./DeleteInvoiceDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildDeleteInvoicePythonCode({
  token,
  invoiceId,
}: {
  token: string;
  invoiceId: string;
}): string {
  const pythonInvoiceId = invoiceId.trim() || "0";

  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "status = cp.delete_invoice(",
    `    invoice_id=${pythonInvoiceId},`,
    ")",
    "",
    'print("Invoice deleted:", status)',
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

type DeleteInvoicePlaygroundProps = {
  onInvoicesChange?: () => void;
};

export function DeleteInvoicePlayground({
  onInvoicesChange,
}: DeleteInvoicePlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.invoices.playground;

  const [invoiceId, setInvoiceId] = useState("123");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<PlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] =
    useState<DeleteInvoiceParameterName | null>(null);

  const invoiceIdNumber = Number(invoiceId);
  const canRun =
    Number.isInteger(invoiceIdNumber) && invoiceIdNumber > 0 && !isRunning;

  async function handleCopyCode() {
    if (!auth?.token) {
      return;
    }

    await writeToClipboard(
      buildDeleteInvoicePythonCode({
        token: auth.token,
        invoiceId,
      }),
    );
  }

  async function handleRun() {
    if (!Number.isInteger(invoiceIdNumber) || invoiceIdNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidInvoiceId });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const status = await api.deleteInvoice({ invoice_id: invoiceIdNumber });
      setOutput({
        kind: "success",
        text: `${copy.invoiceDeleted}: ${status ? "True" : "False"}`,
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
        <DeleteInvoiceCode
          invoiceId={invoiceId}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onInvoiceIdChange={setInvoiceId}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <DeleteInvoiceDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
