import { useEffect, useRef, useState } from "react";

import {
  CodeCheckIcon,
  CodeChevronIcon,
  CodeCopyIcon,
  CodeInput,
  CodeLine,
  CodeSelect,
  type CodeOption,
} from "../../../components/api/CodeControls";
import { Button } from "../../../components/ui/Button";
import type { Dictionary } from "../../../i18n/types";
import type {
  ExchangeRateParameterName,
  ExchangeRatePlaygroundOutput,
} from "../types";

type ExchangeRateCodeProps = {
  amount: string;
  source: string;
  target: string;
  currencyOptions: CodeOption[];
  isLoadingCurrencies: boolean;
  hasCurrencies: boolean;
  isRunning: boolean;
  canRun: boolean;
  output: ExchangeRatePlaygroundOutput | null;
  copy: Dictionary["exchangeRates"]["playground"];
  onAmountChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onParameterEnter: (parameter: ExchangeRateParameterName) => void;
  onParameterLeave: () => void;
  onRun: () => void;
  onCopy: () => Promise<void>;
};

export function ExchangeRateCode({
  amount,
  source,
  target,
  currencyOptions,
  isLoadingCurrencies,
  hasCurrencies,
  isRunning,
  canRun,
  output,
  copy,
  onAmountChange,
  onSourceChange,
  onTargetChange,
  onParameterEnter,
  onParameterLeave,
  onRun,
  onCopy,
}: ExchangeRateCodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await onCopy();
      setIsCopied(true);

      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => {
        setIsCopied(false);
        copiedTimerRef.current = null;
      }, 1600);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-subtle-border bg-code-surface">
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={isCopied ? copy.copiedCodeLabel : copy.copyCodeLabel}
        title={isCopied ? copy.copiedCodeLabel : copy.copyCodeLabel}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-content/20 ${
          isCopied ? "" : "text-syntax-number hover:text-content-muted"
        }`}
      >
        {isCopied ? <CodeCheckIcon /> : <CodeCopyIcon />}
      </button>

      <div className="overflow-x-auto px-5 py-5 pr-14">
        <div className="min-w-[620px] space-y-1">
          <CodeLine number={1}>
            <span className="text-syntax-keyword">from</span>{" "}
            <span>aiosend</span>{" "}
            <span className="text-syntax-keyword">import</span>{" "}
            <span className="text-syntax-class">CryptoPay</span>
          </CodeLine>
          <CodeLine number={2} />
          <CodeLine number={3}>
            <span>cp</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span className="text-syntax-class">CryptoPay</span>
            <span>(</span>
            <span className="text-syntax-string">&quot;TOKEN&quot;</span>
            <span>)</span>
          </CodeLine>
          <CodeLine
            number={4}
            parameter="amount"
            onParameterEnter={() => onParameterEnter("amount")}
            onParameterLeave={onParameterLeave}
          >
            <span>amount</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <CodeInput
              value={amount}
              onChange={onAmountChange}
              ariaLabel={copy.amountInputLabel}
              tone="number"
              className="w-32"
            />
          </CodeLine>
          <CodeLine
            number={5}
            parameter="source"
            onParameterEnter={() => onParameterEnter("source")}
            onParameterLeave={onParameterLeave}
          >
            <span>source</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span className="text-syntax-string">&quot;</span>
            <CodeSelect
              value={source}
              onChange={onSourceChange}
              options={currencyOptions}
              ariaLabel={copy.sourceInputLabel}
              disabled={isLoadingCurrencies || !hasCurrencies}
              tone="string"
              className="w-32"
            />
            <span className="text-syntax-string">&quot;</span>
          </CodeLine>
          <CodeLine
            number={6}
            parameter="target"
            onParameterEnter={() => onParameterEnter("target")}
            onParameterLeave={onParameterLeave}
          >
            <span>target</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span className="text-syntax-string">&quot;</span>
            <CodeSelect
              value={target}
              onChange={onTargetChange}
              options={currencyOptions}
              ariaLabel={copy.targetInputLabel}
              disabled={isLoadingCurrencies || !hasCurrencies}
              tone="string"
              className="w-32"
            />
            <span className="text-syntax-string">&quot;</span>
          </CodeLine>
          <CodeLine number={7}>
            <span>result</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span>cp.</span>
            <span className="text-syntax-built-in">exchange</span>
            <span>(</span>
          </CodeLine>
          <CodeLine number={8}>
            <span className="ml-8 text-syntax-parameter">amount=</span>
            <span>amount</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={9}>
            <span className="ml-8 text-syntax-parameter">source=</span>
            <span>source</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={10}>
            <span className="ml-8 text-syntax-parameter">target=</span>
            <span>target</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={11}>
            <span>)</span>
          </CodeLine>
          <CodeLine number={12} />
          <CodeLine number={13}>
            <span className="text-syntax-built-in">print</span>
            <span>(</span>
            <span className="text-syntax-string">f&quot;{"{"}amount{"}"} {"{"}source{"}"} = {"{"}result{"}"} {"{"}target{"}"}&quot;</span>
            <span>)</span>
          </CodeLine>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button type="button" onClick={onRun} disabled={!canRun}>
          {isRunning ? copy.running : copy.run}
        </Button>

        {output && (
          <div
            className="mt-5 flex items-start gap-3 border-t border-subtle-border pt-5 text-code-m"
            role="status"
            aria-live="polite"
          >
            <span className="mt-0.5 shrink-0 text-content-muted">
              <CodeChevronIcon />
            </span>
            <span className={output.kind === "error" ? "text-danger" : "text-syntax-class"}>
              {output.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
