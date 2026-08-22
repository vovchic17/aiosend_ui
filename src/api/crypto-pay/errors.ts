import { z } from "zod";

import {
  CRYPTO_PAY_UNAUTHORIZED_CODE,
  CRYPTO_PAY_UNAUTHORIZED_NAME,
} from "./constants";
import type { CryptoPayApiError } from "./types";

function formatApiEndpoint(endpoint: string): string {
  if (endpoint.startsWith("/api/")) {
    return endpoint.slice(4);
  }

  if (endpoint.startsWith("/")) {
    return endpoint;
  }

  return `/${endpoint}`;
}

function getApiErrorName(response: unknown): string {
  if (typeof response !== "object" || response === null) {
    return "UNKNOWN_ERROR";
  }

  const error = (response as Record<string, unknown>).error;
  if (typeof error !== "object" || error === null) {
    return "UNKNOWN_ERROR";
  }

  const name = (error as Record<string, unknown>).name;
  return typeof name === "string" && name ? name : "UNKNOWN_ERROR";
}

function formatAiosendApiError(
  status: number,
  endpoint: string,
  errorName: string,
): string {
  return `aiosend.exceptions.APIError: [${status}] ${formatApiEndpoint(endpoint)}: ${errorName}`;
}

export class CryptoPayHttpError extends Error {
  public readonly status: number;
  public readonly endpoint: string;
  public readonly response: unknown;

  constructor(status: number, endpoint: string, response: unknown) {
    super(formatAiosendApiError(status, endpoint, getApiErrorName(response)));

    this.name = "CryptoPayHttpError";
    this.status = status;
    this.endpoint = endpoint;
    this.response = response;
  }
}

export class CryptoPayApiRequestError extends Error {
  public readonly status: number;
  public readonly endpoint: string;
  public readonly apiError: CryptoPayApiError;

  constructor(status: number, endpoint: string, apiError: CryptoPayApiError) {
    super(formatAiosendApiError(status, endpoint, apiError.name));

    this.name = "CryptoPayApiRequestError";
    this.status = status;
    this.endpoint = endpoint;
    this.apiError = apiError;
  }
}

export class CryptoPayAuthError extends Error {
  constructor() {
    super("Invalid Crypto Pay API token");

    this.name = "CryptoPayAuthError";
  }
}

export class CryptoPayValidationError extends Error {
  public readonly response: unknown;
  public readonly zodError: z.ZodError | unknown;

  constructor(response: unknown, zodError: z.ZodError | unknown) {
    const issues =
      zodError instanceof z.ZodError
        ? zodError.issues
            .map((issue) => {
              const path = issue.path.length ? issue.path.join(".") : "root";

              return `${path}: ${issue.message}`;
            })
            .join("; ")
        : "Unknown validation error";

    super(`Crypto Pay API response validation failed: ${issues}`);

    this.name = "CryptoPayValidationError";
    this.response = response;
    this.zodError = zodError;
  }
}

export class CryptoPayMissingAuthError extends Error {
  constructor() {
    super("Crypto Pay API client is not authorized.");

    this.name = "CryptoPayMissingAuthError";
  }
}

export function isCryptoPayUnauthorizedError(error: unknown): boolean {
  if (error instanceof CryptoPayHttpError) {
    return error.status === CRYPTO_PAY_UNAUTHORIZED_CODE;
  }

  if (error instanceof CryptoPayApiRequestError) {
    return (
      error.apiError.code === CRYPTO_PAY_UNAUTHORIZED_CODE &&
      error.apiError.name === CRYPTO_PAY_UNAUTHORIZED_NAME
    );
  }

  return error instanceof CryptoPayAuthError;
}
