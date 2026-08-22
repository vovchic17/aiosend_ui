export type CheckParameterName =
  | "amount"
  | "asset"
  | "pin_to_user_id"
  | "pin_to_username";

export type DeleteCheckParameterName = "check_id";

export type CheckPlaygroundOutput = {
  kind: "success" | "error";
  text: string;
};
