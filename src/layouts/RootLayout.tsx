import { Outlet } from "react-router-dom";

import { AppFooter } from "../components/layout/AppFooter";
import { AppHeader } from "../components/layout/AppHeader";
import { AppSuspendedBanner } from "../features/app-status/components/AppSuspendedBanner";
import { useAppAvailability } from "../features/app-status/hooks/useAppAvailability";

export function RootLayout() {
  const availability = useAppAvailability();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:gap-8 lg:px-10 lg:py-8 xl:px-20">
        {availability.isSuspended && <AppSuspendedBanner />}
        <Outlet
          context={{
            checksAvailability: availability.checksAvailability,
            transfersAvailability: availability.transfersAvailability,
          }}
        />
      </main>
      <AppFooter />
    </div>
  );
}
