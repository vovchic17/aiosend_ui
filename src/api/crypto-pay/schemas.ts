import { z } from "zod";

const looseObject = z.looseObject;

export const cryptoPayApiErrorSchema = looseObject({
  code: z.number().optional(),
  name: z.string(),
});

export const cryptoPaySuccessSchema = <T extends z.ZodTypeAny>(
  resultSchema: T,
) =>
  looseObject({
    ok: z.literal(true),
    result: resultSchema,
  });

export const cryptoPayErrorSchema = looseObject({
  ok: z.literal(false),
  error: cryptoPayApiErrorSchema,
});

export const cryptoPayResponseSchema = <T extends z.ZodTypeAny>(
  resultSchema: T,
) => z.union([cryptoPaySuccessSchema(resultSchema), cryptoPayErrorSchema]);

export const cryptoPayItemsSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  looseObject({
    items: z.array(itemSchema),
  });

export const cryptoPayTrueSchema = z.literal(true);

export const cryptoPayAppSchema = looseObject({
  app_id: z.number(),
  name: z.string(),
  payment_processing_bot_username: z.string(),
});

export const currencyTypeSchema = z.enum(["crypto", "fiat"]);

export const invoiceStatusSchema = z.enum(["active", "paid", "expired"]);

export const checkStatusSchema = z.enum(["active", "activated"]);

export const transferStatusSchema = z.enum(["completed"]);

export const paidButtonNameSchema = z.enum([
  "viewItem",
  "openChannel",
  "openBot",
  "callback",
]);

export const invoiceSchema = looseObject({
  invoice_id: z.number(),
  hash: z.string(),

  currency_type: currencyTypeSchema,

  asset: z.string().optional(),
  fiat: z.string().optional(),
  amount: z.string(),

  paid_asset: z.string().optional(),
  paid_amount: z.string().optional(),
  paid_fiat_rate: z.string().optional(),

  accepted_assets: z.array(z.string()).optional(),

  fee_asset: z.string().optional(),
  fee_amount: z.union([z.string(), z.number()]).optional(),
  fee: z.string().optional(),

  pay_url: z.string().optional(),

  bot_invoice_url: z.string(),
  mini_app_invoice_url: z.string().optional(),
  web_app_invoice_url: z.string().optional(),

  description: z.string().optional(),
  status: invoiceStatusSchema,

  swap_to: z.string().optional(),
  is_swapped: z.boolean().optional(),
  swapped_uid: z.string().optional(),
  swapped_to: z.string().optional(),
  swapped_rate: z.string().optional(),
  swapped_output: z.string().optional(),
  swapped_usd_amount: z.string().optional(),
  swapped_usd_rate: z.string().optional(),

  created_at: z.string(),

  paid_usd_rate: z.string().optional(),
  usd_rate: z.string().optional(),

  allow_comments: z.boolean(),
  allow_anonymous: z.boolean(),

  expiration_date: z.string().optional(),
  paid_at: z.string().optional(),
  paid_anonymously: z.boolean().optional(),

  comment: z.string().optional(),
  hidden_message: z.string().optional(),
  payload: z.string().optional(),

  paid_btn_name: paidButtonNameSchema.optional(),
  paid_btn_url: z.string().optional(),
});

export const checkSchema = looseObject({
  check_id: z.number(),
  hash: z.string(),

  asset: z.string(),
  amount: z.string(),

  bot_check_url: z.string(),

  pin_to_user_id: z.union([z.string(), z.number()]).optional(),
  pin_to_username: z.string().optional(),

  status: checkStatusSchema,

  created_at: z.string(),
  activated_at: z.string().optional(),
});

export const transferSchema = looseObject({
  transfer_id: z.number(),
  spend_id: z.string(),

  user_id: z.union([z.string(), z.number()]),

  asset: z.string(),
  amount: z.string(),

  status: transferStatusSchema,

  completed_at: z.string(),

  comment: z.string().optional(),
});

export const balanceSchema = looseObject({
  currency_code: z.string(),
  available: z.string(),
  onhold: z.string().optional(),
});

export const exchangeRateSchema = looseObject({
  is_valid: z.boolean(),
  is_crypto: z.boolean(),
  is_fiat: z.boolean(),
  source: z.string(),
  target: z.string(),
  rate: z.string(),
});

export const currencySchema = looseObject({
  is_blockchain: z.boolean().optional(),
  is_stablecoin: z.boolean().optional(),
  is_fiat: z.boolean().optional(),
  name: z.string().optional(),
  code: z.string(),
  url: z.string().optional(),
  decimals: z.number().optional(),
});

export const appStatsSchema = looseObject({
  volume: z.coerce.number(),
  conversion: z.coerce.number(),
  unique_users_count: z.number(),
  created_invoice_count: z.number(),
  paid_invoice_count: z.number(),
  start_at: z.string(),
  end_at: z.string(),
});

export const getMeResponseSchema = cryptoPayResponseSchema(cryptoPayAppSchema);

export const createInvoiceResponseSchema =
  cryptoPayResponseSchema(invoiceSchema);

export const deleteInvoiceResponseSchema =
  cryptoPayResponseSchema(cryptoPayTrueSchema);

export const createCheckResponseSchema = cryptoPayResponseSchema(checkSchema);

export const deleteCheckResponseSchema =
  cryptoPayResponseSchema(cryptoPayTrueSchema);

export const transferResponseSchema = cryptoPayResponseSchema(transferSchema);

export const getInvoicesResponseSchema = cryptoPayResponseSchema(
  cryptoPayItemsSchema(invoiceSchema),
);

export const getChecksResponseSchema = cryptoPayResponseSchema(
  cryptoPayItemsSchema(checkSchema),
);

export const getTransfersResponseSchema = cryptoPayResponseSchema(
  cryptoPayItemsSchema(transferSchema),
);

export const getBalanceResponseSchema = cryptoPayResponseSchema(
  z.array(balanceSchema),
);

export const getExchangeRatesResponseSchema = cryptoPayResponseSchema(
  z.array(exchangeRateSchema),
);

export const getCurrenciesResponseSchema = cryptoPayResponseSchema(
  z.array(currencySchema),
);

export const getStatsResponseSchema = cryptoPayResponseSchema(appStatsSchema);
