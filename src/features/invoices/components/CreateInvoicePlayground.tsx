import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type { BooleanCodeValue, InvoiceParameterName, PlaygroundOutput } from "../types";
import { CreateInvoiceCode } from "./CreateInvoiceCode";
import { CreateInvoiceDocumentation } from "./CreateInvoiceDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildCreateInvoicePythonCode({
  token,
  amount,
  asset,
  description,
  hiddenMessage,
  payload,
  allowComments,
  allowAnonymous,
  expiresIn,
}: {
  token: string;
  amount: string;
  asset: string;
  description: string;
  hiddenMessage: string;
  payload: string;
  allowComments: BooleanCodeValue;
  allowAnonymous: BooleanCodeValue;
  expiresIn: string;
}): string {
  const pythonAmount = amount.trim() || "0";
  const pythonExpiresIn = expiresIn.trim();
  const parameterLines = [
    `    amount=${pythonAmount},`,
    `    asset=${toPythonString(asset)},`,
    `    description=${toPythonString(description)},`,
    `    hidden_message=${toPythonString(hiddenMessage)},`,
    `    payload=${toPythonString(payload)},`,
    `    allow_comments=${allowComments},`,
    `    allow_anonymous=${allowAnonymous},`,
  ];

  if (pythonExpiresIn) {
    parameterLines.push(`    expires_in=${pythonExpiresIn},`);
  }

  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    "invoice = cp.create_invoice(",
    ...parameterLines,
    ")",
    "",
    'print("Invoice URL:", invoice.bot_invoice_url)',
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

type CreateInvoicePlaygroundProps = {
  onInvoicesChange?: () => void;
};

export function CreateInvoicePlayground({
  onInvoicesChange,
}: CreateInvoicePlaygroundProps) {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.invoices.playground;

  const [amount, setAmount] = useState("1");
  const [asset, setAsset] = useState("USDT");
  const [description, setDescription] = useState("");
  const [hiddenMessage, setHiddenMessage] = useState("");
  const [payload, setPayload] = useState("");
  const [allowComments, setAllowComments] = useState<BooleanCodeValue>("True");
  const [allowAnonymous, setAllowAnonymous] = useState<BooleanCodeValue>("True");
  const [expiresIn, setExpiresIn] = useState("");
  const [currencyCodes, setCurrencyCodes] = useState<string[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<PlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] = useState<InvoiceParameterName | null>(null);

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

  const amountNumber = Number(amount);
  const expiresInNumber = expiresIn.trim() ? Number(expiresIn) : null;
  const isExpiresInValid =
    expiresInNumber === null ||
    (Number.isInteger(expiresInNumber) && expiresInNumber > 0);
  const canRun =
    Number.isInteger(amountNumber) &&
    amountNumber > 0 &&
    isExpiresInValid &&
    Boolean(asset) &&
    !isRunning &&
    !isLoadingCurrencies;


  async function handleCopyCode() {
    if (!auth?.token) {
      return;
    }

    const pythonCode = buildCreateInvoicePythonCode({
      token: auth.token,
      amount,
      asset,
      description,
      hiddenMessage,
      payload,
      allowComments,
      allowAnonymous,
      expiresIn,
    });

    await writeToClipboard(pythonCode);
  }

  async function handleRun() {
    if (!Number.isInteger(amountNumber) || amountNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidAmount });
      return;
    }
    if (!asset) {
      setOutput({ kind: "error", text: copy.assetRequired });
      return;
    }
    if (!isExpiresInValid) {
      setOutput({ kind: "error", text: copy.invalidExpiresIn });
      return;
    }

    setIsRunning(true);
    setOutput(null);
    try {
      const invoice = await api.createInvoice({
        amount: String(amountNumber),
        asset,
        description: description.trim() || undefined,
        hidden_message: hiddenMessage.trim() || undefined,
        payload: payload.trim() || undefined,
        allow_comments: allowComments === "True",
        allow_anonymous: allowAnonymous === "True",
        expires_in: expiresInNumber ?? undefined,
      });
      setOutput({ kind: "success", text: `${copy.invoiceUrl}: ${invoice.bot_invoice_url}` });
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
        <CreateInvoiceCode
          amount={amount}
          asset={asset}
          description={description}
          hiddenMessage={hiddenMessage}
          payload={payload}
          allowComments={allowComments}
          allowAnonymous={allowAnonymous}
          expiresIn={expiresIn}
          assetOptions={assetOptions}
          booleanOptions={booleanOptions}
          isLoadingCurrencies={isLoadingCurrencies}
          hasCurrencies={currencyCodes.length > 0}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onAmountChange={setAmount}
          onAssetChange={setAsset}
          onDescriptionChange={setDescription}
          onHiddenMessageChange={setHiddenMessage}
          onPayloadChange={setPayload}
          onAllowCommentsChange={setAllowComments}
          onAllowAnonymousChange={setAllowAnonymous}
          onExpiresInChange={setExpiresIn}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <CreateInvoiceDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
