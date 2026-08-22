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
  BooleanCodeValue,
  InvoiceParameterName,
  PlaygroundOutput,
} from "../types";

type CreateInvoiceCodeProps = {
  amount: string;
  asset: string;
  description: string;
  hiddenMessage: string;
  payload: string;
  allowComments: BooleanCodeValue;
  allowAnonymous: BooleanCodeValue;
  expiresIn: string;
  assetOptions: CodeOption[];
  booleanOptions: CodeOption[];
  isLoadingCurrencies: boolean;
  hasCurrencies: boolean;
  isRunning: boolean;
  canRun: boolean;
  output: PlaygroundOutput | null;
  copy: Dictionary["invoices"]["playground"];
  onAmountChange: (value: string) => void;
  onAssetChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHiddenMessageChange: (value: string) => void;
  onPayloadChange: (value: string) => void;
  onAllowCommentsChange: (value: BooleanCodeValue) => void;
  onAllowAnonymousChange: (value: BooleanCodeValue) => void;
  onExpiresInChange: (value: string) => void;
  onParameterEnter: (parameter: InvoiceParameterName) => void;
  onParameterLeave: () => void;
  onRun: () => void;
  onCopy: () => Promise<void>;
};

export function CreateInvoiceCode({
  amount,
  asset,
  description,
  hiddenMessage,
  payload,
  allowComments,
  allowAnonymous,
  expiresIn,
  assetOptions,
  booleanOptions,
  isLoadingCurrencies,
  hasCurrencies,
  isRunning,
  canRun,
  output,
  copy,
  onAmountChange,
  onAssetChange,
  onDescriptionChange,
  onHiddenMessageChange,
  onPayloadChange,
  onAllowCommentsChange,
  onAllowAnonymousChange,
  onExpiresInChange,
  onParameterEnter,
  onParameterLeave,
  onRun,
  onCopy,
}: CreateInvoiceCodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = (parameter: string) =>
    onParameterEnter(parameter as InvoiceParameterName);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await onCopy();
      setIsCopied(true);

      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }

      copiedTimerRef.current = setTimeout(() => {
        setIsCopied(false);
        copiedTimerRef.current = null;
      }, 1600);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <div data-smart-animate="code-window" className="relative overflow-hidden rounded-[10px] border border-subtle-border bg-code-surface">
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={isCopied ? copy.copiedCodeLabel : copy.copyCodeLabel}
        title={isCopied ? copy.copiedCodeLabel : copy.copyCodeLabel}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-content/20 ${
          isCopied
            ? ""
            : "text-syntax-number hover:text-content-muted"
        }`}
      >
        <span className="transition-transform duration-200">
          {isCopied ? <CodeCheckIcon /> : <CodeCopyIcon />}
        </span>
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
          <CodeLine number={4}>
            <span>invoice</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span>cp.</span>
            <span className="text-syntax-built-in">create_invoice</span>
            <span>(</span>
          </CodeLine>
          <CodeLine number={5} parameter="amount" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">amount=</span>
            <CodeInput value={amount} onChange={onAmountChange} ariaLabel={copy.amountInputLabel} type="number" tone="number" className="w-32" />
            <span>,</span>
          </CodeLine>
          <CodeLine number={6} parameter="asset" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">asset=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeSelect value={asset} onChange={onAssetChange} options={assetOptions} ariaLabel={copy.assetInputLabel} disabled={isLoadingCurrencies || !hasCurrencies} tone="string" className="w-32" />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={7} parameter="description" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">description=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeInput value={description} onChange={onDescriptionChange} ariaLabel={copy.descriptionInputLabel} className="w-52" />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={8} parameter="hidden_message" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">hidden_message=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeInput value={hiddenMessage} onChange={onHiddenMessageChange} ariaLabel={copy.hiddenMessageInputLabel} className="w-52" />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={9} parameter="payload" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">payload=</span>
            <span className="text-syntax-string">&quot;</span>
            <CodeInput value={payload} onChange={onPayloadChange} ariaLabel={copy.payloadInputLabel} className="w-52" />
            <span className="text-syntax-string">&quot;</span>
            <span>,</span>
          </CodeLine>
          <CodeLine number={10} parameter="allow_comments" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">allow_comments=</span>
            <CodeSelect value={allowComments} onChange={(value) => onAllowCommentsChange(value as BooleanCodeValue)} options={booleanOptions} ariaLabel={copy.allowCommentsInputLabel} tone="keyword" className="w-28" />
            <span>,</span>
          </CodeLine>
          <CodeLine number={11} parameter="allow_anonymous" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">allow_anonymous=</span>
            <CodeSelect value={allowAnonymous} onChange={(value) => onAllowAnonymousChange(value as BooleanCodeValue)} options={booleanOptions} ariaLabel={copy.allowAnonymousInputLabel} tone="keyword" className="w-28" />
            <span>,</span>
          </CodeLine>
          <CodeLine number={12} parameter="expires_in" onParameterEnter={enter} onParameterLeave={onParameterLeave}>
            <span className="ml-8 text-syntax-parameter">expires_in=</span>
            <CodeInput value={expiresIn} onChange={onExpiresInChange} ariaLabel={copy.expiresInInputLabel} type="number" tone="number" className="w-32" />
            <span>,</span>
          </CodeLine>
          <CodeLine number={13}>
            <span>)</span>
          </CodeLine>
          <CodeLine number={14} />
          <CodeLine number={15}>
            <span className="text-syntax-built-in">print</span>
            <span>(</span>
            <span className="text-syntax-string">&quot;Invoice URL:&quot;</span>
            <span>,</span>{" "}
            <span>invoice.bot_invoice_url</span>
            <span>)</span>
          </CodeLine>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button data-smart-animate="run-button" type="button" onClick={onRun} disabled={!canRun}>
          {isRunning ? copy.running : copy.run}
        </Button>

        {output && (
          <div className="mt-5 flex items-start gap-3 border-t border-subtle-border pt-5 text-code-m" role="status" aria-live="polite">
            <span className="mt-0.5 shrink-0 text-content-muted"><CodeChevronIcon /></span>
            <span className={output.kind === "error" ? "text-danger" : "text-syntax-class"}>{output.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
