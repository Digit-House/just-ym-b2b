import React, { useEffect, useMemo, useState } from "react";
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
import TextInput from "@/components/ticket-fields/TextInput";
import RichText from "@/components/ticket-fields/RichText";
import StringListEditor from "@/components/ticket-fields/StringListEditor";
import BilingualListSection, { LIST_ICONS } from "@/components/ticket-fields/BilingualListSection";
import PackageCardShell from "@/components/ticket-fields/PackageCardShell";
import PackagesHeader from "@/components/ticket-fields/PackagesHeader";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ReadOnly from "@/components/ReadOnly";
import { formatUtcDate } from "@/lib/dateFormat";
import { ReviewField, useLocked, useOwnerReview } from "@/components/OwnerReviewContext";
import { CountPill, optionUpdateCount } from "@/pages/content/_components/SupplierUpdatesPanel";

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
  const locked = useLocked();
  const review = useOwnerReview();
  const watchedProductOptions = watch("productOptions");

  useEffect(() => {
    const timer = setTimeout(() => {
      trigger("productOptions");
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedProductOptions, trigger]);

  // Fold state per package. Packages start collapsed.
  const [openPackages, setOpenPackages] = useState<Set<number>>(new Set());
  const optionCount = watchedProductOptions?.length ?? 0;

  const togglePackage = (index: number) =>
    setOpenPackages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const expandAll = () =>
    setOpenPackages(new Set(Array.from({ length: optionCount }, (_, i) => i)));
  const collapseAll = () => setOpenPackages(new Set());

  // Go to field: open the package that owns the update.
  const focus = review?.focus;
  useEffect(() => {
    if (!focus) return;
    const i = (watch("productOptions") ?? []).findIndex((o: any) => o.id === focus.optionId);
    if (i >= 0) setOpenPackages((prev) => new Set(prev).add(i));
  }, [focus, watch]);

  // Packages with validation errors open automatically so the errors are visible.
  const errorIndexKey = useMemo(() => {
    const optionErrors = errors.productOptions;
    if (!optionErrors) return "";
    return Array.from({ length: optionCount }, (_, i) => i)
      .filter((i) => !!(optionErrors as any)[i])
      .join(",");
  }, [errors.productOptions, optionCount]);

  useEffect(() => {
    if (!errorIndexKey) return;
    setOpenPackages((prev) => {
      const next = new Set(prev);
      errorIndexKey.split(",").forEach((i) => next.add(Number(i)));
      return next;
    });
  }, [errorIndexKey]);

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
        <PackagesHeader count={optionCount} onExpandAll={expandAll} onCollapseAll={collapseAll} hidden={locked} />

        <div className="space-y-6">
          {watchedProductOptions?.map((option, optionIndex) => {
            const isOpen = locked || openPackages.has(optionIndex);
            const hasError = !!errors.productOptions?.[optionIndex];
            const ticketTypeCount = option.ticketTypes?.length ?? 0;

            return (
              <PackageCardShell
                key={option.id ?? `option-${optionIndex}`}
                index={optionIndex}
                name={option.name}
                published={option.isPublished}
                ticketTypeCount={ticketTypeCount}
                hasError={hasError}
                open={isOpen}
                onToggle={() => togglePackage(optionIndex)}
                badges={
                  <>
                    <CountPill
                      count={optionUpdateCount(review?.updates ?? [], option.id, option.ticketTypes?.map((t) => t.ticketTypeId))}
                      text
                    />
                    {hasError && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        Needs fixing
                      </span>
                    )}
                  </>
                }
              >
                      <>
                        <div className="grid grid-cols-1 gap-4 mb-6">
                          <ReviewField entity="ProductOption" entityId={option.id ?? undefined} names={["name"]} label="Package name" current={option.name}>
                          <TextInput
                            label="Package Name"
                            value={option.name}
                            onChange={(v) =>
                              updateProductOption(optionIndex, "name", v)
                            }
                            errMsg={
                              errors.productOptions?.[optionIndex]?.name
                                ?.message
                            }
                          />
                          </ReviewField>
                        </div>

                        <div className="space-y-4">
                          <hr className="border-gray-200 mt-5" />
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <h4 className="text-lg font-semibold text-gray-800">
                              Package Description
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            {/* English */}
                            <ReviewField entity="ProductOption" entityId={option.id ?? undefined} names={["description"]} label="Package description" current={option.description}>
                            <div className="space-y-3">
                              <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                English
                              </h5>
                              <RichText
                                readOnly={locked}
                                value={option.description}
                                onChange={(html) =>
                                  updateProductOption(optionIndex, "description", html)
                                }
                                placeholder="Enter package description..."
                                errMsg={errors.productOptions?.[optionIndex]?.description?.message}
                              />
                            </div>
                            </ReviewField>

                            {/* Myanmar */}
                            <ReviewField entity="ProductOption" entityId={option.id ?? undefined} names={["description_mm"]} label="Package description (Myanmar)" current={option.description_mm}>
                            <div className="space-y-3">
                              <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Myanmar
                              </h5>
                              <RichText
                                readOnly={locked}
                                value={option.description_mm}
                                onChange={(html) =>
                                  updateProductOption(optionIndex, "description_mm", html)
                                }
                                placeholder="Enter package description in Myanmar..."
                                errMsg={errors.productOptions?.[optionIndex]?.description_mm?.message}
                              />
                            </div>
                            </ReviewField>
                          </div>
                        </div>

                        <ReadOnly
                          label="Ticket Validity"
                          value={option.ticketValidity}
                        />

                        <ReadOnly
                          label="Redeem Start"
                          value={
                            option.redeemStart
                              ? formatUtcDate(option.redeemStart)
                              : "---"
                          }
                        />

                        <ReadOnly
                          label="Redeem End"
                          value={
                            option.redeemEnd
                              ? formatUtcDate(option.redeemEnd)
                              : "---"
                          }
                        />

                        <ReadOnly
                          label="Defined Duration"
                          value={option.definedDuration}
                        />

                        <ReadOnly
                          label="Visit Date"
                          value={
                            option.visitDate.isOpenDated ? "True" : "False"
                          }
                        />

                        <div className="mb-4">
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg py-3">
                            <Checkbox
                              checked={option.thaiNationalOnly}
                              onCheckedChange={(checked) =>
                                updateProductOption(
                                  optionIndex,
                                  "thaiNationalOnly",
                                  checked
                                )
                              }
                            />
                            <Label>Thai National Only</Label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <hr className="border-gray-200 mt-5" />
                          <BilingualListSection
                            title="Inclusions"
                            icon={LIST_ICONS.exclusions}
                            en={
                              <ReviewField entity="ProductOption" entityId={option.id ?? undefined} names={["inclusions"]} label="Package inclusions" current={option.inclusions}>
                                <StringListEditor
                                  label="Inclusions"
                                  value={option.inclusions}
                                  onChange={(v) => updateProductOption(optionIndex, "inclusions", v)}
                                  readOnly={locked}
                                  minItems={1}
                                  placeholder="Enter inclusions"
                                  addLabel="Add Inclusions"
                                />
                              </ReviewField>
                            }
                            mm={
                              <ReviewField entity="ProductOption" entityId={option.id ?? undefined} names={["inclusions_mm"]} label="Package inclusions (Myanmar)" current={option.inclusions_mm}>
                                <StringListEditor
                                  label="Inclusions MM"
                                  value={option.inclusions_mm}
                                  onChange={(v) => updateProductOption(optionIndex, "inclusions_mm", v)}
                                  readOnly={locked}
                                  minItems={1}
                                  placeholder="Enter inclusions (MM)"
                                  addLabel="Add Inclusions MM"
                                />
                              </ReviewField>
                            }
                          />
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg py-3">
                            <Checkbox
                              checked={!!option.isPublished}
                              onCheckedChange={(checked) =>
                                updateProductOption(
                                  optionIndex,
                                  "isPublished",
                                  checked
                                )
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

                          {option.ticketTypes?.map(
                            (ticketType, ticketIndex) => {
                              const ticketErrors =
                                errors.productOptions?.[optionIndex]
                                  ?.ticketTypes?.[ticketIndex];

                              return (
                                <div
                                  key={`${optionIndex}-${ticketIndex}`}
                                  className={`p-4 rounded-lg border mb-3 ${
                                    ticketErrors
                                      ? "bg-red-50 border-red-300"
                                      : "bg-white"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <ReviewField entity="TicketType" entityId={ticketType.id ?? undefined} names={["name"]} label="Ticket type name" current={ticketType.name}>
                                    <h6 className="font-medium">
                                      {ticketType.name}
                                    </h6>
                                    </ReviewField>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InputField
                                      label="Original Price (GlobalTix)"
                                      type="number"
                                      value={
                                        ticketType.supplierOriginalPrice ??
                                        ticketType.originalPrice ??
                                        ""
                                      }
                                      disabled={true}
                                    />

                                    <div className="flex flex-col gap-1">
                                      <InputField
                                        label="Custom original price"
                                        type="number"
                                        min={0}
                                        value={
                                          ticketType.customOriginalPrice ?? ""
                                        }
                                        onChange={(e) => {
                                          const value =
                                            e.target.value === ""
                                              ? null
                                              : Number(e.target.value);
                                          updateTicketType(
                                            optionIndex,
                                            ticketIndex,
                                            "customOriginalPrice",
                                            value
                                          );
                                        }}
                                        errMsg={
                                          ticketErrors?.customOriginalPrice
                                            ?.message
                                        }
                                      />
                                      <p className="text-xs text-gray-500">
                                        Empty = use GlobalTix price
                                      </p>
                                    </div>

                                    <InputField
                                      label="Net Price"
                                      type="number"
                                      value={ticketType.nettPrice ?? ""}
                                      disabled={true}
                                    />

                                    <InputField
                                      label="Minimum Selling Price"
                                      type="number"
                                      value={
                                        ticketType.minimumSellingPrice ?? ""
                                      }
                                      disabled={true}
                                    />

                                    <InputField
                                      label="Recommended Selling Price"
                                      type="number"
                                      value={
                                        ticketType.recommendedSellingPrice ?? ""
                                      }
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
                                      errMsg={
                                        ticketErrors?.dhSellingPrice?.message
                                      }
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
                                      value={
                                        ticketType.dhMinimumSellingPrice ?? ""
                                      }
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
                                        ticketErrors?.dhRecommendedSellingPrice
                                          ?.message
                                      }
                                    />

                                    <InputField
                                      label="DH Recommended Selling Price"
                                      type="number"
                                      value={
                                        ticketType.dhRecommendedSellingPrice ??
                                        ""
                                      }
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
                                        ticketErrors?.dhRecommendedSellingPrice
                                          ?.message
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}

                          {(!option.ticketTypes ||
                            option.ticketTypes.length === 0) && (
                            <p className="text-gray-500 text-sm mb-3">
                              No ticket types added yet.
                            </p>
                          )}
                        </div>
                      </>
              </PackageCardShell>
            );
          })}

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
