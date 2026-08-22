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
  TransferBooleanCodeValue,
  TransferParameterName,
  TransferPlaygroundOutput,
} from "../types";

type TransferCodeProps = {
  userId: string;
  amount: string;
  asset: string;
  comment: string;
  disableSendNotification: TransferBooleanCodeValue;
  assetOptions: CodeOption[];
  booleanOptions: CodeOption[];
  isLoadingCurrencies: boolean;
  hasCurrencies: boolean;
  isRunning: boolean;
  canRun: boolean;
  output: TransferPlaygroundOutput | null;
  copy: Dictionary["transfers"]["playground"];
  onUserIdChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onAssetChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onDisableSendNotificationChange: (value: TransferBooleanCodeValue) => void;
  onParameterEnter: (parameter: TransferParameterName) => void;
  onParameterLeave: () => void;
  onRun: () => void;
  onCopy: () => Promise<void>;
};

export function TransferCode({
  userId,
  amount,
  asset,
  comment,
  disableSendNotification,
  assetOptions,
  booleanOptions,
  isLoadingCurrencies,
  hasCurrencies,
  isRunning,
  canRun,
  output,
  copy,
  onUserIdChange,
  onAmountChange,
  onAssetChange,
  onCommentChange,
  onDisableSendNotificationChange,
  onParameterEnter,
  onParameterLeave,
  onRun,
  onCopy,
}: TransferCodeProps) {
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
        <span className="transition-transform duration-200">
          {isCopied ? <CodeCheckIcon /> : <CodeCopyIcon />}
        </span>
      </button>

      <div className="overflow-x-auto px-5 py-5 pr-14">
        <div className="min-w-[650px] space-y-1">
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
          <CodeLine number={4}>
            <span>transfer</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span>cp.</span>
            <span className="text-syntax-built-in">transfer</span>
            <span>(</span>
          </CodeLine>
          <CodeLine
            number={5}
            parameter="user_id"
            onParameterEnter={() => onParameterEnter("user_id")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">user_id=</span>
            <CodeInput
              value={userId}
              onChange={onUserIdChange}
              ariaLabel={copy.userIdInputLabel}
              type="number"
              tone="number"
              className="w-40"
            />
            <span>,</span>
          </CodeLine>
          <CodeLine
            number={6}
            parameter="amount"
            onParameterEnter={() => onParameterEnter("amount")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">amount=</span>
            <CodeInput
              value={amount}
              onChange={onAmountChange}
              ariaLabel={copy.amountInputLabel}
              type="number"
              tone="number"
              className="w-32"
            />
            <span>,</span>
          </CodeLine>
          <CodeLine
            number={7}
            parameter="asset"
            onParameterEnter={() => onParameterEnter("asset")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">asset=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeSelect
              value={asset}
              onChange={onAssetChange}
              options={assetOptions}
              ariaLabel={copy.assetInputLabel}
              disabled={isLoadingCurrencies || !hasCurrencies}
              tone="string"
              className="w-32"
            />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine
            number={8}
            parameter="comment"
            onParameterEnter={() => onParameterEnter("comment")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">comment=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeInput
              value={comment}
              onChange={onCommentChange}
              ariaLabel={copy.commentInputLabel}
              className="w-48"
            />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine
            number={9}
            parameter="disable_send_notification"
            onParameterEnter={() => onParameterEnter("disable_send_notification")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">
              disable_send_notification=
            </span>
            <CodeSelect
              value={disableSendNotification}
              onChange={(value) =>
                onDisableSendNotificationChange(value as TransferBooleanCodeValue)
              }
              options={booleanOptions}
              ariaLabel={copy.disableSendNotificationInputLabel}
              tone="keyword"
              className="w-32"
            />
            <span>,</span>
          </CodeLine>
          <CodeLine number={10}>
            <span>)</span>
          </CodeLine>
          <CodeLine number={11} />
          <CodeLine number={12}>
            <span className="text-syntax-built-in">print</span>
            <span>(</span>
            <span className="text-syntax-string">&quot;Transfer ID:&quot;</span>
            <span>,</span>{" "}
            <span>transfer.transfer_id</span>
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
            <span
              className={
                output.kind === "error" ? "text-danger" : "text-syntax-class"
              }
            >
              {output.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
