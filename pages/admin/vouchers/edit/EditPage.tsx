import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { getVoucherDetail } from "@/graphql/voucher";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VoucherForm from "../create/_components/VoucherForm";
import BackBtn from "@/components/BackBtn";

const EditVouchers = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getVoucherDetail(id!),
    enabled: !!id,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  //ee

  if (isLoading) {
    return <div>Loading vouchers...</div>;
  }

  if (isError || !data) {
    return <div>Error loading voucher</div>;
  }
  return (
    <PageContainer>
      <BackBtn route="/vouchers" title="Back to Vouchers" />
      <PageHeader
        title="Edit Voucher"
        des="Create and manage discount vouchers for your customers"
      />
      <div>
        <VoucherForm data={data} />
      </div>
    </PageContainer>
  );
};

export default EditVouchers;
