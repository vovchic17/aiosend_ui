import type { Dictionary } from "../../../i18n/types";
import type { ExchangeRateParameterName } from "../types";

type Props = {
  activeParameter: ExchangeRateParameterName | null;
  copy: Dictionary["exchangeRates"]["playground"];
  onParameterEnter: (parameter: ExchangeRateParameterName) => void;
  onParameterLeave: () => void;
};

type ParameterDocProps = {
  name: ExchangeRateParameterName;
  type: string;
  description: string;
  activeParameter: ExchangeRateParameterName | null;
  onEnter: (parameter: ExchangeRateParameterName) => void;
  onLeave: () => void;
};

function ParameterDoc({
  name,
  type,
  description,
  activeParameter,
  onEnter,
  onLeave,
}: ParameterDocProps) {
  const isActive = activeParameter === name;

  return (
    <li
      className={`-mx-3 rounded-lg px-3 py-2 text-content transition-colors duration-150 ${
        isActive ? "bg-field-active" : "bg-transparent"
      }`}
      onMouseEnter={() => onEnter(name)}
      onMouseLeave={onLeave}
    >
      <span className="text-code-m text-syntax-parameter">{name}</span>
      <span className="font-body text-body">
        <span className="italic text-content-muted"> ({type})</span>
        <span> — {description}</span>
      </span>
    </li>
  );
}

export function ExchangeRateDocumentation({
  activeParameter,
  copy,
  onParameterEnter,
  onParameterLeave,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-5 py-1 text-code-m text-content">
      <div className="code-signature">
        <a
          href="https://aiosend.readthedocs.io/en/latest/client/tools.html#aiosend.CryptoPay.exchange"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.exchange
        </a>
        <span>(</span>
        <span className="text-syntax-parameter">amount</span>
        <span>, </span>
        <span className="text-syntax-parameter">source</span>
        <span>, </span>
        <span className="text-syntax-parameter">target</span>
        <span>)</span>
      </div>

      <div className="flex flex-col gap-2 font-body text-body">
        <p className="m-0">{copy.docs.description}</p>
        <p className="m-0">{copy.docs.wrapper}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.parameters}</p>
        <ul className="m-0 list-none p-0">
          <ParameterDoc
            name="amount"
            type="float"
            description={copy.docs.amount}
            activeParameter={activeParameter}
            onEnter={onParameterEnter}
            onLeave={onParameterLeave}
          />
          <ParameterDoc
            name="source"
            type="str"
            description={copy.docs.source}
            activeParameter={activeParameter}
            onEnter={onParameterEnter}
            onLeave={onParameterLeave}
          />
          <ParameterDoc
            name="target"
            type="str"
            description={copy.docs.target}
            activeParameter={activeParameter}
            onEnter={onParameterEnter}
            onLeave={onParameterLeave}
          />
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.returnType}</p>
        <span className="w-fit text-code-m text-syntax-built-in">float</span>
      </div>

    </div>
  );
}
