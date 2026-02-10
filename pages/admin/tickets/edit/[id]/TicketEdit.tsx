import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getProductInfo,
  seedProduct,
  updateProductInfo,
} from "@/graphql/product";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TicketEditForm from "@/pages/admin/tickets/_components/TicketEditForm";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import { useState } from "react";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { Button } from "@/components/ui/button";
import BackBtn from "@/components/BackBtn";
import RelatedTicketsCarousel from "@/pages/web/ticket/_components/RelatedTicketsCarousel";
import { set } from "zod";

const AdminTicketEdit = () => {
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitLoading,setSubmitLoading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getProductInfo(id!, true),
    enabled: !!id,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Ticket</h3>
            <p className="text-gray-600 mb-4">We couldn't load the ticket details. Please try again later.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (
    formData: UpdateProductPayloadT
  ) => {
    try {
      if(submitLoading) return;
      setSubmitLoading(true);
      let updatedFormData = { ...(formData as UpdateProductPayloadT) };

      if (updatedFormData.media && Array.isArray(updatedFormData.media)) {
        const processedMedia = [];

        for (const mediaItem of updatedFormData.media) {
          // If mediaItem.path starts with 'blob:' or 'data:', it means it hasn't been uploaded yet
          if (
            mediaItem.path &&
            (mediaItem.path.startsWith("blob:") ||
              mediaItem.path.startsWith("data:"))
          ) {
            // This means it's a local file that needs to be uploaded
            // Since we don't have direct access to the file object here,
            // we'll need to handle this differently.
            // In a real scenario, we'd pass the actual files from the form
            processedMedia.push(mediaItem); // For now, just add the original
          } else {
            // Already a processed URL, add as is
            processedMedia.push(mediaItem);
          }
        }

        updatedFormData = {
          ...updatedFormData,
          media: processedMedia,
        };
      }

      await updateProductInfo(updatedFormData as UpdateProductPayloadT);
      toast.success("Successfully Updated !");
      navigate("/tickets");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
     setTimeout(() => {
      setSubmitLoading(false);
     },3000)
    }
  };

  const handleCancel = () => {
    navigate("/tickets");
  };

  const handleRefresh = async () => {
    if (!id) return;
    setRefresh(true);
    try {
      const res: any = await seedProduct(id);
      if (res.data) {
        toast.success("Successfully Refreshed !");
      }
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setRefresh(false);
    }
  };

  return (
    <PageContainer>
      <BackBtn route="/tickets" title="Back to Tickets" preserveParams={true} />
      <PageHeader title={data?.name} des="Modify the ticket details below." />

      <div className="w-full flex  mb-6">
        <Button size="lg" disabled={refresh} onClick={handleRefresh}>
          {refresh ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <TicketEditForm
          mode="edit"
          loading={submitLoading}
          initialValues={data as ProductInfoT}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
        {data && (
         <RelatedTicketsCarousel ticketId={data.id} isPublished={data.isPublished} />
      )}
      </div>
      
    </PageContainer>
  );
};

export default AdminTicketEdit;
