import { z } from "zod";

import {
  CRYPTO_PAY_AUTH_STORAGE_KEY,
  CRYPTO_PAY_MAINNET_PROXY_URL,
  CRYPTO_PAY_TESTNET_PROXY_URL,
} from "./constants";
import { cryptoPayAppSchema } from "./schemas";
import type { CryptoPayAuthState } from "./types";

const authBaseSchema = {
  token: z.string().min(1),
  app: cryptoPayAppSchema,
};

const cryptoPayAuthStateSchema = z.union([
  z.object({
    ...authBaseSchema,
    host: z.literal(CRYPTO_PAY_MAINNET_PROXY_URL),
    network: z.literal("mainnet"),
  }),
  z.object({
    ...authBaseSchema,
    host: z.literal(CRYPTO_PAY_TESTNET_PROXY_URL),
    network: z.literal("testnet"),
  }),
]);

function parseStoredAuth(raw: string | null): CryptoPayAuthState | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = cryptoPayAuthStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function getStoredCryptoPayAuth(): CryptoPayAuthState | null {
  const sessionAuth = parseStoredAuth(
    sessionStorage.getItem(CRYPTO_PAY_AUTH_STORAGE_KEY),
  );

  if (sessionAuth) {
    return sessionAuth;
  }

  sessionStorage.removeItem(CRYPTO_PAY_AUTH_STORAGE_KEY);


  const legacyAuth = parseStoredAuth(
    localStorage.getItem(CRYPTO_PAY_AUTH_STORAGE_KEY),
  );
  localStorage.removeItem(CRYPTO_PAY_AUTH_STORAGE_KEY);

  if (legacyAuth) {
    sessionStorage.setItem(
      CRYPTO_PAY_AUTH_STORAGE_KEY,
      JSON.stringify(legacyAuth),
    );
  }

  return legacyAuth;
}

export function setStoredCryptoPayAuth(auth: CryptoPayAuthState): void {
  sessionStorage.setItem(CRYPTO_PAY_AUTH_STORAGE_KEY, JSON.stringify(auth));
  localStorage.removeItem(CRYPTO_PAY_AUTH_STORAGE_KEY);
}

export function clearStoredCryptoPayAuth(): void {
  sessionStorage.removeItem(CRYPTO_PAY_AUTH_STORAGE_KEY);
  localStorage.removeItem(CRYPTO_PAY_AUTH_STORAGE_KEY);
}
