import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { convertCurrency, formatCurrency } from "@/lib/utils";
import { PaymentMethodT } from "@/types/paymentMethod.type";
import { ArrowLeftRight } from "lucide-react";

interface TotalAmountDisplayProps {
  amount: number;
  selectedPaymentMethod: PaymentMethodT | null;
  title?: string;
}

const TotalAmountDisplay = ({ 
  amount, 
  selectedPaymentMethod,
  title = "Total Amount"
}: TotalAmountDisplayProps) => {
  const { data: currencyRate, isLoading, isError } = useCurrencyRate(false);

  if (!selectedPaymentMethod) {
    return null;
  }

  // If payment method is THB, no conversion needed
  if (selectedPaymentMethod.currency === "THB") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">No conversion needed</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">
              {formatCurrency(amount, "THB")}
            </p>
            <p className="text-sm text-gray-500">Thai Baht</p>
          </div>
        </div>
      </div>
    );
  }

  // If payment method is MMK, convert from THB to MMK
  if (selectedPaymentMethod.currency === "MMK") {
    if (isLoading) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center py-4">Calculating total amount...</div>
        </div>
      );
    }

    if (isError || !currencyRate) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center py-4 text-red-500">Unable to calculate total amount</div>
        </div>
      );
    }

    const totalAmountMMK = convertCurrency(
      amount,
      "THB",
      "MMK",
      Number(currencyRate.mmk)
    );

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          
          <div className="flex items-center gap-5 w-full justify-between">
            <div className="flex w-full justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-label="Thailand flag">🇹🇭</span>
                <div>
                  <p className="font-medium text-blue-700">Base Amount</p>
                  <p className="text-sm text-blue-600">Thai Baht</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(amount, "THB")}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                {/* <span className="text-indigo-600 font-bold">×</span> */}
                <ArrowLeftRight size={16} className="text-indigo-600" />
              </div>
            </div>

            <div className="flex justify-between w-full items-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-label="Myanmar flag">🇲🇲</span>
                <div>
                  <p className="font-medium text-green-700">Total Amount</p>
                  <p className="text-sm text-green-600">Myanmar Kyat</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency(totalAmountMMK, "MMK")}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Exchange Rate:</span>
              <span>1 THB = {currencyRate.mmk} MMK</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Last Updated:</span>
              <span>{new Date(currencyRate.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TotalAmountDisplay;