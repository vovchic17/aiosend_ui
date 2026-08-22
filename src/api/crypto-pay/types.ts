import type { z } from "zod";

import type {
  appStatsSchema,
  balanceSchema,
  checkSchema,
  cryptoPayApiErrorSchema,
  cryptoPayAppSchema,
  currencySchema,
  exchangeRateSchema,
  invoiceSchema,
  transferSchema,
} from "./schemas";

export type CryptoPayNetwork = "mainnet" | "testnet";

export type MethodAvailability =
  | "enabled"
  | "disabled"
  | "blocked"
  | "unknown";

export type CryptoPayAuthState = {
  token: string;
  host: string;
  network: CryptoPayNetwork;
  app: CryptoPayApp;
};

export type CryptoPayApiError = z.infer<typeof cryptoPayApiErrorSchema>;

export type CryptoPayApp = z.infer<typeof cryptoPayAppSchema>;
export type CryptoPayInvoice = z.infer<typeof invoiceSchema>;
export type CryptoPayCheck = z.infer<typeof checkSchema>;
export type CryptoPayTransfer = z.infer<typeof transferSchema>;
export type CryptoPayBalance = z.infer<typeof balanceSchema>;
export type CryptoPayExchangeRate = z.infer<typeof exchangeRateSchema>;
export type CryptoPayCurrency = z.infer<typeof currencySchema>;
export type CryptoPayAppStats = z.infer<typeof appStatsSchema>;

export type CryptoPayApiResponse<T> =
  | {
      ok: true;
      result: T;
    }
  | {
      ok: false;
      error: CryptoPayApiError;
    };

export type CreateInvoiceParams = {
  currency_type?: "crypto" | "fiat";
  asset?: string;
  fiat?: string;
  accepted_assets?: string;
  amount: string;
  swap_to?: string;
  description?: string;
  hidden_message?: string;
  paid_btn_name?: "viewItem" | "openChannel" | "openBot" | "callback";
  paid_btn_url?: string;
  payload?: string;
  allow_comments?: boolean;
  allow_anonymous?: boolean;
  expires_in?: number;
};

export type DeleteInvoiceParams = {
  invoice_id: number;
};

export type CreateCheckParams = {
  asset: string;
  amount: string;
  pin_to_user_id?: number;
  pin_to_username?: string;
};

export type DeleteCheckParams = {
  check_id: number;
};

export type TransferParams = {
  user_id: number;
  asset: string;
  amount: string;
  spend_id: string;
  comment?: string;
  disable_send_notification?: boolean;
};

export type GetInvoicesParams = {
  asset?: string;
  fiat?: string;
  invoice_ids?: string;
  status?: "active" | "paid" | "expired";
  offset?: number;
  count?: number;
};

export type GetTransfersParams = {
  asset?: string;
  transfer_ids?: string;
  spend_id?: string;
  offset?: number;
  count?: number;
};

export type GetChecksParams = {
  asset?: string;
  check_ids?: string;
  status?: "active" | "activated";
  offset?: number;
  count?: number;
};

export type GetStatsParams = {
  start_at?: string;
  end_at?: string;
};
