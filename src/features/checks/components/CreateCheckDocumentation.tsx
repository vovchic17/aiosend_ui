import type { Dictionary } from "../../../i18n/types";
import type { CheckParameterName } from "../types";

type CreateCheckDocumentationProps = {
  activeParameter: CheckParameterName | null;
  copy: Dictionary["checks"]["playground"];
  onParameterEnter: (parameter: CheckParameterName) => void;
  onParameterLeave: () => void;
};

type ParameterDocProps = {
  name: CheckParameterName;
  type: string;
  description: string;
  activeParameter: CheckParameterName | null;
  onEnter: (parameter: CheckParameterName) => void;
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
  return (
    <li
      className={`-mx-3 rounded-lg px-3 py-2 text-content transition-colors duration-150 ${
        activeParameter === name ? "bg-field-active" : "bg-transparent"
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

export function CreateCheckDocumentation({
  activeParameter,
  copy,
  onParameterEnter,
  onParameterLeave,
}: CreateCheckDocumentationProps) {
  const parameter = (
    name: CheckParameterName,
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
          href="https://aiosend.readthedocs.io/en/latest/api/methods.html#aiosend.CryptoPay.create_check"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.create_check
        </a>
        <span>(</span>
        <span className="text-syntax-parameter">amount</span>
        <span>, </span>
        <span className="text-syntax-parameter">asset</span>
        <span>, </span>
        <span className="text-syntax-parameter">pin_to_user_id</span>
        <span>, </span>
        <span className="text-syntax-parameter">pin_to_username</span>
        <span>)</span>
      </div>

      <p className="m-0 font-body text-body">{copy.docs.description}</p>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.parameters}</p>
        <ul className="m-0 list-none p-0">
          {parameter("amount", "float", copy.docs.amount)}
          {parameter("asset", "Asset", copy.docs.asset)}
          {parameter("pin_to_user_id", "int | None", copy.docs.pinToUserId)}
          {parameter("pin_to_username", "str | None", copy.docs.pinToUsername)}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.returnType}</p>
        <a
          href="https://aiosend.readthedocs.io/en/latest/api/types.html#aiosend.types.Check"
          target="_blank"
          rel="noreferrer"
          className="w-fit text-syntax-built-in hover:underline"
        >
          Check
        </a>
      </div>
    </div>
  );
}
