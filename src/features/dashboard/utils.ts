import type { CryptoPayExchangeRate } from "../../api/crypto-pay";

export function formatBalance(value: string | number | undefined): string {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return String(value ?? 0);
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

export function formatEquivalent(value: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
}

export function getRate(
  source: string,
  target: string,
  rates: CryptoPayExchangeRate[],
): number | null {
  if (source === target) {
    return 1;
  }

  const directRate = rates.find(
    (rate) => rate.is_valid && rate.source === source && rate.target === target,
  );

  if (directRate) {
    const value = Number(directRate.rate);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  const inverseRate = rates.find(
    (rate) => rate.is_valid && rate.source === target && rate.target === source,
  );

  if (inverseRate) {
    const value = Number(inverseRate.rate);

    if (Number.isFinite(value) && value !== 0) {
      return 1 / value;
    }
  }

  return null;
}

export function getFiatValue(
  currencyCode: string,
  amount: string,
  targetCurrency: string,
  exchangeRates: CryptoPayExchangeRate[],
): number {
  const rate = getRate(currencyCode, targetCurrency, exchangeRates);

  if (rate === null) {
    return 0;
  }

  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount) ? numericAmount * rate : 0;
}
