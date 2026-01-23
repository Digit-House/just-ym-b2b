import { useNavigate } from "react-router-dom";
import { useWalletStore } from "@/store/useWalletStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import BackBtn from "@/components/BackBtn";
import { TopUpFormValues, topUpSchema } from "@/types/schema/topupSchema";
import { BalancePreview } from "./_components/BalancePreview";
import { AmountSelector } from "./_components/AmountSelector";
import { BankTransferSection } from "./_components/BankTransferSeciton";
import { PaymentMethodSection } from "./_components/PaymentMethodSection";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { addTopup } from "@/graphql/wallet";
import { useUser } from "@/provider/UserProvider";
import React, { useEffect, useState } from "react";
import { uploadMultipleImages } from "@/util";
import { getPaymentMethods } from "@/graphql/paymentMethod";
import { PaymentMethodT } from "@/types/paymentMethod.type";
import { QRCodeSection } from "./_components/QRCodeSection";
import CurrencyConverter from "@/components/CurrencyConverter";
import TotalAmountDisplay from "@/components/TotalAmountDisplay";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";

const Topup = () => {
  const navigate = useNavigate();
  const { user, setFetchWallet } = useUser();
  const [loading, setLoading] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodT[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodT | null>(null);
  const { creditInfo } = useWalletStore();
   const { data: currencyRate} = useCurrencyRate(false); 


  const {
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TopUpFormValues>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      amount: 1000,
      paymentMethod: "BANK_TRANSFER",
    },
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      // Fetch both BANK_TRANSFER and QR_CODE payment methods
      const [bankRes, qrRes]: any = await Promise.all([
        getPaymentMethods(true, "BANK_TRANSFER"),
        getPaymentMethods(true, "QR_CODE"),
      ]);

      const bankMethods = bankRes?.data?.paymentMethods || [];
      const qrMethods = qrRes?.data?.paymentMethods || [];
      setPaymentMethods((prev) => {
        const map = new Map();

        [...bankMethods, ...qrMethods].forEach((item) => {
          map.set(item.id, item);
        });

        return Array.from(map.values());
      });
    } catch (err) {
      console.error(err);
    }
  };

  const amount = watch("amount");
  const paymentMethod = watch("paymentMethod");
  const proofFiles = watch("proofFiles") || [];

  const onSubmit = async (data: TopUpFormValues) => {
    try {
      setLoading(true);

      let relatedImages: string[] = [];

      if (data.proofFiles?.length) {
        relatedImages = await uploadMultipleImages(
          data.proofFiles,
          "CREDIT_TOP_UP"
        );
      }

      await addTopup({
        currency: "THB",
        resellerId: user?.id,
        topUpBalance: data.amount,
        relatedImages,
        currencyRateId:currencyRate.id,
        paymentMethodId: selectedPaymentMethod.id,
      });

      toast.success("Top up request submitted successfully");
      setFetchWallet((prev) => !prev);
      navigate("/wallet");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackBtn route="/wallet" title="Back to Wallet" />

      <PageHeader title="Top Up Credits" des="Add credits to your wallet" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BalancePreview balance={creditInfo?.balance} selectedAmount={amount} />
        <CurrencyConverter
          amount={amount}
          title="Amount Conversion"
        />
        <AmountSelector
          value={amount}
          onChange={(v) => setValue("amount", v)}
        />

        <PaymentMethodSection
          control={control}
          paymentMethods={paymentMethods}
          onPaymentMethodSelect={(method) => {
            setSelectedPaymentMethod({ ...method});
            setValue("paymentMethodId", method.id);
          }}
          selectedMethod={selectedPaymentMethod}
        />

        {/* Show bank transfer section with dynamic details */}
        {paymentMethod === "BANK_TRANSFER" && selectedPaymentMethod && (
          <BankTransferSection
            control={control}
            files={proofFiles}
            bankName={selectedPaymentMethod.bankName}
            accountName={selectedPaymentMethod.accountName}
            accountNumber={selectedPaymentMethod.accountNumber}
            instructions={selectedPaymentMethod.instructions}
            description={selectedPaymentMethod.description}
            onRemoveFile={(index) => {
              const updated = [...proofFiles];
              updated.splice(index, 1);
              setValue("proofFiles", updated);
            }}
          />
        )}

        {paymentMethod === "QR_CODE" && selectedPaymentMethod && (
          <QRCodeSection
            qrCodeUrl={selectedPaymentMethod.qrCodeUrl}
            bankName={selectedPaymentMethod.bankName}
            accountName={selectedPaymentMethod.accountName}
            control={control}
            files={proofFiles}
            onRemoveFile={(index) => {
              const updated = [...proofFiles];
              updated.splice(index, 1);
              setValue("proofFiles", updated);
            }}
          />
        )}

        <TotalAmountDisplay
          amount={amount}
          selectedPaymentMethod={selectedPaymentMethod}
          title="Total Payment Amount"
        />

        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate("/wallet")}
            className="flex-1 bg-white border text-sm py-4 rounded-2xl font-black"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={proofFiles.length === 0}
            className="flex-[1.5] bg-indigo-600 text-white text-sm py-4 rounded-2xl font-black disabled:opacity-50"
          >
            {isSubmitting || loading
              ? "Processing..."
              : `Complete Top Up - THB ${amount.toLocaleString()}`}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default Topup;
