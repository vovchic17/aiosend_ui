import type { Dictionary } from "../../../i18n/types";
import type { InvoiceParameterName } from "../types";

type CreateInvoiceDocumentationProps = {
  activeParameter: InvoiceParameterName | null;
  copy: Dictionary["invoices"]["playground"];
  onParameterEnter: (parameter: InvoiceParameterName) => void;
  onParameterLeave: () => void;
};

type ParameterDocProps = {
  name: InvoiceParameterName;
  type: string;
  description: string;
  activeParameter: InvoiceParameterName | null;
  onEnter: (parameter: InvoiceParameterName) => void;
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

export function CreateInvoiceDocumentation({
  activeParameter,
  copy,
  onParameterEnter,
  onParameterLeave,
}: CreateInvoiceDocumentationProps) {
  const parameter = (
    name: InvoiceParameterName,
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
          href="https://aiosend.readthedocs.io/en/latest/api/methods.html#aiosend.CryptoPay.create_invoice"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.create_invoice
        </a>
        <span>(</span>
        <span className="text-syntax-parameter">amount</span>
        <span>, </span>
        <span className="text-syntax-parameter">asset</span>
        <span>, </span>
        <span className="text-syntax-parameter">description</span>
        <span>, </span>
        <span className="text-syntax-parameter">hidden_message</span>
        <span>, </span>
        <span className="text-syntax-parameter">payload</span>
        <span>, </span>
        <span className="text-syntax-parameter">allow_comments</span>
        <span>, </span>
        <span className="text-syntax-parameter">allow_anonymous</span>
        <span>, </span>
        <span className="text-syntax-parameter">expires_in</span>
        <span>)</span>
      </div>

      <p className="m-0 font-body text-body">{copy.docs.description}</p>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.parameters}</p>
        <ul className="m-0 list-none p-0">
          {parameter("amount", "int", copy.docs.amount)}
          {parameter("asset", "str", copy.docs.asset)}
          {parameter("description", "str | None", copy.docs.descriptionParam)}
          {parameter("hidden_message", "str | None", copy.docs.hiddenMessage)}
          {parameter("payload", "str | None", copy.docs.payload)}
          {parameter("allow_comments", "bool", copy.docs.allowComments)}
          {parameter("allow_anonymous", "bool", copy.docs.allowAnonymous)}
          {parameter("expires_in", "int | None", copy.docs.expiresIn)}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.docs.returnType}</p>
        <a
          href="https://aiosend.readthedocs.io/en/latest/api/types.html#aiosend.types.Invoice"
          target="_blank"
          rel="noreferrer"
          className="w-fit text-syntax-built-in hover:underline"
        >
          Invoice
        </a>
      </div>
    </div>
  );
}
