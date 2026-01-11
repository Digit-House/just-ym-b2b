import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Info,
  MapPinIcon,
  Tag,
  Locate,
} from "lucide-react";
import { TicketFormValues, ticketSchema } from "@/types/schema/ticketSchema";
import {
  ProductInfoT,
} from "@/types/product.type";
import BasicInfoTab from "./BasicInfoTab";
import LocationTab from "./LocationTab";
import DetailsTab from "./DetailsTab";
import MediaTab from "./MediaTab";
import OperatingHoursTab from "./OperatingHoursTab";
import OptionsTab from "./OptionsTab";


type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: ProductInfoT;
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

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      id: initialValues?.id ?? "",
      name: initialValues?.name ?? "",
      category: initialValues?.category ?? "",
      description: initialValues?.description ?? "",
      whatToExpect: initialValues?.whatToExpect ?? "",
      addressLine: initialValues?.addressLine ?? "",
      location: initialValues?.location ?? "",
      postalCode: initialValues?.postalCode ?? "",
      city: initialValues?.city ?? "",
      cityId: initialValues?.cityId ?? 0,
      city_relation_id: initialValues?.city_relation_id ?? "",
      countryId: initialValues?.countryId ?? "",
      latitude: initialValues?.latitude ?? 0,
      longitude: initialValues?.longitude ?? 0,
      keywords: initialValues?.keywords ?? "",
      image: initialValues?.image ?? "",
      exclusions: initialValues?.exclusions ?? [],
      highlights: initialValues?.highlights ?? [],
      howToUseList: initialValues?.howToUseList ?? [],
      inclusions: initialValues?.inclusions ?? [],
      thingsToNote: initialValues?.thingsToNote ?? [],
      isBestSeller: initialValues?.isBestSeller ?? false,
      isCancellable: initialValues?.isCancellable ?? false,
      isGTRecommend: initialValues?.isGTRecommend ?? false,
      isInstantConfirmation: initialValues?.isInstantConfirmation ?? false,
      isOpenDated: initialValues?.isOpenDated ?? false,
      originalPrice: initialValues?.originalPrice ?? 0,
      timezoneOffset: initialValues?.timezoneOffset ?? 0,
      blockedDate: initialValues?.blockedDate ?? [],
      media: initialValues?.media ?? [],
      operatingHours: initialValues?.operatingHours ?? {
        custom: null,
        isToursActivities: null,
        fixedDays: [],
      },
      termsAndConditions: initialValues?.termsAndConditions ?? "",
      productOptions: initialValues?.productOptions ?? [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
  } = form;

  const [currentTab, setCurrentTab] = useState("basic-info");

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
          "category",
          "addressLine",
          "location",
          "city",
          "postalCode",
          "timezoneOffset",
          "originalPrice",
          "keywords",
          "image",
          "isBestSeller",
          "isCancellable",
          "isGTRecommend",
          "isInstantConfirmation",
          "isOpenDated"
        ];
      case "details":
        return [
          "description",
          "whatToExpect",
          "termsAndConditions"
        ];
      case "location":
        return [
          "latitude",
          "longitude"
        ];
      case "media":
        return [
          "image"
        ];
      case "operating-hours":
        return [
          "operatingHours"
        ];
      case "options":
        return [
          "productOptions"
        ];
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
          errors.category ||
          errors.addressLine ||
          errors.location ||
          errors.city ||
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
          errors.termsAndConditions
        );
      case "location":
        return !!(errors.latitude || errors.longitude);
      case "media":
        return !!errors.image;
      case "operating-hours":
        // Check if operatingHours has validation issues
        return !!(errors.operatingHours);
      case "options":
        // Check if productOptions has validation issues
        return !!(errors.productOptions);
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

    // Update values with dynamic arrays
    const payload = {
      ...values,
      exclusions: values.exclusions || [],
      highlights: values.highlights || [],
      howToUseList: values.howToUseList || [],
      inclusions: values.inclusions || [],
      thingsToNote: values.thingsToNote || [],
      blockedDate: values.blockedDate || [],
      media: values.media || [],
      operatingHours: {
        ...values.operatingHours,
        fixedDays: values.operatingHours?.fixedDays || [],
      },
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

      {/* Custom Tabs Navigation - Modern style with error indicators */}
      <div className="flex flex-wrap gap-3 border-b pb-4">
        <TabButton id="basic-info" label="Basic Info" />
        <TabButton id="details" label="Details" />
        <TabButton id="location" label="Location" />
        <TabButton id="media" label="Media" />
        <TabButton id="operating-hours" label="Operating Hours" />
        <TabButton id="options" label="Pricing & Packages" />
      </div>

      <div className="p-6 border rounded-xl min-h-[500px] bg-white shadow-sm relative">
        {/* Error indicator for current tab */}
        {hasTabErrors(currentTab) && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
            <span className="mr-1">⚠️</span> Errors
          </div>
        )}

        {/* Basic Info Tab */}
        {currentTab === "basic-info" && (
          <BasicInfoTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}

        {/* Location Tab */}
        {currentTab === "location" && (
          <LocationTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}

        {/* Details Tab */}
        {currentTab === "details" && (
          <DetailsTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}

        {/* Media Tab */}
        {currentTab === "media" && (
          <MediaTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}

        {/* Operating Hours Tab */}
        {currentTab === "operating-hours" && (
          <OperatingHoursTab
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}

        {/* Options Tab */}
        {currentTab === "options" && (
          <OptionsTab
            control={control}
            errors={errors}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            mode={mode}
            initialValues={initialValues}
          />
        )}
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
            <Button
              type="submit"
              loading={loading}
              className="flex items-center gap-2"
            >
              {isEdit ? <>Save Changes</> : <>Create Ticket</>}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default TicketEditForm;