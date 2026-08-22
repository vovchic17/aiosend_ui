import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./styles/globals.css";

import { CryptoPayProvider } from "./api/crypto-pay";
import { LanguageProvider } from "./i18n";
import { router } from "./router";
import { ThemeProvider } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <CryptoPayProvider>
          <RouterProvider router={router} />
        </CryptoPayProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);
