import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { CheckParameterName, CheckPlaygroundOutput } from "../types";
import { CreateCheckCode } from "./CreateCheckCode";
import { CreateCheckDocumentation } from "./CreateCheckDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildCreateCheckPythonCode({
  token,
  amount,
  asset,
  pinToUserId,
  pinToUsername,
}: {
  token: string;
  amount: string;
  asset: string;
  pinToUserId: string;
  pinToUsername: string;
}): string {
  const parameterLines = [
    `    amount=${amount.trim() || "0"},`,
    `    asset=${toPythonString(asset)},`,
  ];

  if (pinToUserId.trim()) {
    parameterLines.push(`    pin_to_user_id=${pinToUserId.trim()},`);
  }

  if (pinToUsername.trim()) {
    parameterLines.push(`    pin_to_username=${toPythonString(pinToUsername.trim())},`);
  }

  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "check = cp.create_check(",
    ...parameterLines,
    ")",
    "",
    'print("Check URL:", check.bot_check_url)',
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

type CreateCheckPlaygroundProps = {
  onChecksChange?: () => void;
};

export function CreateCheckPlayground({
  onChecksChange,
}: CreateCheckPlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.checks.playground;

  const [amount, setAmount] = useState("1");
  const [asset, setAsset] = useState("USDT");
  const [pinToUserId, setPinToUserId] = useState("");
  const [pinToUsername, setPinToUsername] = useState("");
  const [currencyCodes, setCurrencyCodes] = useState<string[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<CheckPlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] =
    useState<CheckParameterName | null>(null);

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
        : [
            {
              value: "",
              label: isLoadingCurrencies ? copy.loadingCurrencies : "—",
            },
          ],
    [copy.loadingCurrencies, currencyCodes, isLoadingCurrencies],
  );

  const amountNumber = Number(amount);
  const pinToUserIdNumber = pinToUserId.trim() ? Number(pinToUserId) : null;
  const isAmountValid = Number.isFinite(amountNumber) && amountNumber > 0;
  const isPinToUserIdValid =
    pinToUserIdNumber === null ||
    (Number.isInteger(pinToUserIdNumber) && pinToUserIdNumber > 0);
  const canRun =
    isAmountValid &&
    isPinToUserIdValid &&
    Boolean(asset) &&
    !isRunning &&
    !isLoadingCurrencies;

  async function handleCopyCode() {
    if (!auth?.token) return;

    await writeToClipboard(
      buildCreateCheckPythonCode({
        token: auth.token,
        amount,
        asset,
        pinToUserId,
        pinToUsername,
      }),
    );
  }

  async function handleRun() {
    if (!isAmountValid) {
      setOutput({ kind: "error", text: copy.invalidAmount });
      return;
    }
    if (!asset) {
      setOutput({ kind: "error", text: copy.assetRequired });
      return;
    }
    if (!isPinToUserIdValid) {
      setOutput({ kind: "error", text: copy.invalidPinToUserId });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const check = await api.createCheck({
        amount: String(amountNumber),
        asset,
        pin_to_user_id: pinToUserIdNumber ?? undefined,
        pin_to_username: pinToUsername.trim() || undefined,
      });
      setOutput({
        kind: "success",
        text: `${copy.checkUrl}: ${check.bot_check_url}`,
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
        <CreateCheckCode
          amount={amount}
          asset={asset}
          pinToUserId={pinToUserId}
          pinToUsername={pinToUsername}
          assetOptions={assetOptions}
          isLoadingCurrencies={isLoadingCurrencies}
          hasCurrencies={currencyCodes.length > 0}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onAmountChange={setAmount}
          onAssetChange={setAsset}
          onPinToUserIdChange={setPinToUserId}
          onPinToUsernameChange={setPinToUsername}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <CreateCheckDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
