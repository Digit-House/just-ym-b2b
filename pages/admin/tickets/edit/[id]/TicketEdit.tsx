import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductInfo, updateProductInfo } from "@/graphql/product";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TicketEditForm from "@/pages/admin/tickets/_components/TicketEditForm";
import { UpdateProductPayloadT } from "@/types/product.type";
import { useState } from "react";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { TicketFormValues } from "@/types/schema/ticketSchema";

const AdminTicketEdit = () => {
  const [loading, setLoading] = useState(false);
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

  const handleSave = async (formData: UpdateProductPayloadT | TicketFormValues) => {
    try {
      setLoading(true);
      const res = await updateProductInfo(formData);
      console.log(res);
      toast.success("Successfully Updated !");
      navigate("/admin-tickets");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-tickets");
  };

  return (
    <PageContainer>
      <PageHeader title="Edit Ticket" des="Modify the ticket details below." />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <TicketEditForm
          mode="edit"
          initialValues={data as UpdateProductPayloadT}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PageContainer>
  );
};

export default AdminTicketEdit;
