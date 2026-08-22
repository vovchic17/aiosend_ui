import { getErrorMessage } from "../../../utils/error";
import { useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { CheckPlaygroundOutput, DeleteCheckParameterName } from "../types";
import { DeleteCheckCode } from "./DeleteCheckCode";
import { DeleteCheckDocumentation } from "./DeleteCheckDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildDeleteCheckPythonCode(token: string, checkId: string): string {
  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "status = cp.delete_check(",
    `    check_id=${checkId.trim() || "0"},`,
    ")",
    "",
    'print("Check deleted:", status)',
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
  if (!copied) throw new Error("Clipboard API is unavailable.");
}

type DeleteCheckPlaygroundProps = {
  onChecksChange?: () => void;
};

export function DeleteCheckPlayground({
  onChecksChange,
}: DeleteCheckPlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.checks.playground;

  const [checkId, setCheckId] = useState("123");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<CheckPlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] =
    useState<DeleteCheckParameterName | null>(null);

  const checkIdNumber = Number(checkId);
  const canRun =
    Number.isInteger(checkIdNumber) && checkIdNumber > 0 && !isRunning;

  async function handleCopyCode() {
    if (!auth?.token) return;
    await writeToClipboard(buildDeleteCheckPythonCode(auth.token, checkId));
  }

  async function handleRun() {
    if (!Number.isInteger(checkIdNumber) || checkIdNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidCheckId });
      return;
    }

    setIsRunning(true);
    setOutput(null);
    try {
      const status = await api.deleteCheck({ check_id: checkIdNumber });
      setOutput({
        kind: "success",
        text: `${copy.checkDeleted}: ${status ? "True" : "False"}`,
      });
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
        <DeleteCheckCode
          checkId={checkId}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onCheckIdChange={setCheckId}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <DeleteCheckDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
