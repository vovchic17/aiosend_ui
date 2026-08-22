import type { ZodType } from "zod";
import {
  CRYPTO_PAY_MAINNET_PROXY_URL,
  CRYPTO_PAY_TESTNET_PROXY_URL,
  CRYPTO_PAY_TOKEN_HEADER,
  CRYPTO_PAY_UNAUTHORIZED_CODE,
  CRYPTO_PAY_UNAUTHORIZED_NAME,
} from "./constants";
import {
  CryptoPayApiRequestError,
  CryptoPayAuthError,
  CryptoPayHttpError,
  CryptoPayValidationError,
} from "./errors";
import {
  createCheckResponseSchema,
  createInvoiceResponseSchema,
  deleteCheckResponseSchema,
  deleteInvoiceResponseSchema,
  getBalanceResponseSchema,
  getChecksResponseSchema,
  getCurrenciesResponseSchema,
  getExchangeRatesResponseSchema,
  getInvoicesResponseSchema,
  getMeResponseSchema,
  getStatsResponseSchema,
  getTransfersResponseSchema,
  transferResponseSchema,
} from "./schemas";
import type {
  CreateCheckParams,
  CreateInvoiceParams,
  CryptoPayApiResponse,
  CryptoPayApp,
  CryptoPayAppStats,
  CryptoPayAuthState,
  CryptoPayBalance,
  CryptoPayCheck,
  CryptoPayCurrency,
  CryptoPayExchangeRate,
  CryptoPayInvoice,
  CryptoPayNetwork,
  CryptoPayTransfer,
  DeleteCheckParams,
  DeleteInvoiceParams,
  GetChecksParams,
  GetInvoicesParams,
  GetStatsParams,
  GetTransfersParams,
  MethodAvailability,
  TransferParams,
} from "./types";
type CryptoPayClientOptions = {
  onUnauthorized?: () => void;
};

type RequestOptions<T> = {
  method?: "GET" | "POST";
  endpoint: string;
  params?: Record<string, unknown>;
  schema: ZodType<CryptoPayApiResponse<T>>;
};
type AuthProbeResult =
  | { ok: true; auth: CryptoPayAuthState }
  | { ok: false; unauthorized: true };
function isUnauthorizedResponse(
  response: CryptoPayApiResponse<unknown>,
): boolean {
  return (
    response.ok === false &&
    response.error.code === CRYPTO_PAY_UNAUTHORIZED_CODE &&
    response.error.name === CRYPTO_PAY_UNAUTHORIZED_NAME
  );
}
function isUnauthorizedData(responseData: unknown): boolean {
  if (!isObject(responseData) || responseData.ok !== false) {
    return false;
  }

  const error = responseData.error;
  return (
    isObject(error) &&
    error.code === CRYPTO_PAY_UNAUTHORIZED_CODE &&
    error.name === CRYPTO_PAY_UNAUTHORIZED_NAME
  );
}
function buildUrl(
  host: string,
  endpoint: string,
  params?: Record<string, unknown>,
): URL {
  const url = new URL(endpoint, host);
  if (!params) {
    return url;
  }
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}
async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isMethodDisabledResponse(responseData: unknown): boolean {
  if (!isObject(responseData)) {
    return false;
  }
  if (responseData.ok !== false) {
    return false;
  }
  const error = responseData.error;
  if (!isObject(error)) {
    return false;
  }
  return error.code === 403 && error.name === "METHOD_DISABLED";
}
function isMethodBlockedResponse(responseData: unknown): boolean {
  if (!isObject(responseData)) {
    return false;
  }
  if (responseData.ok !== false) {
    return false;
  }
  const error = responseData.error;
  if (!isObject(error)) {
    return false;
  }
  return error.code === 423 && error.name === "METHOD_BLOCKED";
}
function getApiErrorName(responseData: unknown): string | null {
  if (!isObject(responseData) || responseData.ok !== false) {
    return null;
  }
  const error = responseData.error;
  if (!isObject(error) || typeof error.name !== "string") {
    return null;
  }
  return error.name;
}
function isTransferRateLimitResponse(responseData: unknown): boolean {
  const errorName = getApiErrorName(responseData);
  return (
    errorName === "TRANSFER_RATE_LIMIT_EXCEEDED" ||
    errorName === "TOO_MANY_REQUESTS"
  );
}
function getMethodAvailability(responseData: unknown): MethodAvailability {
  if (isMethodDisabledResponse(responseData)) {
    return "disabled";
  }
  if (isMethodBlockedResponse(responseData)) {
    return "blocked";
  }
  return "enabled";
}
export class CryptoPayClient {
  private readonly token: string;
  private readonly host: string;
  private readonly onUnauthorized?: () => void;
  private currenciesPromise: Promise<CryptoPayCurrency[]> | null = null;

