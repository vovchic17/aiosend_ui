import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type {
  TransferBooleanCodeValue,
  TransferParameterName,
  TransferPlaygroundOutput,
} from "../types";
import { TransferCode } from "./TransferCode";
import { TransferDocumentation } from "./TransferDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildTransferPythonCode({
  token,
  userId,
  amount,
  asset,
  comment,
  disableSendNotification,
}: {
  token: string;
  userId: string;
  amount: string;
  asset: string;
  comment: string;
  disableSendNotification: TransferBooleanCodeValue;
}): string {
  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "transfer = cp.transfer(",
    `    user_id=${userId.trim() || "0"},`,
    `    amount=${amount.trim() || "0"},`,
    `    asset=${toPythonString(asset)},`,
    `    comment=${toPythonString(comment)},`,
    `    disable_send_notification=${disableSendNotification},`,
    ")",
    "",
    'print("Transfer ID:", transfer.transfer_id)',
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

function createSpendId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type TransferPlaygroundProps = {
  onTransfersChange?: () => void;
};

export function TransferPlayground({
  onTransfersChange,
}: TransferPlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.transfers.playground;

  const [userId, setUserId] = useState("12345678");
  const [amount, setAmount] = useState("1");
  const [asset, setAsset] = useState("USDT");
  const [comment, setComment] = useState("");
  const [disableSendNotification, setDisableSendNotification] =
    useState<TransferBooleanCodeValue>("False");
  const [currencyCodes, setCurrencyCodes] = useState<string[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<TransferPlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] =
    useState<TransferParameterName | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrencies() {
      setIsLoadingCurrencies(true);
      try {
        const currencies = await api.getCurrencies();
        if (cancelled) return;

        const cryptoCodes = Array.from(
          new Set(
            currencies
              .filter((currency) => !currency.is_fiat)
              .map((currency) => currency.code)
              .filter(Boolean),
          ),
        ).sort((left, right) => left.localeCompare(right));

        setCurrencyCodes(cryptoCodes);
        setAsset((current) =>
          cryptoCodes.includes(current)
            ? current
            : cryptoCodes.includes("USDT")
              ? "USDT"
              : cryptoCodes[0] || "",
        );
      } catch (error) {
        if (!cancelled) {
          setOutput({
            kind: "error",
            text: `${copy.loadCurrenciesError}: ${getErrorMessage(error)}`,
          });
        }
      } finally {
        if (!cancelled) setIsLoadingCurrencies(false);
      }
    }

    void loadCurrencies();
    return () => {
      cancelled = true;
    };
  }, [api, copy.loadCurrenciesError]);

  const assetOptions = useMemo(
    () =>
      currencyCodes.length > 0
        ? currencyCodes.map((code) => ({ value: code, label: code }))
        : [{ value: "", label: isLoadingCurrencies ? copy.loadingCurrencies : "—" }],
    [copy.loadingCurrencies, currencyCodes, isLoadingCurrencies],
  );

  const booleanOptions = useMemo(
    () => [
      { value: "True", label: "True" },
      { value: "False", label: "False" },
    ],
    [],
  );

  const userIdNumber = Number(userId);
  const amountNumber = Number(amount);
  const canRun =
    Number.isInteger(userIdNumber) &&
    userIdNumber > 0 &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0 &&
    Boolean(asset) &&
    comment.length <= 1024 &&
    !isRunning &&
    !isLoadingCurrencies;

  async function handleCopyCode() {
    if (!auth?.token) return;

    await writeToClipboard(
      buildTransferPythonCode({
        token: auth.token,
        userId,
        amount,
        asset,
        comment,
        disableSendNotification,
      }),
    );
  }

  async function handleRun() {
    if (!Number.isInteger(userIdNumber) || userIdNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidUserId });
      return;
    }
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidAmount });
      return;
    }
    if (!asset) {
      setOutput({ kind: "error", text: copy.assetRequired });
      return;
    }
    if (comment.length > 1024) {
      setOutput({ kind: "error", text: copy.commentTooLong });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const transfer = await api.transfer({
        user_id: userIdNumber,
        asset,
        amount: String(amountNumber),
        spend_id: createSpendId(),
        comment: comment.trim() || undefined,
        disable_send_notification: disableSendNotification === "True",
      });

      setOutput({
        kind: "success",
        text: `${copy.transferId}: ${transfer.transfer_id}`,
      });
      onTransfersChange?.();
    } catch (error) {
      setOutput({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <ApiPlaygroundCard
      playground={
        <TransferCode
          userId={userId}
          amount={amount}
          asset={asset}
          comment={comment}
          disableSendNotification={disableSendNotification}
          assetOptions={assetOptions}
          booleanOptions={booleanOptions}
          isLoadingCurrencies={isLoadingCurrencies}
          hasCurrencies={currencyCodes.length > 0}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onUserIdChange={setUserId}
          onAmountChange={setAmount}
          onAssetChange={setAsset}
          onCommentChange={setComment}
          onDisableSendNotificationChange={setDisableSendNotification}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <TransferDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
