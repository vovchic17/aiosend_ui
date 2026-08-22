import type { Dictionary } from "../../../i18n/types";

type DeleteAllChecksDocumentationProps = {
  copy: Dictionary["checks"]["playground"];
};

export function DeleteAllChecksDocumentation({
  copy,
}: DeleteAllChecksDocumentationProps) {
  return (
    <div className="flex h-full flex-col gap-5 py-1 text-code-m text-content">
      <div className="code-signature">
        <a
          href="https://aiosend.readthedocs.io/en/latest/client/tools.html#aiosend.CryptoPay.delete_all_checks"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.delete_all_checks
        </a>
        <span>()</span>
      </div>

      <p className="m-0 font-body text-body">{copy.deleteAllDocs.description}</p>
      <p className="m-0 font-body text-body">{copy.deleteAllDocs.wrapper}</p>
      <p className="m-0 font-body text-body">{copy.deleteAllDocs.usage}</p>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-body text-body">{copy.deleteAllDocs.returnType}</p>
        <p className="m-0 text-syntax-keyword">None</p>
      </div>
    </div>
  );
}
