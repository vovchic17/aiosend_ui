import type { Dictionary } from "../../../i18n/types";

type DeleteAllInvoicesDocumentationProps = {
  copy: Dictionary["invoices"]["playground"];
};

export function DeleteAllInvoicesDocumentation({
  copy,
}: DeleteAllInvoicesDocumentationProps) {
  return (
    <div className="flex h-full flex-col gap-5 py-1 text-code-m text-content">
      <div className="code-signature">
        <a
          href="https://aiosend.readthedocs.io/en/latest/client/tools.html#aiosend.CryptoPay.delete_all_invoices"
          target="_blank"
          rel="noreferrer"
          className="text-syntax-built-in hover:underline"
        >
          CryptoPay.delete_all_invoices
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
