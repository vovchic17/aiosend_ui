import { getErrorMessage } from "../../../utils/error";
import { useEffect, useMemo, useState } from "react";

import { useCryptoPay, useCryptoPayApi } from "../../../api/crypto-pay";
import { ApiPlaygroundCard } from "../../../components/api/ApiPlaygroundCard";
import { useLanguage } from "../../../i18n";
import type {
  ExchangeRateParameterName,
  ExchangeRatePlaygroundOutput,
} from "../types";
import { ExchangeRateCode } from "./ExchangeRateCode";
import { ExchangeRateDocumentation } from "./ExchangeRateDocumentation";


function toPythonString(value: string): string {
  return JSON.stringify(value);
}

function buildPythonCode({
  token,
  amount,
  source,
  target,
}: {
  token: string;
  amount: string;
  source: string;
  target: string;
}) {
  return [
    "from aiosend import CryptoPay",
    "",
    `cp = CryptoPay(${toPythonString(token)})`,
    `amount = ${amount.trim() || "0"}`,
    `source = ${toPythonString(source)}`,
    `target = ${toPythonString(target)}`,
    "result = cp.exchange(",
    "    amount=amount,",
    "    source=source,",
    "    target=target,",
    ")",
    "",
    'print(f"{amount} {source} = {result} {target}")',
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

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  return String(Number(value.toPrecision(15)));
}

export function ExchangeRatePlayground() {
  const api = useCryptoPayApi();
  const { auth } = useCryptoPay();
  const { t } = useLanguage();
  const copy = t.exchangeRates.playground;

  const [amount, setAmount] = useState("1");
  const [source, setSource] = useState("USDT");
  const [target, setTarget] = useState("RUB");
  const [currencyCodes, setCurrencyCodes] = useState<string[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<ExchangeRatePlaygroundOutput | null>(null);
  const [activeParameter, setActiveParameter] =
    useState<ExchangeRateParameterName | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrencies() {
      setIsLoadingCurrencies(true);
      try {
        const currencies = await api.getCurrencies();
        if (cancelled) return;
        const codes = Array.from(
          new Set(currencies.map((currency) => currency.code).filter(Boolean)),
        ).sort((left, right) => left.localeCompare(right));
        setCurrencyCodes(codes);
        setSource((current) => (codes.includes(current) ? current : codes[0] || ""));
        setTarget((current) =>
          codes.includes(current)
            ? current
            : codes.includes("RUB")
              ? "RUB"
              : codes[0] || "",
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

  const currencyOptions = useMemo(
    () =>
      currencyCodes.length > 0
        ? currencyCodes.map((code) => ({ value: code, label: code }))
        : [{ value: "", label: isLoadingCurrencies ? copy.loadingCurrencies : "—" }],
    [copy.loadingCurrencies, currencyCodes, isLoadingCurrencies],
  );

  const amountNumber = Number(amount);
  const canRun =
    Number.isFinite(amountNumber) &&
    amountNumber > 0 &&
    Boolean(source) &&
    Boolean(target) &&
    !isRunning &&
    !isLoadingCurrencies;

  async function handleCopyCode() {
    if (!auth?.token) return;
    await writeToClipboard(
      buildPythonCode({ token: auth.token, amount, source, target }),
    );
  }

  async function handleRun() {
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setOutput({ kind: "error", text: copy.invalidAmount });
      return;
    }
    if (!source || !target) {
      setOutput({ kind: "error", text: copy.currencyRequired });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const rates = await api.getExchangeRates();
      const rate = rates.find(
        (item) =>
          item.is_valid &&
          item.source.toUpperCase() === source.toUpperCase() &&
          item.target.toUpperCase() === target.toUpperCase(),
      );

      if (!rate) {
        setOutput({
          kind: "error",
          text: `aiosend.exceptions.CryptoPayError: Exchange rate for ${source} => ${target} not found`,
        });
        return;
      }

      const result = amountNumber * Number(rate.rate);
      setOutput({
        kind: "success",
        text: `${amount} ${source} = ${formatNumber(result)} ${target}`,
      });
    } catch (error) {
      setOutput({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <ApiPlaygroundCard
      playground={
        <ExchangeRateCode
          amount={amount}
          source={source}
          target={target}
          currencyOptions={currencyOptions}
          isLoadingCurrencies={isLoadingCurrencies}
          hasCurrencies={currencyCodes.length > 0}
          isRunning={isRunning}
          canRun={canRun}
          output={output}
          copy={copy}
          onAmountChange={setAmount}
          onSourceChange={setSource}
          onTargetChange={setTarget}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
          onRun={handleRun}
          onCopy={handleCopyCode}
        />
      }
      documentation={
        <ExchangeRateDocumentation
          activeParameter={activeParameter}
          copy={copy}
          onParameterEnter={setActiveParameter}
          onParameterLeave={() => setActiveParameter(null)}
        />
      }
    />
  );
}
