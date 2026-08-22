export type InvoiceParameterName =
  | "amount"
  | "asset"
  | "description"
  | "hidden_message"
  | "payload"
  | "allow_comments"
  | "allow_anonymous"
  | "expires_in";

export type BooleanCodeValue = "True" | "False";

export type PlaygroundOutput = {
  kind: "success" | "error";
  text: string;
};

export type DeleteInvoiceParameterName = "invoice_id";
