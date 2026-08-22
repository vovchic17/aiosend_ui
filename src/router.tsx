import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { useCryptoPay } from "./api/crypto-pay";
import { LoadingState } from "./components/ui/LoadingState";
import { useLanguage } from "./i18n";
import { RootLayout } from "./layouts/RootLayout";
import { ChecksPage } from "./pages/ChecksPage";
import { CurrenciesPage } from "./pages/CurrenciesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExchangeRatesPage } from "./pages/ExchangeRatesPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { LoginPage } from "./pages/LoginPage";
import { StatsPage } from "./pages/StatsPage";
import { TransfersPage } from "./pages/TransfersPage";

function AuthLoadingScreen() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState label={t.common.loading} />
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthChecking, isAuthorized } = useCryptoPay();

  if (isAuthChecking) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function GuestRoute() {
  const { isAuthChecking, isAuthorized } = useCryptoPay();

  if (isAuthChecking) {
    return <AuthLoadingScreen />;
  }

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "invoices", element: <InvoicesPage /> },
          { path: "checks", element: <ChecksPage /> },
          { path: "transfers", element: <TransfersPage /> },
          { path: "exchange-rates", element: <ExchangeRatesPage /> },
          { path: "currencies", element: <CurrenciesPage /> },
          { path: "stats", element: <StatsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
