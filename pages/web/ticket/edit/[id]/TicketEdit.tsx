import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductInfo } from "@/graphql/product";
import { ProductInfoT } from "@/types/product.type";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TicketEditForm from "@/pages/admin/tickets/_components/TicketEditForm";

const TicketEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getProductInfo(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading ticket...</div>;
  }

  if (isError || !data) {
    return <div>Error loading ticket</div>;
  }

  const handleSave = async (formData: any) => {
    // TODO: Implement save functionality
    navigate("/user-tickets"); // Navigate back to tickets list
  };

  const handleCancel = () => {
    navigate("/user-tickets"); // Navigate back to tickets list
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Ticket" 
        des="Modify the ticket details below." 
      />
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <TicketEditForm
          mode="edit"
          initialValues={data}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PageContainer>
  );
};

export default TicketEdit;