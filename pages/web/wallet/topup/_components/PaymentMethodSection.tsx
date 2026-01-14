import { Controller } from "react-hook-form";
import { PaymentMethodRow } from "./PaymentMethodRow";
import { PaymentMethodT } from "@/types/paymentMethod.type";

type Props = {
  control: any;
  paymentMethods: PaymentMethodT[];
  onPaymentMethodSelect: (method: PaymentMethodT) => void;
  selectedMethod: PaymentMethodT | null;
};

export const PaymentMethodSection = ({ 
  control, 
  paymentMethods, 
  onPaymentMethodSelect,
  selectedMethod 
}: Props) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-black mb-6">Payment Method</h3>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                selected={selectedMethod?.id === method.id}
                onSelect={() => {
                  field.onChange(method.type);
                  onPaymentMethodSelect(method);
                }}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
};
