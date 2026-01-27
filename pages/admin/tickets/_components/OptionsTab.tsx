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
import { NotebookIcon, Plus, Tag, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TextareaField from "@/components/TextareaField";
import ReadOnly from "@/components/ReadOnly";
import { Button } from "@/components/ui/button";

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
}) => {
  const watchedProductOptions = watch("productOptions");

  useEffect(() => {
    const timer = setTimeout(() => {
      trigger("productOptions");
    }, 300);

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

  // Helper functions for inclusions array operations
  const addInclusion = (optionIndex: number, isMyanmar: boolean = false) => {
    const currentOptions = getValues("productOptions") ?? [];
    if (!currentOptions[optionIndex]) return;

    const field = isMyanmar ? "inclusions_mm" : "inclusions";
    const currentArray = currentOptions[optionIndex][field] ?? [];

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            [field]: [...currentArray, ""],
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });

    // Trigger validation after the update
    setTimeout(() => trigger("productOptions"), 0);
  };

  const updateInclusion = (
    optionIndex: number,
    index: number,
    value: string,
    isMyanmar: boolean = false
  ) => {
    const currentOptions = getValues("productOptions") ?? [];
    if (!currentOptions[optionIndex]) return;

    const field = isMyanmar ? "inclusions_mm" : "inclusions";
    const currentArray = currentOptions[optionIndex][field] ?? [];

    const updatedArray = currentArray.map((item, i) =>
      i === index ? value : item
    );

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            [field]: updatedArray,
          }
        : option
    );

    setValue("productOptions", updatedOptions, {
      shouldDirty: true,
    });

    // Trigger validation after the update
    setTimeout(() => trigger("productOptions"), 0);
  };

  const removeInclusion = (
    optionIndex: number,
    index: number,
    isMyanmar: boolean = false
  ) => {
    const currentOptions = getValues("productOptions") ?? [];
    if (!currentOptions[optionIndex]) return;

    const field = isMyanmar ? "inclusions_mm" : "inclusions";
    const currentArray = currentOptions[optionIndex][field] ?? [];

    if (currentArray.length <= 1) return; // Prevent removing all items

    const updatedArray = currentArray.filter((_, i) => i !== index);

    const updatedOptions = currentOptions.map((option, oi) =>
      oi === optionIndex
        ? {
            ...option,
            [field]: updatedArray,
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
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">
                  Package {optionIndex + 1}
                </h4>
              </div>

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

              <ReadOnly label="Ticket Validity" value={option.ticketValidity} />

              <ReadOnly
                label="Defined Duration"
                value={option.definedDuration}
              />

              <ReadOnly
                label="Visit Date"
                value={option.visitDate.isOpenDated ? "True" : "False"}
              />

              

              <div className="space-y-4">
              <hr className="border-gray-200 mt-5" />
                <div className="flex items-center gap-2 mb-4">
                  <NotebookIcon className="h-5 w-5 text-red-500" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Inclusions
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* English */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                      English
                    </h5>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {option.inclusions.map((item, index) => (
                        <div key={index} className="relative group">
                          <TextareaField
                            label=""
                            value={item}
                            onChange={(e) =>
                              updateInclusion(optionIndex, index, e.target.value, false)
                            }
                            placeholder="Enter inclusions"
                            minHeight={60}
                            maxHeight={150}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeInclusion(optionIndex, index, false)
                              }
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => addInclusion(optionIndex, false)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Inclusions
                      </Button>
                    </div>
                  </div>

                  {/* Myanmar */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Myanmar
                    </h5>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {option.inclusions_mm.map((item, index) => (
                        <div key={index} className="relative group">
                          <TextareaField
                            label=""
                            value={item}
                            onChange={(e) =>
                              updateInclusion(optionIndex, index, e.target.value, true)
                            }
                            placeholder="Enter inclusions (MM)"
                            minHeight={60}
                            maxHeight={150}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeInclusion(optionIndex, index, true)
                              }
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => addInclusion(optionIndex, true)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Inclusions MM
                      </Button>
                    </div>
                  </div>
                </div>
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
                        <h6 className="font-medium">{ticketType.name}</h6>
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
                          value={ticketType.nettPrice ?? ""}
                          disabled={true}
                        />

                        <InputField
                          label="Minimum Selling Price"
                          type="number"
                          value={ticketType.minimumSellingPrice ?? ""}
                          disabled={true}
                        />

                        <InputField
                          label="Recommended Selling Price"
                          type="number"
                          value={ticketType.recommendedSellingPrice ?? ""}
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
                          label="DH Net Price"
                          type="number"
                          value={ticketType.dhNetPrice ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "dhNetPrice",
                              value
                            );
                          }}
                          errMsg={ticketErrors?.dhNetPrice?.message}
                        />

                        <InputField
                          label="DH Minimum Selling Price"
                          type="number"
                          value={ticketType.dhMinimumSellingPrice ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            updateTicketType(
                              optionIndex,
                              ticketIndex,
                              "dhMinimumSellingPrice",
                              value
                            );
                          }}
                          errMsg={
                            ticketErrors?.dhRecommendedSellingPrice?.message
                          }
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
