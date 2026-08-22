import type { LANGUAGES } from "./constants";

export type Language = (typeof LANGUAGES)[number];

export type Dictionary = {
  common: {
    dashboard: string;
    logout: string;
    loading: string;
    refresh: string;
    retry: string;
    network: string;
    noData: string;
  };

  navigation: {
    invoices: string;
    checks: string;
    transfers: string;
    exchangeRates: string;
    currencies: string;
    stats: string;
  };

  auth: {
    subtitle: string;
    tokenLabel: string;
    tokenRequired: string;
    error: string;
    networkSupport: string;
    checking: string;
    login: string;
  };

  invoices: {
    description: string;
    create: string;
    delete: string;
    deleteAll: string;
    tabsLabel: string;
    playground: {
      run: string;
      running: string;
      loadingCurrencies: string;
      loadCurrenciesError: string;
      invalidAmount: string;
      assetRequired: string;
      invoiceUrl: string;
      copyCodeLabel: string;
      copiedCodeLabel: string;
      amountInputLabel: string;
      assetInputLabel: string;
      descriptionInputLabel: string;
      hiddenMessageInputLabel: string;
      payloadInputLabel: string;
      allowCommentsInputLabel: string;
      allowAnonymousInputLabel: string;
      expiresInInputLabel: string;
      invalidExpiresIn: string;
      invoiceIdInputLabel: string;
      invalidInvoiceId: string;
      invoiceDeleted: string;
      allInvoicesDeleted: string;
      noInvoicesToDelete: string;
      docs: {
        description: string;
        parameters: string;
        amount: string;
        asset: string;
        descriptionParam: string;
        hiddenMessage: string;
        payload: string;
        allowComments: string;
        allowAnonymous: string;
        expiresIn: string;
        returnType: string;
      };
      deleteDocs: {
        description: string;
        parameters: string;
        invoiceId: string;
        returnType: string;
      };
      deleteAllDocs: {
        description: string;
        wrapper: string;
        usage: string;
        returnType: string;
      };
    };
    list: {
      tableLabel: string;
      statusFilterLabel: string;
      empty: string;
      statuses: {
        all: string;
        active: string;
        paid: string;
        expired: string;
      };
      columns: {
        invoiceId: string;
        amount: string;
        currency: string;
        invoiceUrl: string;
        description: string;
        hiddenMessage: string;
        comment: string;
        createdAt: string;
        status: string;
      };
    };
  };

  checks: {
    description: string;
    create: string;
    delete: string;
    deleteAll: string;
    tabsLabel: string;
    playground: {
      run: string;
      running: string;
      loadingCurrencies: string;
      loadCurrenciesError: string;
      invalidAmount: string;
      assetRequired: string;
      invalidPinToUserId: string;
      checkUrl: string;
      copyCodeLabel: string;
      copiedCodeLabel: string;
      amountInputLabel: string;
      assetInputLabel: string;
      pinToUserIdInputLabel: string;
      pinToUsernameInputLabel: string;
      checkIdInputLabel: string;
      invalidCheckId: string;
      checkDeleted: string;
      allChecksDeleted: string;
      noChecksToDelete: string;
      docs: {
        description: string;
        parameters: string;
        amount: string;
        asset: string;
        pinToUserId: string;
        pinToUsername: string;
        returnType: string;
      };
      deleteDocs: {
        description: string;
        parameters: string;
        checkId: string;
        returnType: string;
      };
      deleteAllDocs: {
        description: string;
        wrapper: string;
        usage: string;
        returnType: string;
      };
    };
    list: {
      tableLabel: string;
      statusFilterLabel: string;
      empty: string;
      statuses: {
        all: string;
        active: string;
        activated: string;
      };
      columns: {
        checkId: string;
        amount: string;
        asset: string;
        checkUrl: string;
        pinToUserId: string;
        pinToUsername: string;
        createdAt: string;
        status: string;
      };
    };
  };

  transfers: {
    description: string;
    playground: {
      run: string;
      running: string;
      loadingCurrencies: string;
      loadCurrenciesError: string;
      invalidUserId: string;
      invalidAmount: string;
      assetRequired: string;
      commentTooLong: string;
      transferId: string;
      copyCodeLabel: string;
      copiedCodeLabel: string;
      userIdInputLabel: string;
      amountInputLabel: string;
      assetInputLabel: string;
      commentInputLabel: string;
      disableSendNotificationInputLabel: string;
      docs: {
        description: string;
        parameters: string;
        userId: string;
        asset: string;
        amount: string;
        comment: string;
        disableSendNotification: string;
        returnType: string;
      };
    };
    list: {
      tableLabel: string;
      empty: string;
      columns: {
        transferId: string;
        userId: string;
        amount: string;
        asset: string;
        completedAt: string;
        comment: string;
      };
    };
  };

  exchangeRates: {
    description: string;
    playground: {
      run: string;
      running: string;
      loadingCurrencies: string;
      loadCurrenciesError: string;
      invalidAmount: string;
      currencyRequired: string;
      copyCodeLabel: string;
      copiedCodeLabel: string;
      amountInputLabel: string;
      sourceInputLabel: string;
      targetInputLabel: string;
      docs: {
        description: string;
        wrapper: string;
        parameters: string;
        amount: string;
        source: string;
        target: string;
        returnType: string;
      };
    };
    list: {
      tableLabel: string;
      empty: string;
      columns: {
        source: string;
        target: string;
        rate: string;
        crypto: string;
        fiat: string;
        valid: string;
      };
    };
  };

  currencies: {
    description: string;
    list: {
      tableLabel: string;
      empty: string;
      columns: {
        name: string;
        code: string;
        fiat: string;
        blockchain: string;
        stablecoin: string;
        decimals: string;
      };
    };
  };

  stats: {
    description: string;
    volume: string;
    conversion: string;
    uniqueUsersCount: string;
    createdInvoiceCount: string;
    paidInvoiceCount: string;
    network: string;
    startAt: string;
    endAt: string;
  };

  dashboard: {
    description: string;
    paymentProcessingBot: string;
    balances: string;
    balancesEmpty: string;
    onHold: string;
    security: string;
    securityBeforeBot: string;
    securityAfterBot: string;
    checks: string;
    transfers: string;
    loadError: string;
    suspendedTitle: string;
    suspendedDescription: string;
    networkUsing: string;
    testnetDescription: string;
    mainnetDescription: string;
  };

  accessibility: {
    switchToEnglish: string;
    switchToRussian: string;
    switchToLightTheme: string;
    switchToDarkTheme: string;
    currencySelect: string;
  };
};
