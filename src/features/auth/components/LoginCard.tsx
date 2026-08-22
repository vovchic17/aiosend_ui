import type { PropsWithChildren, SubmitEventHandler } from "react";

import { LanguageToggle } from "../../../components/layout/LanguageToggle";
import { ThemeToggle } from "../../../components/layout/ThemeToggle";
import { Button } from "../../../components/ui/Button";
import { ErrorAlert } from "../../../components/ui/ErrorAlert";
import { Input } from "../../../components/ui/Input";
import { useLanguage } from "../../../i18n";
import { useTheme } from "../../../theme";

import logoDark from "../../../assets/logo_login_dark.svg";
import logoLight from "../../../assets/logo_login_light.svg";

type LoginCardProps = PropsWithChildren<{
  className?: string;
  token: string;
  errorText?: string | null;
  isLoading?: boolean;
  onTokenChange: (value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}>;

export function LoginCard({
  children,
  className = "",
  token,
  errorText,
  isLoading = false,
  onTokenChange,
  onSubmit,
}: LoginCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";

  return (
    <div
      className={`
        w-full max-w-[732px] px-4 py-6 sm:px-10 sm:py-8 lg:px-20
        flex flex-col items-center gap-6 sm:gap-8
        rounded-[28px] sm:rounded-[40px] lg:rounded-[54px]
        bg-header-surface shadow-panel backdrop-glass
        ${className}
      `}
    >
      <div className="w-full max-w-[572px]">
        <img
          src={logoLight}
          alt="aiosend UI"
          className={`${isDark ? "hidden" : "block"} h-auto w-full`}
          draggable={false}
        />
        <img
          src={logoDark}
          alt=""
          aria-hidden="true"
          className={`${isDark ? "block" : "hidden"} h-auto w-full`}
          draggable={false}
        />
      </div>

      <p className="text-center text-body text-content">{t.auth.subtitle}</p>

      <form
        className="flex w-full flex-col items-center gap-6 sm:gap-8"
        onSubmit={onSubmit}
      >
        <label className="flex w-full flex-col gap-2">
          <span className="text-body text-content">{t.auth.tokenLabel}</span>
          <Input
            type="password"
            autoComplete="off"
            placeholder="12345:AA..."
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
          />
        </label>

        <p className="text-center text-body text-content-muted">
          {t.auth.networkSupport}
        </p>

        {errorText && <ErrorAlert>{errorText}</ErrorAlert>}

        <Button
          type="submit"
          disabled={isLoading || !token.trim()}
          className="w-full"
        >
          {isLoading ? t.auth.checking : t.auth.login}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-6">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {children}
    </div>
  );
}
