import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import React from "react";
import VoucherForm from "./_components/VoucherForm";

const CreateVoucher = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Create Voucher"
        des="Create and manage discount vouchers for your customers"
      />
      <div>
        <VoucherForm data={null} />
      </div>
    </PageContainer>
  );
};

export default CreateVoucher;
