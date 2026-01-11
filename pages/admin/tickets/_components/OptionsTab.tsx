import React, { useState } from "react";
import { Control, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, ProductOptionT, TicketTypeT } from "@/types/product.type";
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
  initialValues?: ProductInfoT;
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
  // Initialize ticket types from initial values
  const [ticketTypes, setTicketTypes] = useState<TicketTypeT[]>(
    initialValues?.productOptions && initialValues.productOptions.length > 0
      ? initialValues.productOptions[0]?.ticketType ?? []
      : []
  );

  const addTicketType = () => {
    const newTicketType: TicketTypeT = {
      id: `new-ticket-type-${Date.now()}`,
      name: "New Package",
      sku: "",
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

    setTicketTypes((prev) => [...prev, newTicketType]);

    // Update the form state for product options
    const currentOptions = getValues("productOptions") || [];
    if (currentOptions.length === 0) {
      // Create a default product option if none exists
      const defaultOption: ProductOptionT = {
        createdAt: new Date(),
        currency: "USD",
        definedDuration: "",
        demandType: "FIXED",
        description: "",
        id: `default-option-${Date.now()}`,
        inclusions: [],
        isDynamicPricing: false,
        isTagged: false,
        keywords: "",
        name: "Default Package",
        primaryTicket: "",
        productId: initialValues?.id || "",
        publishStart: new Date(),
        isCapacity: false,
        redeemEnd: new Date(),
        redeemStart: new Date(),
        ticketFormat: "DIGITAL",
        ticketType: [newTicketType],
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
      setValue("productOptions", [defaultOption]);
    } else {
      // Update the first option's ticket types
      const updatedOptions = [...currentOptions];
      updatedOptions[0] = {
        ...updatedOptions[0],
        ticketType: [...updatedOptions[0].ticketType, newTicketType],
      };
      setValue("productOptions", updatedOptions);
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
      shouldValidate: true,
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
      shouldValidate: true,
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
          <Button type="button" onClick={addTicketType} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Package
          </Button>
        </div>

        <div className="space-y-6">
          {getValues("productOptions")?.map((option, optionIndex) => (
            <div key={optionIndex} className="space-y-4">
              {/* Optional product option title */}
              <h4 className="text-lg font-semibold">
                Product Option {optionIndex + 1}
              </h4>

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
                        {ticketType.name || `Package ${ticketIndex + 1}`}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <InputField
                        label="Package Name"
                        value={ticketType.name}
                        // errMsg={!!ticketErrors?.name}
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
                        // error={!!ticketErrors?.sku?.message}
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
                        // error={!!ticketErrors?.globaltixId}
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
                        // error={!!ticketErrors?.originalPrice}
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
                        // error={!!ticketErrors?.dhNetPrice}
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
                        // error={!!ticketErrors?.dhSellingPrice}
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
                        // error={!!ticketErrors?.dhRecommendedSellingPrice}
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
          {!getValues("productOptions")?.some(
            (o) => o.ticketType && o.ticketType.length > 0
          ) && (
            <div className="p-8 bg-gray-50 rounded-xl border text-center">
              <Tag className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No Packages Configured
              </h4>
              <p className="text-gray-600 mb-4">
                Add your first package to configure pricing and ticket
                options.
              </p>
              <Button type="button" onClick={addTicketType}>
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