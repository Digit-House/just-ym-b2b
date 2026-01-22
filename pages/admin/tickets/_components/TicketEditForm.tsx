import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Info, MapPinIcon, Tag, Locate } from "lucide-react";
import { TicketFormValues, ticketSchema } from "@/types/schema/ticketSchema";
import {
  ProductInfoT,
  ProductOptionT,
  UpdateProductPayloadT,
} from "@/types/product.type";
import BasicInfoTab from "./BasicInfoTab";
import LocationTab from "./LocationTab";
import DetailsTab from "./DetailsTab";
import MediaTab from "./MediaTab";
import OperatingHoursTab from "./OperatingHoursTab";
import OptionsTab from "./OptionsTab";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { ImageUploadRef } from "@/components/ImageUpload";

type Mode = "edit";

type Props = {
  mode: Mode;
  initialValues?: UpdateProductPayloadT | ProductInfoT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: TicketFormValues) => void;
};

const TicketEditForm: React.FC<Props> = ({
  mode,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}) => {
  const isEdit = mode === "edit";
  const transformApiDataToForm = (apiData: any) => {
    if (!apiData || !apiData.productOptions) return apiData;
    const transformedProductOptions: ProductOptionT[] =
      apiData.productOptions.map((option: ProductOptionT) => {
        return {
          id: option.id,
          name: option.name,
          description: option.description,
          isPublished: option.isPublished,
          ticketTypes: option.ticketType
            ? option.ticketType.map((ticket: any) => ({
                ticketTypeId: ticket.id,
                name: ticket.name,
                quantity: ticket.quantity,
                dhNetPrice: ticket.dhNetPrice,
                nettPrice:ticket.nettPrice,
                dhRecommendedSellingPrice: ticket.dhRecommendedSellingPrice,
                minimumSellingPrice: ticket.minimumSellingPrice,
                dhSellingPrice: ticket.dhSellingPrice,
                recommendedSellingPrice: ticket.recommendedSellingPrice,
                originalPrice: ticket.originalPrice,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
              }))
            : [],
        };
      });

    return {
      ...apiData,
      productOptions: transformedProductOptions,
    };
  };
  console.log("initialValues", initialValues);
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      id: initialValues?.id ?? null,
      name: initialValues?.name ?? null,
      description: initialValues?.description ?? null,
      description_mm: initialValues?.description_mm ?? null,
      whatToExpect: initialValues?.whatToExpect ?? null,
      whatToExpect_mm: initialValues?.whatToExpect_mm ?? null,
      addressLine: initialValues?.addressLine ?? null,
      location: initialValues?.location ?? null,
      postalCode: initialValues?.postalCode ?? null,
      countryId: (initialValues as any)?.countryId ?? null,
      city_relation_id: (initialValues as any)?.city_relation_id ?? null,
      latitude: initialValues?.latitude ?? null,
      longitude: initialValues?.longitude ?? null,
      keywords: initialValues?.keywords ?? null,
      image: initialValues?.image ?? null,
      media: (initialValues as any)?.media ?? null,
      exclusions: (initialValues as any)?.exclusions ?? null,
      exclusions_mm: (initialValues as any)?.exclusions_mm ?? null,
      fromPrice: null,
      fromReseller: null,
      originalPrice: (initialValues as any)?.originalPrice ?? null,
      timezoneOffset: (initialValues as any)?.timezoneOffset ?? null,
      highlights: (initialValues as any)?.highlights ?? null,
      highlights_mm: (initialValues as any)?.highlights_mm ?? null,
      howToUseList: (initialValues as any)?.howToUseList ?? null,
      howToUseList_mm: (initialValues as any)?.howToUseList_mm ?? null,
      inclusions: (initialValues as any)?.inclusions ?? null,
      inclusions_mm: (initialValues as any)?.inclusions_mm ?? null,
      isBestSeller: (initialValues as any)?.isBestSeller ?? null,
      isCancellable: (initialValues as any)?.isCancellable ?? null,
      isGTRecommend: (initialValues as any)?.isGTRecommend ?? null,
      isInstantConfirmation:
        (initialValues as any)?.isInstantConfirmation ?? null,
      isOpenDated: (initialValues as any)?.isOpenDated ?? null,
      isOwnContracted: null,
      isPublished: (initialValues as any)?.isPublished ?? false,
      termsAndConditions: (initialValues as any)?.termsAndConditions ?? null,
      termsAndConditions_mm:
        (initialValues as any)?.termsAndConditions_mm ?? null,
      thingsToNote: initialValues?.thingsToNote ?? null,
      thingsToNote_mm: (initialValues as any)?.thingsToNote_mm ?? null,
      operatingHours: initialValues?.operatingHours ?? {
        custom: null,
        isToursActivities: null,
        fixedDays: [],
      },
      productOptions:
        transformApiDataToForm(initialValues as any)?.productOptions ?? null,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    getValues,
    trigger,
  } = form;

  const [currentTab, setCurrentTab] = useState("basic-info");

  // Refs for media items to handle deferred uploads
  const mediaItemRefs = useRef<Map<number, ImageUploadRef>>(new Map());
  const mainImageRef = useRef<ImageUploadRef>(null);

  const setMediaItemRef = (index: number) => (ref: ImageUploadRef | null) => {
    if (ref) {
      mediaItemRefs.current.set(index, ref);
    } else {
      mediaItemRefs.current.delete(index);
    }
  };

  // Icon mapping for tabs
  const tabIcons = {
    "basic-info": <Info className="h-4 w-4" />,
    details: <MapPinIcon className="h-4 w-4" />,
    location: <Locate className="h-4 w-4" />,
    media: <MapPin className="h-4 w-4" />,
    "operating-hours": <Clock className="h-4 w-4" />,
    options: <Tag className="h-4 w-4" />,
  };

  // Function to get fields specific to current tab for validation
  const getTabFields = (tabId: string): (keyof TicketFormValues)[] => {
    switch (tabId) {
      case "basic-info":
        return [
          "name",
          "addressLine",
          "location",
          "postalCode",
          "timezoneOffset",
          "originalPrice",
          "keywords",
          "image",
          "isBestSeller",
          "isCancellable",
          "isGTRecommend",
          "isInstantConfirmation",
          "isOpenDated",
        ];
      case "details":
        return [
          "description",
          "whatToExpect",
          "termsAndConditions",
          "exclusions",
          "exclusions_mm",
          "highlights",
          "highlights_mm",
          "howToUseList",
          "howToUseList_mm",
          "inclusions",
          "inclusions_mm",
          "thingsToNote",
        ];
      case "location":
        return ["latitude", "longitude"];
      case "media":
        return ["image"];
      case "operating-hours":
        return ["operatingHours"];
      case "options":
        return ["productOptions"];
      default:
        return [];
    }
  };

  // Tab navigation with validation
  const nextTab = async () => {
    const tabs = [
      "basic-info",
      "details",
      "location",
      "media",
      "operating-hours",
      "options",
    ];
    const currentIndex = tabs.indexOf(currentTab);

    // Validate current tab before moving to next
    const currentTabFields = getTabFields(currentTab);
    if (currentTabFields.length > 0) {
      const isValid = await trigger(currentTabFields);

      if (!isValid) {
        return; // Stay on current tab if validation fails
      }
    }

    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = [
      "basic-info",
      "details",
      "location",
      "media",
      "operating-hours",
      "options",
    ];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const hasTabErrors = (tabId: string): boolean => {
    switch (tabId) {
      case "basic-info":
        return !!(
          errors.name ||
          errors.addressLine ||
          errors.location ||
          errors.postalCode ||
          errors.timezoneOffset ||
          errors.originalPrice ||
          errors.keywords ||
          errors.image ||
          errors.isBestSeller ||
          errors.isCancellable ||
          errors.isGTRecommend ||
          errors.isInstantConfirmation ||
          errors.isOpenDated
        );
      case "details":
        return !!(
          errors.description ||
          errors.whatToExpect ||
          errors.termsAndConditions ||
          errors.exclusions ||
          errors.exclusions_mm ||
          errors.highlights ||
          errors.highlights_mm ||
          errors.howToUseList ||
          errors.howToUseList_mm ||
          errors.inclusions ||
          errors.inclusions_mm ||
          errors.thingsToNote
        );
      case "location":
        return !!(errors.latitude || errors.longitude);
      case "media":
        return !!errors.image;
      case "operating-hours":
        // Check if operatingHours has validation issues
        return !!errors.operatingHours;
      case "options":
        // Check if productOptions has validation issues
        return !!errors.productOptions;
      default:
        return false;
    }
  };

  const submitHandler = async (values: TicketFormValues) => {
    // Validate all fields before final submission
    const isValid = await trigger();

    if (!isValid) {
      // Optionally switch to the first tab with errors
      const tabs = [
        "basic-info",
        "details",
        "location",
        "media",
        "operating-hours",
        "options",
      ];
      for (const tab of tabs) {
        if (hasTabErrors(tab)) {
          setCurrentTab(tab);
          break;
        }
      }
      return;
    }

    // Process main image upload if it's a local file
    let processedImage = values.image;
    if (
      processedImage &&
      (processedImage.startsWith("blob:") || processedImage.startsWith("data:"))
    ) {
      // Get the file from the main image ref
      if (mainImageRef.current) {
        const fileToUpload = mainImageRef.current.getFileToUpload();
        if (fileToUpload) {
          try {
            const result = await getSignedUrlAndImageDataUpload(
              fileToUpload,
              "PRODUCT_MEDIA"
            );
            if (result.status === 200 && result.url) {
              // Update the image with the new URL
              processedImage = result.url;
            }
          } catch (error) {
            console.error("Error uploading main image:", error);
          }
        }
      }
    }

    // Process media uploads if media exists
    let processedMedia = values.media || [];

    // Process each media item to upload to S3 if needed
    if (processedMedia && Array.isArray(processedMedia)) {
      for (let i = 0; i < processedMedia.length; i++) {
        const mediaItem = processedMedia[i];

        // Check if this media item has a local file that needs to be uploaded
        if (
          mediaItem?.path &&
          (mediaItem.path.startsWith("blob:") ||
            mediaItem.path.startsWith("data:"))
        ) {
          // Get the file from the ref if available
          const mediaRef = mediaItemRefs.current.get(i);
          if (mediaRef) {
            const fileToUpload = mediaRef.getFileToUpload();
            if (fileToUpload) {
              try {
                const result = await getSignedUrlAndImageDataUpload(
                  fileToUpload,
                  "PRODUCT_MEDIA"
                );
                if (result.status === 200 && result.url) {
                  // Update the media item with the new URL
                  processedMedia[i] = { ...mediaItem, path: result.url };
                }
              } catch (error) {
                console.error(`Error uploading media item ${i}:`, error);
              }
            }
          }
        }
      }
    }
    const payload = {
      ...values,
      image: processedImage, // Use the processed image
      media: processedMedia, // Use the processed media
      productOptions: values.productOptions.map((d) => {
        return {
          ...d,
          ticketTypes: d.ticketTypes.map((t) => {
            return {
              ticketTypeId: t.ticketTypeId,
              dhSellingPrice: t.dhSellingPrice || 0,
              dhRecommendedSellingPrice: t.dhRecommendedSellingPrice || 0,
              dhNetPrice: t.dhNetPrice || 0,
              dhMinimumSellingPrice: t.dhMinimumSellingPrice || 0,
            };
          }),
        };
      }),
    };
    onSubmit(payload);
  };

  const TabButton = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setCurrentTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative ${
        currentTab === id
          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
          : "text-gray-600 hover:bg-gray-50 border border-transparent"
      }`}
    >
      {tabIcons[id as keyof typeof tabIcons]}
      {label}
      {hasTabErrors(id) && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-xs text-white">!</span>
        </span>
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Validation Summary - Shows validation errors at the top */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium flex items-center gap-2">
            <span className="font-bold">⚠️ Validation Errors:</span>
          </h4>
          <ul className="mt-2 space-y-1 text-red-700 text-sm">
            {Object.entries(errors).map(
              ([key, error]) =>
                error?.message && (
                  <li key={key} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      {key}: {error.message.toString()}
                    </span>
                  </li>
                )
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-col items-end">
        <Button
          type="submit"
          loading={loading}
          className="flex items-center gap-2"
          // disabled={!isDirty || (currentTab === "options" && Object.keys(errors).length > 0)}
        >
          {isEdit ? <>Save Changes</> : <>Create Ticket</>}
        </Button>
      </div>

      {/* Custom Tabs Navigation - Modern style with error indicators */}
      <div className="flex flex-wrap gap-3 border-b pb-4">
        <TabButton id="basic-info" label="Basic Info" />
        <TabButton id="details" label="Details" />
        <TabButton id="location" label="Location" />
        <TabButton id="media" label="Media" />
        <TabButton id="operating-hours" label="Operating Hours" />
        <TabButton id="options" label="Pricing & Packages" />
      </div>

      <div className="p-6 border rounded-xl min-h-125 bg-white shadow-sm relative">
        {/* Error indicator for current tab */}
        {hasTabErrors(currentTab) && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
            <span className="mr-1">⚠️</span> Errors
          </div>
        )}

        <div
          style={{ display: currentTab === "basic-info" ? "block" : "none" }}
        >
          <BasicInfoTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
            imageRef={mainImageRef}
          />
        </div>

        <div style={{ display: currentTab === "location" ? "block" : "none" }}>
          <LocationTab
            control={control}
            errors={errors}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
          />
        </div>

        <div style={{ display: currentTab === "details" ? "block" : "none" }}>
          <DetailsTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
          />
        </div>

        {/* Media Tab */}
        <div style={{ display: currentTab === "media" ? "block" : "none" }}>
          <MediaTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
            setMediaItemRef={setMediaItemRef}
          />
        </div>

        {/* Operating Hours Tab */}
        <div
          style={{
            display: currentTab === "operating-hours" ? "block" : "none",
          }}
        >
          <OperatingHoursTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
          />
        </div>

        {/* Options Tab */}
        <div style={{ display: currentTab === "options" ? "block" : "none" }}>
          <OptionsTab
            control={control}
            errors={errors}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            trigger={trigger}
            mode={mode}
            initialValues={initialValues as UpdateProductPayloadT}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={prevTab}
          disabled={currentTab === "basic-info"}
          className="flex items-center gap-2"
        >
          ← Previous
        </Button>

        {currentTab !== "options" ? (
          <Button
            type="button"
            onClick={nextTab}
            className="flex items-center gap-2"
          >
            Next →
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default TicketEditForm;
