import type { Dictionary } from "../../../i18n/types";
import type { DeleteCheckParameterName } from "../types";

type DeleteCheckDocumentationProps = {
  activeParameter: DeleteCheckParameterName | null;
  copy: Dictionary["checks"]["playground"];
  onParameterEnter: (parameter: DeleteCheckParameterName) => void;
  onParameterLeave: () => void;
};

export function DeleteCheckDocumentation({
  activeParameter,
  copy,
  onParameterEnter,
  onParameterLeave,
}: DeleteCheckDocumentationProps) {
  const isActive = activeParameter === "check_id";

  return (
    <div className="flex h-full flex-col gap-5 py-1 text-code-m text-content">
      <div className="code-signature">
        <a
          href="https://aiosend.readthedocs.io/en/latest/api/methods.html#aiosend.CryptoPay.delete_check"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.delete_check
        </a>
        <span>(</span>
        <span className="text-syntax-parameter">check_id</span>
        <span>)</span>
      </div>

      <p className="m-0 font-body text-body">{copy.deleteDocs.description}</p>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.deleteDocs.parameters}</p>
        <ul className="m-0 list-none p-0">
          <li
            className={`-mx-3 rounded-lg px-3 py-2 text-content transition-colors duration-150 ${
              isActive ? "bg-field-active" : "bg-transparent"
            }`}
            onMouseEnter={() => onParameterEnter("check_id")}
            onMouseLeave={onParameterLeave}
          >
            <span className="text-code-m text-syntax-parameter">check_id</span>
            <span className="font-body text-body">
              <span className="italic text-content-muted"> (int)</span>
              <span> — {copy.deleteDocs.checkId}</span>
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.deleteDocs.returnType}</p>
        <p className="m-0 text-syntax-keyword">bool</p>
      </div>
    </div>
  );
}
