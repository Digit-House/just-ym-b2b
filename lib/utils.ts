import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CurrencyRateT } from "@/types/currencyRate.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an amount from one currency to another based on the exchange rate
 * @param amount The amount to convert
 * @param fromCurrency The source currency
 * @param toCurrency The target currency
 * @param exchangeRate The exchange rate (how many MMK per 1 THB)
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

  // If converting from MMK to THB, divide by the exchange rate
  if (fromCurrency === "MMK" && toCurrency === "THB" && exchangeRate) {
    return amount / exchangeRate;
  }

  // If converting from THB to MMK, multiply by the exchange rate
  if (fromCurrency === "THB" && toCurrency === "MMK" && exchangeRate) {
    return amount * exchangeRate;
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
export const formatCurrency = (amount: number, currency: "THB" | "MMK"): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
};

/**
 * Gets the opposite currency
 * @param currency The current currency
 * @returns The opposite currency
 */
export const getOppositeCurrency = (currency: "THB" | "MMK"): "THB" | "MMK" => {
  return currency === "THB" ? "MMK" : "THB";
};