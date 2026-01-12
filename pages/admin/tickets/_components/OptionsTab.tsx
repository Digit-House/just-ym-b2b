import React from "react";
import { Control, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, ProductOptionT, TicketTypeT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type OptionsTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  getValues: UseFormGetValues<TicketFormValues>;
  setValue: UseFormSetValue<TicketFormValues>;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT;
};

const OptionsTab: React.FC<OptionsTabProps> = ({
  control,
  errors,
  watch,
  getValues,
  setValue,
  mode,
  initialValues,
}) => {
  // Watch the productOptions field to trigger re-renders when it changes
  const watchedProductOptions = watch("productOptions");

  const addProductOption = () => {
    const newTicketType: TicketTypeT = {
      id: `new-ticket-type-${Date.now()}`,
      name: "New Package", // Default value that meets validation
      sku: "", // May need validation depending on schema
      globaltixId: 0,
      issuanceLimit: null,
      maxPurchaseQty: null,
      minPurchaseQty: null,
      useBin: false,
      applyToAllQna: false,
      ageFrom: null,
      ageTo: null,
      nettPrice: 0,
      dhNetPrice: 0,
      dhSellingPrice: 0,
      dhRecommendedSellingPrice: 0,
      originalPrice: 0,
      similarTicketId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: 0,
    };

    // Create a new product option with the default ticket type
    const newOption: ProductOptionT = {
      createdAt: new Date(),
      currency: "THB",
      definedDuration: "",
      demandType: "FIXED",
      description: "",
      id: `product-option-${Date.now()}`,
      inclusions: [],
      isDynamicPricing: false,
      isTagged: false,
      keywords: "",
      name: `Package Option ${watchedProductOptions?.length + 1 || 1}`,
      primaryTicket: "",
      productId: initialValues?.id || "",
      publishStart: new Date(),
      isCapacity: false,
      redeemEnd: new Date(),
      redeemStart: new Date(),
      ticketFormat: "DIGITAL",
      ticketType: [newTicketType], // Start with one default ticket type
      ticketValidity: "PERPETUAL",
      timeSlot: [],
      tourInformation: [],
      type: "STANDARD",
      updatedAt: new Date(),
      publishEnd: new Date(),
      questions: [],
      visitDate: {
        isOpenDated: false,
        request: false,
        required: false,
      },
      advanceBooking: null,
      availability: null,
    };

    // Add the new product option to the form state
    const currentOptions = getValues("productOptions") || [];
    const updatedOptions = [...currentOptions, newOption];
    setValue("productOptions", updatedOptions, { shouldDirty: true });
  };

  const addVariant = (optionIndex: number) => {
    const newTicketType: TicketTypeT = {
      id: `new-ticket-type-${Date.now()}`,
      name: "New Variant", // Default value that meets validation
      sku: "", // May need validation depending on schema
      globaltixId: 0,
      issuanceLimit: null,
      maxPurchaseQty: null,
      minPurchaseQty: null,
      useBin: false,
      applyToAllQna: false,
      ageFrom: null,
      ageTo: null,
      nettPrice: 0,
      dhNetPrice: 0,
      dhSellingPrice: 0,
      dhRecommendedSellingPrice: 0,
      originalPrice: 0,
      similarTicketId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: 0,
    };

    // Add the new ticket type to the specified product option
    const currentOptions = getValues("productOptions") || [];
    const updatedOptions = [...currentOptions];
    
    if (updatedOptions[optionIndex]) {
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        ticketType: [...updatedOptions[optionIndex].ticketType, newTicketType],
      };
      setValue("productOptions", updatedOptions, { shouldDirty: true });
    }
  };

  const removeTicketType = (optionIndex: number, ticketIndex: number) => {
    const currentOptions = getValues("productOptions") || [];

    if (!currentOptions[optionIndex]) return;

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            ticketType: option.ticketType.filter((_, ti) => ti !== ticketIndex),
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });
  };

  const removeProductOption = (optionIndex: number) => {
    const currentOptions = getValues("productOptions") || [];
    const updatedOptions = currentOptions.filter((_, oi) => oi !== optionIndex);
    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });
  };

  const updateTicketType = (
    optionIndex: number,
    ticketIndex: number,
    field: keyof TicketTypeT,
    value: any
  ) => {
    const currentOptions = getValues("productOptions") || [];

    if (!currentOptions[optionIndex]) return;

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            ticketType: option.ticketType.map((ticket, ti) =>
              ti === ticketIndex ? { ...ticket, [field]: value } : ticket
            ),
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5 text-indigo-600" />
          Pricing & Packages
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure different packages and pricing options for this ticket
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">Packages</h4>
          <Button type="button" onClick={addProductOption} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Package
          </Button>
        </div>

        <div className="space-y-6">
          {watchedProductOptions?.map((option, optionIndex) => (
            <div key={option.id || `option-${optionIndex}`} className="space-y-4 p-6 rounded-lg border bg-gray-50">
              {/* Product option header */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">
                  Package Option {optionIndex + 1}: {option.name}
                </h4>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addVariant(optionIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Variant
                  </Button>
                  
                  {watchedProductOptions?.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProductOption(optionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {option.ticketType?.map((ticketType, ticketIndex) => {
                const ticketErrors =
                  errors.productOptions?.[optionIndex]?.ticketType?.[
                    ticketIndex
                  ];

                return (
                  <div
                    key={ticketType.id ?? `${optionIndex}-${ticketIndex}`}
                    className={`p-6 rounded-lg border shadow-sm ${
                      ticketErrors
                        ? "bg-red-50 border-red-300"
                        : "bg-white"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-medium text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4 text-indigo-500" />
                        {ticketType.name || `Variant ${ticketIndex + 1}`}
                      </h5>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeTicketType(optionIndex, ticketIndex)
                        }
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <InputField
                        label="Package Name"
                        value={ticketType.name}
                        errMsg={ticketErrors?.name?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <InputField
                        label="Quantity"
                        type="number"
                        value={ticketType.quantity}
                        errMsg={ticketErrors?.quantity?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Available quantity"
                      />

                      <InputField
                        label="SKU"
                        value={ticketType.sku}
                        errMsg={ticketErrors?.sku?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "sku",
                            e.target.value
                          )
                        }
                      />

                      <InputField
                        label="GlobalTix ID"
                        type="number"
                        value={ticketType.globaltixId}
                        errMsg={ticketErrors?.globaltixId?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "globaltixId",
                            Number(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <InputField
                        label="Original Price ($)"
                        type="number"
                        value={ticketType.originalPrice}
                        errMsg={ticketErrors?.originalPrice?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "originalPrice",
                            Number(e.target.value) || 0
                          )
                        }
                      />

                      <InputField
                        label="DH Net Price ($)"
                        type="number"
                        value={ticketType.dhNetPrice}
                        errMsg={ticketErrors?.dhNetPrice?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "dhNetPrice",
                            Number(e.target.value) || 0
                          )
                        }
                      />

                      <InputField
                        label="DH Selling Price ($)"
                        type="number"
                        value={ticketType.dhSellingPrice}
                        errMsg={ticketErrors?.dhSellingPrice?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "dhSellingPrice",
                            Number(e.target.value) || 0
                          )
                        }
                      />

                      <InputField
                        label="DH Recommended Price ($)"
                        type="number"
                        value={ticketType.dhRecommendedSellingPrice}
                        errMsg={ticketErrors?.dhRecommendedSellingPrice?.message}
                        onChange={(e) =>
                          updateTicketType(
                            optionIndex,
                            ticketIndex,
                            "dhRecommendedSellingPrice",
                            Number(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <Checkbox
                          checked={ticketType.useBin}
                          onCheckedChange={(checked) =>
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "useBin",
                              Boolean(checked)
                            )
                          }
                        />
                        <Label>Use BIN</Label>
                      </div>

                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <Checkbox
                          checked={ticketType.applyToAllQna}
                          onCheckedChange={(checked) =>
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "applyToAllQna",
                              Boolean(checked)
                            )
                          }
                        />
                        <Label>Apply to All Q&A</Label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty state */}
          {!watchedProductOptions?.length && (
            <div className="p-8 bg-gray-50 rounded-xl border text-center">
              <Tag className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No Packages Configured
              </h4>
              <p className="text-gray-600 mb-4">
                Add your first package to configure pricing and ticket
                options.
              </p>
              <Button type="button" onClick={addProductOption}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Package
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsTab;
