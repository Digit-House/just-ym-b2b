import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_CURRENCY = 100_000;

export const formatCurrency = (
  amount: number,
  currency: "THB" | "MMK",
  format: "en-MM" | "en-US"
): string => {
  return (
    new Intl.NumberFormat(format, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ` ${currency}`
  );
};

export const currencyFormat = (
  amount: number,
  currency: "THB" | "MMK",
  format: "en-MM" | "en-US"
) => {
  return amount.toLocaleString(format) + " " + currency;
};

/**
 * Converts an amount from one currency to another based on the exchange rate
 * @param amount The amount to convert
 * @param fromCurrency The source currency
 * @param toCurrency The target currency
 * @param exchangeRate The exchange rate (how many THB you get for BASE_CURRENCY MMK)
 * @returns The converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: "THB" | "MMK",
  toCurrency: "THB" | "MMK",
  exchangeRate?: number
): number => {
  // If currencies are the same, return the original amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // If converting from MMK to THB, use the formula: amount * (exchangeRate / BASE_CURRENCY)
  if (fromCurrency === "MMK" && toCurrency === "THB" && exchangeRate) {
    return amount * (Number(exchangeRate) / BASE_CURRENCY);
  }

  // If converting from THB to MMK, use the formula: amount * (BASE_CURRENCY / exchangeRate)
  if (fromCurrency === "THB" && toCurrency === "MMK" && exchangeRate) {
    return amount * (BASE_CURRENCY / Number(exchangeRate));
  }

  // If exchange rate is not available or currencies are unsupported, return original amount
  return amount;
};

/**
 * Formats currency amount with proper decimal places and thousand separators
 * @param amount The amount to format
 * @param currency The currency code
 * @returns Formatted currency string
 */

/**
 * Gets the opposite currency
 * @param currency The current currency
 * @returns The opposite currency
 */
export const getOppositeCurrency = (currency: "THB" | "MMK"): "THB" | "MMK" => {
  return currency === "THB" ? "MMK" : "THB";
};

/**
 * Truncates a description to a specified length
 * @param text The text to truncate
 * @param maxLength The maximum length of the text (default: 100)
 * @returns The truncated text with "..." if it was shortened
 */
export const truncateDescription = (
  text: string | null | undefined,
  maxLength: number = 100
): string => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
};
