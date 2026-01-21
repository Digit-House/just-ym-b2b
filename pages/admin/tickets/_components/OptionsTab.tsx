import React, { useEffect } from "react";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TextareaField from "@/components/TextareaField";

type OptionsTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  getValues: UseFormGetValues<TicketFormValues>;
  setValue: UseFormSetValue<TicketFormValues>;
  trigger: UseFormTrigger<TicketFormValues>;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

const OptionsTab: React.FC<OptionsTabProps> = ({
  errors,
  watch,
  getValues,
  setValue,
  trigger,
  mode,
}) => {
  // Watch the productOptions field to trigger re-renders when it changes
  const watchedProductOptions = watch("productOptions");

  // Trigger validation when product options change
  useEffect(() => {
    const timer = setTimeout(() => {
      trigger("productOptions");
    }, 300); // Small delay to avoid excessive triggering

    return () => clearTimeout(timer);
  }, [watchedProductOptions, trigger]);

  const updateTicketType = (
    optionIndex: number,
    ticketIndex: number,
    field: string,
    value: any
  ) => {
    // Convert empty strings to null for nullable fields
    const processedValue = value === "" ? null : value;

    const currentOptions = getValues("productOptions") ?? [];

    if (!currentOptions[optionIndex]) return;

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            ticketTypes:
              option.ticketTypes?.map((ticket, ti) =>
                ti === ticketIndex
                  ? { ...ticket, [field]: processedValue }
                  : ticket
              ) ?? [],
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });

    // Trigger validation after the update
    setTimeout(() => trigger("productOptions"), 0);
  };

  const updateProductOption = (
    optionIndex: number,
    field: string,
    value: any
  ) => {
    // Convert empty strings to null for nullable fields
    const processedValue = value === "" ? null : value;

    const currentOptions = getValues("productOptions") ?? [];

    if (!currentOptions[optionIndex]) return;

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            [field]: processedValue,
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });

    // Trigger validation after the update
    setTimeout(() => trigger("productOptions"), 0);
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
        </div>

        <div className="space-y-6">
          {watchedProductOptions?.map((option, optionIndex) => (
            <div
              key={option.id ?? `option-${optionIndex}`}
              className="space-y-4 p-6 rounded-lg border bg-gray-50"
            >
              {/* Product option header */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">
                  Package Option {optionIndex + 1}
                </h4>

                <div className="flex gap-2">
                  {/* Hide add ticket type and delete buttons in edit mode */}
                </div>
              </div>

              {/* Package details */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <InputField
                  label="Package Name"
                  value={option.name ?? ""}
                  onChange={(e) =>
                    updateProductOption(optionIndex, "name", e.target.value)
                  }
                  errMsg={errors.productOptions?.[optionIndex]?.name?.message}
                />

                <TextareaField
                  label="Package Description"
                  value={option.description ?? ""}
                  onChange={(e) =>
                    updateProductOption(
                      optionIndex,
                      "description",
                      e.target.value
                    )
                  }
                  errMsg={
                    errors.productOptions?.[optionIndex]?.description?.message
                  }
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  <Checkbox
                    checked={!!option.isPublished}
                    onCheckedChange={(checked) =>
                      updateProductOption(optionIndex, "isPublished", checked)
                    }
                  />
                  <Label>Is Published</Label>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Ticket Types</h5>
                </div>

                {option.ticketTypes?.map((ticketType, ticketIndex) => {
                  const ticketErrors =
                    errors.productOptions?.[optionIndex]?.ticketTypes?.[
                      ticketIndex
                    ];

                  return (
                    <div
                      key={`${optionIndex}-${ticketIndex}`}
                      className={`p-4 rounded-lg border mb-3 ${
                        ticketErrors ? "bg-red-50 border-red-300" : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h6 className="font-medium">
                          Ticket Type {ticketIndex + 1}
                        </h6>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputField
                          label="Original Price"
                          type="number"
                          value={ticketType.originalPrice ?? ""}
                          disabled={true}
                        />

                        <InputField
                          label="Net Price"
                          type="number"
                          value={ticketType.dhNetPrice ?? ""}
                          disabled={true}
                        />

                        <InputField
                          label="Minimum Selling Price"
                          type="number"
                          value={ticketType.minmumSellingPrice ?? ""}
                          disabled={true}
                        />

                        <InputField
                          label="DH Selling Price"
                          type="number"
                          value={ticketType.dhSellingPrice ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "dhSellingPrice",
                              value
                            );
                          }}
                          errMsg={ticketErrors?.dhSellingPrice?.message}
                        />

                        <InputField
                          label="DH Net Merchant Price"
                          type="number"
                          value={ticketType.dhNetMerchantPrice ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "dhNetMerchantPrice",
                              value
                            );
                          }}
                          errMsg={ticketErrors?.dhNetMerchantPrice?.message}
                        />

                        <InputField
                          label="DH Recommended Selling Price"
                          type="number"
                          value={ticketType.dhRecommendedSellingPrice ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "dhRecommendedSellingPrice",
                              value
                            );
                          }}
                          errMsg={
                            ticketErrors?.dhRecommendedSellingPrice?.message
                          }
                        />
                      </div>
                    </div>
                  );
                })}

                {(!option.ticketTypes || option.ticketTypes.length === 0) && (
                  <p className="text-gray-500 text-sm mb-3">
                    No ticket types added yet.
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {(!watchedProductOptions || watchedProductOptions.length === 0) && (
            <div className="p-8 bg-gray-50 rounded-xl border text-center">
              <Tag className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No Packages Configured
              </h4>
              <p className="text-gray-600 mb-4">
                No packages have been configured for this ticket.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsTab;
