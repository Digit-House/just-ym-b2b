import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import {
  convertCurrency,
  formatCurrency,
  getOppositeCurrency,
} from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

interface CurrencyConverterProps {
  amount: number;
  title?: string;
}

const CurrencyConverter = ({
  amount,
  title = "Currency Conversion",
}: CurrencyConverterProps) => {
  const { data: currencyRate, isLoading, isError } = useCurrencyRate(false); // Disable auto-refresh for this component

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-4">Loading exchange rate...</div>
        </div>
      </div>
    );
  }

  if (isError || !currencyRate) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-4 text-red-500">
            Unable to load exchange rate
          </div>
        </div>
      </div>
    );
  }

  // Fixed: THB on the left (unchanged), calculate MMK on the right
  const convertedAmount = convertCurrency(
    amount,
    "THB",
    "MMK",
    Number(currencyRate.mmk) // Ensure mmk is treated as a number
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex-1 w-full">
            <div className="text-sm text-blue-700 font-medium flex items-center gap-2">
              <span className="text-xl" aria-label="Thailand flag">
                🇹🇭
              </span>
              Original Amount
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {amount?.toLocaleString("en-US")} THB
            </div>
            <div className="text-xs text-blue-600 mt-1">Thai Baht (THB)</div>
          </div>

          <div className="flex flex-col items-center justify-center my-auto">
            <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <ArrowLeftRight size={16} className="text-indigo-600" />
            </div>
            <span className="text-xs text-gray-500 mt-1 hidden md:block">
              Exchange
            </span>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex-1 w-full">
            <div className="text-sm text-green-700 font-medium flex items-center gap-2">
              <span className="text-xl" aria-label="Myanmar flag">
                🇲🇲
              </span>
              Converted Amount
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(convertedAmount, "MMK", "en-US")}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Myanmar Kyat (MMK)
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <span className="font-medium">Exchange Rate:</span> 100,000 MMK ={" "}
          {currencyRate.mmk} THB
          <br />
          <span className="text-xs text-gray-500">
            Last updated: {new Date(currencyRate.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
