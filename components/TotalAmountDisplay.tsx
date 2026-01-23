import { ArrowLeftRight } from "lucide-react";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { BASE_CURRENCY, convertCurrency, formatCurrency } from "@/lib/utils";
import { PaymentMethodT } from "@/types/paymentMethod.type";

interface TotalAmountDisplayProps {
  amount: number;
  selectedPaymentMethod: PaymentMethodT | null;
  title?: string;
}

const WrapperCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

const CurrencyCard = ({
  flag,
  title,
  subtitle,
  amount,
  color,
}: {
  flag: string;
  title: string;
  subtitle: string;
  amount: string;
  color: "blue" | "green";
}) => {
  const styles = {
    blue: {
      bg: "bg-blue-50 border-blue-100",
      title: "text-blue-700",
      subtitle: "text-blue-600",
      amount: "text-blue-900",
    },
    green: {
      bg: "bg-green-50 border-green-100",
      title: "text-green-700",
      subtitle: "text-green-600",
      amount: "text-green-900",
    },
  }[color];

  return (
    <div className={`flex w-full justify-between items-center p-4 rounded-lg border ${styles.bg}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{flag}</span>
        <div>
          <p className={`font-medium ${styles.title}`}>{title}</p>
          <p className={`text-sm ${styles.subtitle}`}>{subtitle}</p>
        </div>
      </div>
      <p className={`text-xl font-bold ${styles.amount}`}>{amount}</p>
    </div>
  );
};

const TotalAmountDisplay = ({
  amount,
  selectedPaymentMethod,
  title = "Total Amount",
}: TotalAmountDisplayProps) => {
  const { data: currencyRate, isLoading, isError } = useCurrencyRate(false);

  if (!selectedPaymentMethod) return null;

  const isTHB = selectedPaymentMethod.currency === "THB";
  const isMMK = selectedPaymentMethod.currency === "MMK";


  if (isTHB) {
    return (
      <WrapperCard title={title}>
        <CurrencyCard
          flag="🇹🇭"
          title="Base Amount"
          subtitle="Thai Baht"
          amount={formatCurrency(amount, "THB")}
          color="blue"
        />
      </WrapperCard>
    );
  }

  if (isMMK) {
    if (isLoading) {
      return (
        <WrapperCard title={title}>
          <div className="text-center py-4">Calculating total amount...</div>
        </WrapperCard>
      );
    }

    if (isError || !currencyRate) {
      return (
        <WrapperCard title={title}>
          <div className="text-center py-4 text-red-500">
            Unable to calculate total amount
          </div>
        </WrapperCard>
      );
    }

    const totalAmountMMK = convertCurrency(
      amount,
      "THB",
      "MMK",
      Number(currencyRate.mmk)
    );

    return (
      <WrapperCard title={title}>
        <div className="flex items-center gap-5 w-full justify-between">
          <CurrencyCard
            flag="🇹🇭"
            title="Base Amount"
            subtitle="Thai Baht"
            amount={formatCurrency(amount, "THB")}
            color="blue"
          />

          <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <ArrowLeftRight size={16} className="text-indigo-600" />
          </div>

          <CurrencyCard
            flag="🇲🇲"
            title="Total Amount"
            subtitle="Myanmar Kyat"
            amount={formatCurrency(totalAmountMMK, "MMK")}
            color="green"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span>
              {BASE_CURRENCY.toLocaleString("en-US")} MMK = {currencyRate.mmk} THB
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Last Updated:</span>
            <span>{new Date(currencyRate.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </WrapperCard>
    );
  }

  return null;
};

export default TotalAmountDisplay;
