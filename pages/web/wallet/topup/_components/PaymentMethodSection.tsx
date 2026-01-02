import { Controller } from "react-hook-form";
import { PaymentMethodRow } from "./PaymentMethodRow";

type Props = {
  control: any;
};

export const PaymentMethodSection = ({ control }: Props) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-black mb-6">Payment Method</h3>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PaymentMethodRow
              value="card"
              selected={field.value}
              onChange={field.onChange}
            />
            <PaymentMethodRow
              value="bank"
              selected={field.value}
              onChange={field.onChange}
            />
          </div>
        )}
      />
    </div>
  );
};
