import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ModalWrapper from "@/components/ModalWrapper";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductInfo } from "@/graphql/product";
import { ProductInfoT } from "@/types/product.type";
import TicketEditForm from "./_components/TicketEditForm";

const Tickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getAllProducts({ 
      category: "", 
      cityId: "", 
      countryId: "", 
      limit: 100, 
      page: 1, 
      orderBy: { dir: "desc" } 
    }),
  });

  const openCreateModal = () => {
    setMode("create");
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (ticket: any) => {
    setMode("edit");
    // For edit mode, we need to fetch the full product info
    try {
      const fullTicketInfo = await getProductInfo(ticket.id);
      setEditingTicket(fullTicketInfo);
    } catch (error) {
      console.error("Error fetching full ticket info:", error);
      setEditingTicket(ticket); // Fallback to basic info
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  const handleFormSubmit = async (formData: any) => {
    // TODO: Implement actual API call to create/update ticket
    console.log("Form submitted with data:", formData);
    closeModal();
    // refetch(); // Refresh the tickets list
  };

  if (isError) {
    return <div>Error loading tickets</div>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Tickets" 
        des="Manage tickets and their details." 
      />
      
      <div className="flex justify-end mb-6">
        <Button onClick={openCreateModal}>
          Add New Ticket
        </Button>
      </div>

      {isLoading ? (
        <div>Loading tickets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.data || []).map((ticket) => (
            <div 
              key={ticket.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openEditModal(ticket)}
            >
              <h3 className="font-semibold text-lg">{ticket.name}</h3>
              <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {ticket.category}
                </span>
                <span className="text-xs text-gray-500">
                  {ticket.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ModalWrapper
          title={mode === "create" ? "Create New Ticket" : "Edit Ticket"}
          onClose={closeModal}
        >
          <TicketEditForm
            mode={mode}
            initialValues={editingTicket || undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />
        </ModalWrapper>
      )}
    </PageContainer>
  );
};

export default Tickets;