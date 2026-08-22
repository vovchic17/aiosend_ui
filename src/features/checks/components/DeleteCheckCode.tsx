import { useEffect, useRef, useState } from "react";

import {
  CodeCheckIcon,
  CodeChevronIcon,
  CodeCopyIcon,
  CodeInput,
  CodeLine,
} from "../../../components/api/CodeControls";
import { Button } from "../../../components/ui/Button";
import type { Dictionary } from "../../../i18n/types";
import type { CheckPlaygroundOutput, DeleteCheckParameterName } from "../types";

type DeleteCheckCodeProps = {
  checkId: string;
  isRunning: boolean;
  canRun: boolean;
  output: CheckPlaygroundOutput | null;
  copy: Dictionary["checks"]["playground"];
  onCheckIdChange: (value: string) => void;
  onParameterEnter: (parameter: DeleteCheckParameterName) => void;
  onParameterLeave: () => void;
  onRun: () => void;
  onCopy: () => Promise<void>;
};

export function DeleteCheckCode({
  checkId,
  isRunning,
  canRun,
  output,
  copy,
  onCheckIdChange,
  onParameterEnter,
  onParameterLeave,
  onRun,
  onCopy,
}: DeleteCheckCodeProps) {
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
    <div
      data-smart-animate="code-window"
      className="relative overflow-hidden rounded-[10px] border border-subtle-border bg-code-surface"
    >
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
        <div className="min-w-[520px] space-y-1">
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
            <span>status</span>{" "}
            <span className="text-syntax-built-in">=</span>{" "}
            <span>cp.</span>
            <span className="text-syntax-built-in">delete_check</span>
            <span>(</span>
          </CodeLine>
          <CodeLine
            number={5}
            parameter="check_id"
            onParameterEnter={() => onParameterEnter("check_id")}
            onParameterLeave={onParameterLeave}
          >
            <span className="ml-8 text-syntax-parameter">check_id=</span>
            <CodeInput
              value={checkId}
              onChange={onCheckIdChange}
              ariaLabel={copy.checkIdInputLabel}
              type="number"
              tone="number"
              className="w-40"
            />
            <span>,</span>
          </CodeLine>
          <CodeLine number={6}>
            <span>)</span>
          </CodeLine>
          <CodeLine number={7} />
          <CodeLine number={8}>
            <span className="text-syntax-built-in">print</span>
            <span>(</span>
            <span className="text-syntax-string">&quot;Check deleted:&quot;</span>
            <span>,</span>{" "}
            <span>status</span>
            <span>)</span>
          </CodeLine>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button
          data-smart-animate="run-button"
          type="button"
          onClick={onRun}
          disabled={!canRun}
        >
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
