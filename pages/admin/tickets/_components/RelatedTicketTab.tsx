import {
  ProductInfoT,
  ProductRelatedT,
} from "@/types/product.type";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { useState, useEffect } from "react";
import AlreadyRelated from "./AlreadyRelated";
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

  const dataRelatedProducts = initialValues?.relatedProducts as ProductRelatedT[] || [];
  const [activeTab, setActiveTab] = useState<"alreadyRelated" | "addRelated">(
    "alreadyRelated"
  );

 
  useEffect(() => {
    if (dataRelatedProducts.length > 0) {
      
      setValue("relatedProducts", dataRelatedProducts);
    }
  }, []); 

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "alreadyRelated"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("alreadyRelated")}
        >
          Already Related
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "addRelated"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("addRelated")}
        >
          Add Related
        </button>
      </div>
      

      {activeTab === "alreadyRelated" && (
        <AlreadyRelated
          watch={watch}
          setValue={setValue}
          initialValues={initialValues}
        />
      )}

      {activeTab === "addRelated" && (
        <AddRelated
          setValue={setValue}
          currentRelatedProducts={dataRelatedProducts || []}
          currentTicketId={initialValues?.id}
        />
      )}
    </div>
  );
};

export default RelatedTicketTab;
