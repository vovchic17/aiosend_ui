import { useEffect, useMemo, useState } from "react";

import {
  useCryptoPayApi,
  type CryptoPayBalance,
  type CryptoPayCurrency,
  type CryptoPayExchangeRate,
} from "../../../api/crypto-pay";
import { getFiatValue } from "../utils";

export function useDashboardData() {
  const api = useCryptoPayApi();

  const [balances, setBalances] = useState<CryptoPayBalance[]>([]);
  const [exchangeRates, setExchangeRates] = useState<CryptoPayExchangeRate[]>([]);
  const [currencies, setCurrencies] = useState<CryptoPayCurrency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      setIsLoading(true);
      setHasError(false);

      const [
        balancesResult,
        exchangeRatesResult,
        currenciesResult,
      ] = await Promise.allSettled([
        api.getBalance(),
        api.getExchangeRates(),
        api.getCurrencies(),
      ]);

      if (cancelled) {
        return;
      }

      const coreResults = [
        balancesResult,
        exchangeRatesResult,
        currenciesResult,
      ];
      setHasError(coreResults.some((result) => result.status === "rejected"));

      if (balancesResult.status === "fulfilled") {
        setBalances(balancesResult.value);
      }

      if (exchangeRatesResult.status === "fulfilled") {
        const rates = exchangeRatesResult.value;
        setExchangeRates(rates);

        const targets = [
          ...new Set(
            rates.filter((rate) => rate.is_valid).map((rate) => rate.target),
          ),
        ];

        setSelectedCurrency((current) => {
          if (targets.includes(current)) {
            return current;
          }

          if (targets.includes("USD")) {
            return "USD";
          }

          return targets[0] ?? "USD";
        });
      }

      if (currenciesResult.status === "fulfilled") {
        setCurrencies(currenciesResult.value);
      }


      setHasLoaded(true);
      setIsLoading(false);
    }

    void loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [api, refreshKey]);

  const currencyOptions = useMemo(() => {
    const codes = [
      ...new Set(
        exchangeRates
          .filter((rate) => rate.is_valid)
          .map((rate) => rate.target),
      ),
    ];

    return codes
      .sort((a, b) => {
        if (a === "USD") {
          return -1;
        }
        if (b === "USD") {
          return 1;
        }
        return a.localeCompare(b);
      })
      .map((code) => ({ value: code, label: code }));
  }, [exchangeRates]);

  const currencyNames = useMemo(() => {
    return new Map(
      currencies.map((currency) => [
        currency.code,
        currency.name ?? currency.code,
      ]),
    );
  }, [currencies]);

  const sortedBalances = useMemo(() => {
    return [...balances].sort((firstBalance, secondBalance) => {
      const firstValue = getFiatValue(
        firstBalance.currency_code,
        firstBalance.available,
        "USD",
        exchangeRates,
      );
      const secondValue = getFiatValue(
        secondBalance.currency_code,
        secondBalance.available,
        "USD",
        exchangeRates,
      );

      return secondValue - firstValue;
    });
  }, [balances, exchangeRates]);

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  return {
    balances: sortedBalances,
    exchangeRates,
    currencyNames,
    currencyOptions,
    selectedCurrency,
    setSelectedCurrency,
    isLoading,
    hasLoaded,
    hasError,
    refresh,
  };
}
