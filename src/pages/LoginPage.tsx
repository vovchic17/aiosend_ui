import { useState, type SubmitEventHandler } from "react";

import { useCryptoPay } from "../api/crypto-pay";
import { useLanguage } from "../i18n";

import { AppFooter } from "../components/layout/AppFooter";
import { LoginCard } from "../features/auth/components/LoginCard";

type LoginError = "tokenRequired" | "authError";

export function LoginPage() {
  const { login } = useCryptoPay();
  const { t } = useLanguage();

  const [token, setToken] = useState("");
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const errorText =
    error === "tokenRequired"
      ? t.auth.tokenRequired
      : error === "authError"
        ? t.auth.error
        : null;

  function handleTokenChange(value: string) {
    setToken(value);

    if (error) {
      setError(null);
    }
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const trimmedToken = token.trim();

    if (!trimmedToken) {
      setError("tokenRequired");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(trimmedToken);
    } catch {
      setError("authError");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <LoginCard
          token={token}
          errorText={errorText}
          isLoading={isLoading}
          onTokenChange={handleTokenChange}
          onSubmit={handleSubmit}
        />
      </main>

      <AppFooter />
    </div>
  );
}
