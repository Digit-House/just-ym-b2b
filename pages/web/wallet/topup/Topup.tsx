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
import React from "react";
import { uploadMultipleImages } from "@/util";

const TopUp = () => {
  const navigate = useNavigate();
  const { user, setFetchWallet } = useUser();
  const [loading, setLoading] = React.useState(false);
  const { creditInfo } = useWalletStore();

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
      paymentMethod: "card",
    },
  });

  const amount = watch("amount");
  const paymentMethod = watch("paymentMethod");
  const proofFiles = watch("proofFiles") || [];

  const onSubmit = async (data: TopUpFormValues) => {
    try {
      setLoading(true);

      let relatedImages: string[] = [];

      // 🔹 Upload images only for bank transfer
      if (data.paymentMethod === "bank" && data.proofFiles?.length) {
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

        <AmountSelector
          value={amount}
          onChange={(v) => setValue("amount", v)}
        />

        <PaymentMethodSection control={control} />

        {paymentMethod === "bank" && (
          <BankTransferSection
            control={control}
            files={proofFiles}
            onRemoveFile={(index) => {
              const updated = [...proofFiles];
              updated.splice(index, 1);
              setValue("proofFiles", updated);
            }}
          />
        )}

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
            disabled={paymentMethod === "bank" && proofFiles.length === 0}
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

export default TopUp;
