import {
  ProductInfoT,
  ProductRelatedT,
} from "@/types/product.type";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { useState, useEffect } from "react";
import {UseFormSetValue } from "react-hook-form";
import RelatedTicketCard from "./RelatedTicketCard";

type Props = {
  watch: any;
  setValue: UseFormSetValue<TicketFormValues>;
  initialValues?: ProductInfoT;
};

const AlreadyRelated = ({ watch, setValue, initialValues }: Props) => {
  const [dataRelatedProducts, setDataRelatedProducts] = useState<ProductRelatedT[]>(initialValues?.relatedProducts as ProductRelatedT[] || []);

  // Watch for changes in the form's relatedProducts value
  const formRelatedProducts = watch("relatedProducts");

  // Update local state when form value changes
  useEffect(() => {
    if (formRelatedProducts) {
      setDataRelatedProducts(formRelatedProducts);
    }
  }, [formRelatedProducts]);

  const updateRelatedProduct = (
    productId: string,
    field: "productId" | "linkBack",
    value: any
  ) => {
    const updatedRelatedProducts = dataRelatedProducts.map((item: any) =>
      (item.id || item.productId) === productId ? { ...item, [field]: value } : item
    );
    setValue("relatedProducts", updatedRelatedProducts);
    // Update local state immediately for instant UI feedback
    setDataRelatedProducts(updatedRelatedProducts);
  };

  const removeRelatedProduct = (productId: string) => {
    const updatedRelatedProducts = dataRelatedProducts.filter(
      (item: any) => (item.id || item.productId) !== productId
    );
    
    setValue("relatedProducts", updatedRelatedProducts);
    // Update local state immediately for instant UI feedback
    setDataRelatedProducts(updatedRelatedProducts);
  };

  return (
    <div>
      {dataRelatedProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No related products added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataRelatedProducts?.map((item, index) => {
            return (
              <div key={`${item.id}-${index}`} className="relative">
                <RelatedTicketCard
                  key={`${item.id}-${index}`}
                  product={item}
                  linkBack={item.linkBack}
                  onLinkBackChange={(checked) =>
                    updateRelatedProduct(item.id, "linkBack", checked)
                  }
                  onProductIdChange={(value) =>
                    updateRelatedProduct(item.id, "productId", value)
                  }
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-md hover:shadow-lg"
                  onClick={() => removeRelatedProduct(item.id)}
                  aria-label="Remove related product"
                  title="Remove related product"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlreadyRelated;