import { Link, NavLink, useLocation } from "react-router-dom";

import { useCryptoPay } from "../../api/crypto-pay";
import { useLanguage } from "../../i18n";
import { useTheme } from "../../theme";
import { Button } from "../ui/Button";
import { AppProfile } from "./AppProfile";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

import logoDark from "../../assets/logo_dark.svg";
import logoLight from "../../assets/logo_light.svg";

const navigation = [
  { key: "invoices", to: "/invoices" },
  { key: "checks", to: "/checks" },
  { key: "transfers", to: "/transfers" },
  { key: "exchangeRates", to: "/exchange-rates" },
  { key: "currencies", to: "/currencies" },
  { key: "stats", to: "/stats" },
] as const;

export function AppHeader() {
  const { auth, logout } = useCryptoPay();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();

  const isDark = theme === "dark";
  const isDashboard = location.pathname === "/";

  return (
    <header className="flex w-full flex-col gap-4 bg-header-surface px-4 py-4 backdrop-glass sm:px-6 lg:grid lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-0 lg:px-10 lg:py-0 xl:px-20">
      <div className="flex w-full items-center justify-between gap-2 lg:contents">
        <Link
          to="/"
          className="w-[120px] shrink-0 sm:w-48 lg:col-start-1 lg:row-start-1 lg:w-62 lg:justify-self-start"
          aria-label={t.common.dashboard}
        >
          <img src={logoLight} alt="aiosend UI" className={isDark ? "hidden" : "block"} draggable={false} />
          <img src={logoDark} alt="" aria-hidden="true" className={isDark ? "block" : "hidden"} draggable={false} />
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-3 lg:col-start-3 lg:row-start-1 lg:gap-10 lg:justify-self-end">
          {isDashboard ? (
            <Button type="button" onClick={logout} className="px-3 py-2 text-small sm:px-6 sm:py-3">
              {t.common.logout}
            </Button>
          ) : (
            auth && (
              <div className="hidden md:block">
                <AppProfile name={auth.app.name} appId={auth.app.app_id} network={auth.network} />
              </div>
            )
          )}

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-6">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="scrollbar-none -mx-4 flex w-[calc(100%+2rem)] items-center gap-5 overflow-x-auto px-4 pb-1 whitespace-nowrap sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:w-auto lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `shrink-0 text-content transition-opacity hover:opacity-80 ${isActive ? "text-body-accent" : "text-body"}`
            }
          >
            {t.navigation[item.key]}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
