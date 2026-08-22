import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredCryptoPayAuth,
  getStoredCryptoPayAuth,
  setStoredCryptoPayAuth,
} from "./auth-storage";
import { authorizeCryptoPayToken, CryptoPayClient } from "./client";
import {
  CryptoPayMissingAuthError,
  isCryptoPayUnauthorizedError,
} from "./errors";
import type { CryptoPayAuthState } from "./types";

type AuthStatus = "checking" | "authorized" | "guest";

type CryptoPayContextValue = {
  auth: CryptoPayAuthState | null;
  api: CryptoPayClient | null;
  authStatus: AuthStatus;
  isAuthChecking: boolean;
  isAuthorized: boolean;
  login: (token: string) => Promise<CryptoPayAuthState>;
  logout: () => void;
};

const CryptoPayContext = createContext<CryptoPayContextValue | null>(null);

type Props = {
  children: ReactNode;
};

type AuthState = {
  auth: CryptoPayAuthState | null;
  status: AuthStatus;
};

export function CryptoPayProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>(() => {
    const storedAuth = getStoredCryptoPayAuth();

    return {
      auth: storedAuth,
      status: storedAuth ? "checking" : "guest",
    };
  });

  const logout = useCallback(() => {
    clearStoredCryptoPayAuth();
    setState({ auth: null, status: "guest" });
  }, []);

  useEffect(() => {
    if (state.status !== "checking" || !state.auth) {
      return;
    }

    let cancelled = false;
    const storedAuth = state.auth;
    const client = new CryptoPayClient(storedAuth);

    async function verifyStoredAuth() {
      try {
        const app = await client.getMe();

        if (cancelled) {
          return;
        }

        const verifiedAuth = { ...storedAuth, app };
        setStoredCryptoPayAuth(verifiedAuth);
        setState({ auth: verifiedAuth, status: "authorized" });
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (isCryptoPayUnauthorizedError(error)) {
          clearStoredCryptoPayAuth();
          setState({ auth: null, status: "guest" });
          return;
        }


        setState({ auth: storedAuth, status: "authorized" });
      }
    }

    void verifyStoredAuth();

    return () => {
      cancelled = true;
    };
  }, [state.auth, state.status]);

  const api = useMemo(() => {
    if (!state.auth || state.status !== "authorized") {
      return null;
    }

    return new CryptoPayClient(state.auth, {
      onUnauthorized: logout,
    });
  }, [logout, state.auth, state.status]);

  const login = useCallback(async (token: string) => {
    const nextAuth = await authorizeCryptoPayToken(token);

    setStoredCryptoPayAuth(nextAuth);
    setState({ auth: nextAuth, status: "authorized" });

    return nextAuth;
  }, []);

  const value = useMemo<CryptoPayContextValue>(() => {
    return {
      auth: state.auth,
      api,
      authStatus: state.status,
      isAuthChecking: state.status === "checking",
      isAuthorized: state.status === "authorized" && Boolean(state.auth),
      login,
      logout,
    };
  }, [api, login, logout, state.auth, state.status]);

  return (
    <CryptoPayContext.Provider value={value}>
      {children}
    </CryptoPayContext.Provider>
  );
}

export function useCryptoPay(): CryptoPayContextValue {
  const context = useContext(CryptoPayContext);

  if (!context) {
    throw new Error("useCryptoPay must be used inside CryptoPayProvider.");
  }

  return context;
}

export function useCryptoPayApi(): CryptoPayClient {
  const { api } = useCryptoPay();

  if (!api) {
    throw new CryptoPayMissingAuthError();
  }

  return api;
}
