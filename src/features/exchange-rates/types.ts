export type ExchangeRateParameterName = "amount" | "source" | "target";

export type ExchangeRatePlaygroundOutput = {
  kind: "success" | "error";
  text: string;
};