  constructor(
    auth: Pick<CryptoPayAuthState, "token" | "host">,
    options: CryptoPayClientOptions = {},
  ) {
    this.token = auth.token;
    this.host = auth.host;
    this.onUnauthorized = options.onUnauthorized;
  }

  private handleUnauthorized(): void {
    this.onUnauthorized?.();
  }
  private async request<T>({
    method = "GET",
    endpoint,
    params,
    schema,
  }: RequestOptions<T>): Promise<T> {
    const url = buildUrl(
      this.host,
      endpoint,
      method === "GET" ? params : undefined,
    );
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [CRYPTO_PAY_TOKEN_HEADER]: this.token,
      },
      body: method === "POST" ? JSON.stringify(params ?? {}) : undefined,
    });
    const responseData = await parseJsonResponse(response);

    if (response.status === CRYPTO_PAY_UNAUTHORIZED_CODE || isUnauthorizedData(responseData)) {
      this.handleUnauthorized();
    }

    if (!response.ok) {
      throw new CryptoPayHttpError(response.status, endpoint, responseData);
    }
    const parsed = schema.safeParse(responseData);
    if (!parsed.success) {
      console.error("Validation failed");
      console.error("Response:", responseData);
      console.error("Zod error:", parsed.error.issues);
      throw new CryptoPayValidationError(responseData, parsed.error);
    }
    if (!parsed.data.ok) {
      throw new CryptoPayApiRequestError(response.status, endpoint, parsed.data.error);
    }
    return parsed.data.result;
  }
  private async requestProbe(endpoint: string): Promise<unknown> {
    const url = buildUrl(this.host, endpoint);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [CRYPTO_PAY_TOKEN_HEADER]: this.token,
      },
    });
    const responseData = await parseJsonResponse(response);

    if (response.status === CRYPTO_PAY_UNAUTHORIZED_CODE || isUnauthorizedData(responseData)) {
      this.handleUnauthorized();
      throw new CryptoPayAuthError();
    }

    return responseData;
  }
  async getChecksAvailability(): Promise<MethodAvailability> {
    try {
      const responseData = await this.requestProbe("/api/createCheck");
      return getMethodAvailability(responseData);
    } catch {
      return "unknown";
    }
  }
  async getTransfersAvailability(): Promise<MethodAvailability> {
    try {
      const responseData = await this.requestProbe("/api/transfer");
      if (isTransferRateLimitResponse(responseData)) {
        return "unknown";
      }
      return getMethodAvailability(responseData);
    } catch {
      return "unknown";
    }
  }
  async getMe(): Promise<CryptoPayApp> {
    return this.request({
      endpoint: "/api/getMe",
      schema: getMeResponseSchema,
    });
  }
  async createInvoice(params: CreateInvoiceParams): Promise<CryptoPayInvoice> {
    return this.request({
      method: "POST",
      endpoint: "/api/createInvoice",
      params,
      schema: createInvoiceResponseSchema,
    });
  }
  async deleteInvoice(params: DeleteInvoiceParams): Promise<true> {
    return this.request({
      method: "POST",
      endpoint: "/api/deleteInvoice",
      params,
      schema: deleteInvoiceResponseSchema,
    });
  }
  async createCheck(params: CreateCheckParams): Promise<CryptoPayCheck> {
    return this.request({
      method: "POST",
      endpoint: "/api/createCheck",
      params,
      schema: createCheckResponseSchema,
    });
  }
  async deleteCheck(params: DeleteCheckParams): Promise<true> {
    return this.request({
      method: "POST",
      endpoint: "/api/deleteCheck",
      params,
      schema: deleteCheckResponseSchema,
    });
  }
  async transfer(params: TransferParams): Promise<CryptoPayTransfer> {
    return this.request({
      method: "POST",
      endpoint: "/api/transfer",
      params,
      schema: transferResponseSchema,
    });
  }
  async getInvoices(params?: GetInvoicesParams): Promise<CryptoPayInvoice[]> {
    const result = await this.request<{ items: CryptoPayInvoice[] }>({
      endpoint: "/api/getInvoices",
      params,
      schema: getInvoicesResponseSchema,
    });
    return result.items;
  }
  async getChecks(params?: GetChecksParams): Promise<CryptoPayCheck[]> {
    const result = await this.request<{ items: CryptoPayCheck[] }>({
      endpoint: "/api/getChecks",
      params,
      schema: getChecksResponseSchema,
    });
    return result.items;
  }
  async getTransfers(
    params?: GetTransfersParams,
  ): Promise<CryptoPayTransfer[]> {
    const result = await this.request<{ items: CryptoPayTransfer[] }>({
      endpoint: "/api/getTransfers",
      params,
      schema: getTransfersResponseSchema,
    });
    return result.items;
  }
  async getBalance(): Promise<CryptoPayBalance[]> {
    return this.request({
      endpoint: "/api/getBalance",
      schema: getBalanceResponseSchema,
    });
  }
  async getExchangeRates(): Promise<CryptoPayExchangeRate[]> {
    return this.request({
      endpoint: "/api/getExchangeRates",
      schema: getExchangeRatesResponseSchema,
    });
  }
  async getCurrencies(): Promise<CryptoPayCurrency[]> {
    if (!this.currenciesPromise) {
      this.currenciesPromise = this.request({
        endpoint: "/api/getCurrencies",
        schema: getCurrenciesResponseSchema,
      }).catch((error) => {

        this.currenciesPromise = null;
        throw error;
      });
    }

    return this.currenciesPromise;
  }
  async getStats(params?: GetStatsParams): Promise<CryptoPayAppStats> {
    return this.request({
      endpoint: "/api/getStats",
      params,
      schema: getStatsResponseSchema,
    });
  }
}
async function probeTokenOnHost(
  token: string,
  host: string,
  network: CryptoPayNetwork,
): Promise<AuthProbeResult> {
  const response = await fetch(`${host}/api/getMe`, {
    method: "GET",
    headers: { Accept: "application/json", [CRYPTO_PAY_TOKEN_HEADER]: token },
  });
  const responseData = await parseJsonResponse(response);
  const parsed = getMeResponseSchema.safeParse(responseData);
  if (!parsed.success) {
    throw new CryptoPayValidationError(responseData, parsed.error);
  }
  if (!parsed.data.ok) {
    if (isUnauthorizedResponse(parsed.data)) {
      return { ok: false, unauthorized: true };
    }
    throw new CryptoPayApiRequestError(response.status, "/api/getMe", parsed.data.error);
  }
  if (!response.ok) {
    throw new CryptoPayHttpError(response.status, "/api/getMe", responseData);
  }
  return { ok: true, auth: { token, host, network, app: parsed.data.result } };
}
export async function authorizeCryptoPayToken(
  token: string,
): Promise<CryptoPayAuthState> {
  const trimmedToken = token.trim();
  const mainnetResult = await probeTokenOnHost(
    trimmedToken,
    CRYPTO_PAY_MAINNET_PROXY_URL,
    "mainnet",
  );
  if (mainnetResult.ok) {
    return mainnetResult.auth;
  }
  const testnetResult = await probeTokenOnHost(
    trimmedToken,
    CRYPTO_PAY_TESTNET_PROXY_URL,
    "testnet",
  );
  if (testnetResult.ok) {
    return testnetResult.auth;
  }
  throw new CryptoPayAuthError();
}
