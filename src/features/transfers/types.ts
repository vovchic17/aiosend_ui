export type TransferParameterName =
  | "user_id"
  | "asset"
  | "amount"
  | "comment"
  | "disable_send_notification";

export type TransferBooleanCodeValue = "True" | "False";

export type TransferPlaygroundOutput = {
  kind: "success" | "error";
  text: string;
};
