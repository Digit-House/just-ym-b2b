import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ProductT } from "@/types/product.type";
import {
  fetchRecommendedProducts,
  updateRecommendedProductPosition,
} from "@/graphql/product";
import ImageFallback from "@/components/ImageFallback";
import { getErrMsg, preFixImg } from "@/util/initData";
import ModalWrapper from "@/components/ModalWrapper";
import { toast } from "sonner";

interface RecommendedTicketsSortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecommendedTicketsSortDialog = ({
  open,
  onOpenChange,
}: RecommendedTicketsSortDialogProps) => {
  const [recommendedTickets, setRecommendedTickets] = useState<ProductT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadRecommendedTickets();
    }
  }, [open]);

  const loadRecommendedTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetchRecommendedProducts();
      setRecommendedTickets(response.data || []);
    } catch (error) {
      console.error("Failed to load recommended tickets:", error);
      toast.error("Failed to load recommended tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(recommendedTickets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRecommendedTickets(items);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare the position data for submission
      const positionData = recommendedTickets.map((ticket, index) => ({
        productId: ticket.id,
        position: index + 1,
      }));

      await updateRecommendedProductPosition(positionData);
      toast.success("Ticket order saved successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update recommended ticket positions:", error);
      toast.error(getErrMsg(error,"message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
        {isSubmitting ? "Saving..." : "Save Order"}
      </Button>
    </div>
  );

  return (
    <ModalWrapper
      title="Sort Recommended Tickets"
      onClose={() => onOpenChange(false)}
      footer={footer}
      width="lg"
    >
      <div className="py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="recommended-tickets-list"
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {recommendedTickets.map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            flex items-center p-4 bg-white rounded-lg border
                            ${
                              snapshot.isDragging
                                ? "shadow-lg bg-indigo-50"
                                : "bg-white"
                            }
                          `}
                        >
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-md mr-4">
                            {index + 1}
                          </div>
                          <ImageFallback
                            src={preFixImg(ticket.image)}
                            alt={ticket.name}
                            className="w-12 h-12 object-cover rounded-md mr-4"
                          />
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {ticket.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {!isLoading && recommendedTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recommended tickets found
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default RecommendedTicketsSortDialog;
