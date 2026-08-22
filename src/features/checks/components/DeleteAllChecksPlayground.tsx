import { getErrorMessage } from "../../../utils/error";
import { useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { CheckPlaygroundOutput } from "../types";
import { DeleteAllChecksCode } from "./DeleteAllChecksCode";
import { DeleteAllChecksDocumentation } from "./DeleteAllChecksDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
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
  if (!copied) throw new Error("Clipboard API is unavailable.");
}

type DeleteAllChecksPlaygroundProps = {
  onChecksChange?: () => void;
};

export function DeleteAllChecksPlayground({
  onChecksChange,
}: DeleteAllChecksPlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.checks.playground;

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<CheckPlaygroundOutput | null>(null);

  async function handleCopyCode() {
    if (!auth?.token) return;
    await writeToClipboard(
      [
        "from aiosend import CryptoPay",
        "",
        `cp = CryptoPay(${toPythonString(auth.token)})`,
        "cp.delete_all_checks()",
      ].join("\n"),
    );
  }

  async function handleRun() {
    setIsRunning(true);
    setOutput(null);

    try {
      const checks = await api.getChecks({ status: "active" });
      if (checks.length === 0) {
        setOutput({ kind: "success", text: copy.noChecksToDelete });
        return;
      }

      await Promise.all(
        checks.map((check) => api.deleteCheck({ check_id: check.check_id })),
      );
      setOutput({ kind: "success", text: copy.allChecksDeleted });
      onChecksChange?.();
    } catch (error) {
      setOutput({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <ApiPlaygroundCard
      playground={
        <DeleteAllChecksCode
          isRunning={isRunning}
          canRun={!isRunning}
          output={output}
          copy={copy}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={<DeleteAllChecksDocumentation copy={copy} />}
    />
  );
}
