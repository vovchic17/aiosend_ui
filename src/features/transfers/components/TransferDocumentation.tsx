import type { Dictionary } from "../../../i18n/types";
import type { TransferParameterName } from "../types";

type TransferDocumentationProps = {
  activeParameter: TransferParameterName | null;
  copy: Dictionary["transfers"]["playground"];
  onParameterEnter: (parameter: TransferParameterName) => void;
  onParameterLeave: () => void;
};

type ParameterDocProps = {
  name: TransferParameterName;
  type: string;
  description: string;
  activeParameter: TransferParameterName | null;
  onEnter: (parameter: TransferParameterName) => void;
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
      className={`
        -mx-3 rounded-lg px-3 py-2 text-content
        transition-colors duration-150
        ${isActive ? "bg-field-active" : "bg-transparent"}
      `}
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

export function TransferDocumentation({
  activeParameter,
  copy,
  onParameterEnter,
  onParameterLeave,
}: TransferDocumentationProps) {
  const parameter = (
    name: TransferParameterName,
    type: string,
    description: string,
  ) => (
    <ParameterDoc
      name={name}
      type={type}
      description={description}
      activeParameter={activeParameter}
      onEnter={onParameterEnter}
      onLeave={onParameterLeave}
    />
  );

  return (
    <div className="flex h-full flex-col gap-5 py-1 text-code-m text-content">
      <div className="code-signature">
        <a
          href="https://aiosend.readthedocs.io/en/latest/api/methods.html#aiosend.CryptoPay.transfer"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.transfer
        </a>
        <span>(</span>
        <span className="text-syntax-parameter">user_id</span>
        <span>, </span>
        <span className="text-syntax-parameter">amount</span>
        <span>, </span>
        <span className="text-syntax-parameter">asset</span>
        <span>, </span>
        <span className="text-syntax-parameter">comment</span>
        <span>, </span>
        <span className="text-syntax-parameter">disable_send_notification</span>
        <span>)</span>
      </div>

      <p className="m-0 font-body text-body">{copy.docs.description}</p>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.parameters}</p>
        <ul className="m-0 list-none p-0">
          {parameter("user_id", "int", copy.docs.userId)}
          {parameter("amount", "float", copy.docs.amount)}
          {parameter("asset", "Asset", copy.docs.asset)}
          {parameter("comment", "str | None", copy.docs.comment)}
          {parameter(
            "disable_send_notification",
            "bool | None",
            copy.docs.disableSendNotification,
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.returnType}</p>
        <a
          href="https://aiosend.readthedocs.io/en/latest/api/types.html#aiosend.types.Transfer"
          target="_blank"
          rel="noreferrer"
          className="w-fit text-syntax-built-in hover:underline"
        >
          Transfer
        </a>
      </div>
    </div>
  );
}
