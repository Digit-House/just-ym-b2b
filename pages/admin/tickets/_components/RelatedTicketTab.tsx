import { ProductInfoT, ProductRelatedT } from "@/types/product.type";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AddRelated from "./AddRelated";

type Props = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  getValues: UseFormGetValues<TicketFormValues>;
  setValue: UseFormSetValue<TicketFormValues>;
  trigger: UseFormTrigger<TicketFormValues>;
  mode: "create" | "edit";
  initialValues?: ProductInfoT;
};

const RelatedTicketTab = ({
  control,
  errors,
  watch,
  getValues,
  setValue,
  trigger,
  mode,
  initialValues,
}: Props) => {
  const dataRelatedProducts =
    (initialValues?.relatedProducts as ProductRelatedT[]) || [];

  // State for current related products in the form
  const [currentRelatedProducts, setCurrentRelatedProducts] = useState<any[]>(
    dataRelatedProducts || []
  );

  useEffect(() => {
    if (dataRelatedProducts.length > 0) {
      setValue("relatedProducts", dataRelatedProducts);
      setCurrentRelatedProducts(dataRelatedProducts);
    }
  }, [dataRelatedProducts, setValue]);

  // const handleSaveRelatedTickets = () => {
  //   setValue("relatedProducts", currentRelatedProducts);
  // };

  const handleRelatedProductsChange = (updatedProducts: any[]) => {
    setCurrentRelatedProducts(updatedProducts);
    setValue("relatedProducts", updatedProducts);
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-end mb-4">
        <Button type="button" onClick={handleSaveRelatedTickets}>
          Save Related Tickets
        </Button>
      </div> */}

      <AddRelated
        currentRelatedProducts={currentRelatedProducts}
        currentTicketId={initialValues?.id}
        onRelatedProductsChange={handleRelatedProductsChange}
      />
    </div>
  );
};

export default RelatedTicketTab;