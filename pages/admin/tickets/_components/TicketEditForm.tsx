import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Minus,
  Calendar,
  MapPin,
  Clock,
  Info,
  MapPinIcon,
  DollarSign,
  Tag,
  Star,
  ShieldCheck,
  AlertCircle,
  DeleteIcon,
  Trash2,
  NotebookIcon,
} from "lucide-react";
import { TicketFormValues, ticketSchema } from "@/types/schema/ticketSchema";
import {
  ProductInfoT,
  ProductOptionT,
  TicketTypeT,
  FixedDayT,
} from "@/types/product.type";
import { ImageUpload } from "@/components/ImageUpload";

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
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form;

  const [currentTab, setCurrentTab] = useState("basic-info");

  // Icon mapping for tabs
  const tabIcons = {
    "basic-info": <Info className="h-4 w-4" />,
    details: <MapPinIcon className="h-4 w-4" />,
    media: <MapPin className="h-4 w-4" />,
    "operating-hours": <Clock className="h-4 w-4" />,
    options: <Tag className="h-4 w-4" />,
  };

  // State for dynamic arrays
  const [exclusions, setExclusions] = useState<string[]>(
    initialValues?.exclusions ?? []
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialValues?.highlights ?? []
  );
  const [howToUseList, setHowToUseList] = useState<string[]>(
    initialValues?.howToUseList ?? []
  );
  const [inclusions, setInclusions] = useState<string[]>(
    initialValues?.inclusions ?? []
  );
  const [thingsToNote, setThingsToNote] = useState<string[]>(
    initialValues?.thingsToNote ?? []
  );
  const [blockedDates, setBlockedDates] = useState(
    initialValues?.blockedDate ?? []
  );
  const [mediaItems, setMediaItems] = useState(initialValues?.media ?? []);
  const [fixedDays, setFixedDays] = useState<FixedDayT[]>(
    initialValues?.operatingHours.fixedDays ?? []
  );

  // Tab navigation
  const nextTab = () => {
    const tabs = [
      "basic-info",
      "details",
      "media",
      "operating-hours",
      "options",
    ];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = [
      "basic-info",
      "details",
      "media",
      "operating-hours",
      "options",
    ];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  // Improved tab navigation buttons
  const TabButton = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setCurrentTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        currentTab === id
          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
          : "text-gray-600 hover:bg-gray-50 border border-transparent"
      }`}
    >
      {tabIcons[id as keyof typeof tabIcons]}
      {label}
    </button>
  );

  // Array management functions
  const addToArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string = ""
  ) => {
    setter((prev) => [...prev, value]);
  };

  const removeFromArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayValue = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addBlockedDate = () => {
    setBlockedDates((prev) => [...prev, { date: "", title: "" }]);
  };

  const removeBlockedDate = (index: number) => {
    setBlockedDates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBlockedDate = (
    index: number,
    field: keyof (typeof blockedDates)[0],
    value: string
  ) => {
    setBlockedDates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addMediaItem = () => {
    setMediaItems((prev) => [
      ...prev,
      { extension: "", name: "", path: "", size: 0, type: "" },
    ]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMediaItem = (
    index: number,
    field: keyof (typeof mediaItems)[0],
    value: string | number
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addFixedDay = () => {
    setFixedDays((prev) => [...prev, { day: "", startHour: "", endHour: "" }]);
  };

  const removeFixedDay = (index: number) => {
    setFixedDays((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFixedDay = (
    index: number,
    field: keyof FixedDayT,
    value: string
  ) => {
    setFixedDays((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const submitHandler = (values: TicketFormValues) => {
    // Update values with dynamic arrays
    const payload = {
      ...values,
      exclusions,
      highlights,
      howToUseList,
      inclusions,
      thingsToNote,
      blockedDate: blockedDates,
      media: mediaItems,
      operatingHours: {
        ...values.operatingHours,
        fixedDays,
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Custom Tabs Navigation - Modern style */}
      <div className="flex flex-wrap gap-3 border-b pb-4">
        <TabButton id="basic-info" label="Basic Info" />
        <TabButton id="details" label="Details" />
        <TabButton id="media" label="Media" />
        <TabButton id="operating-hours" label="Operating Hours" />
        <TabButton id="options" label="Options" />
      </div>

      <div className="p-6 border rounded-xl min-h-[500px] bg-white shadow-sm">
        {/* Basic Info Tab */}
        {currentTab === "basic-info" && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-600" />
                Basic Information
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter the fundamental details about the ticket
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Ticket Name"
                {...register("name")}
                errMsg={errors.name?.message}
                placeholder="Enter ticket name"
              />
              //i want to change select for category
              <InputField
                label="Category"
                {...register("category")}
                errMsg={errors.category?.message}
                placeholder="Enter category"
              />
              <InputField
                label="Address Line"
                {...register("addressLine")}
                errMsg={errors.addressLine?.message}
                placeholder="Enter address"
              />
              <InputField
                label="Location"
                {...register("location")}
                errMsg={errors.location?.message}
                placeholder="Enter location"
              />
              //i want to change select for this city
              <InputField
                label="City"
                {...register("city")}
                errMsg={errors.city?.message}
                placeholder="Enter city"
              />
              <InputField
                label="Postal Code"
                {...register("postalCode")}
                errMsg={errors.postalCode?.message}
                placeholder="Enter postal code"
              />
              //we don't need
              {/* <InputField
                label="Country ID"
                {...register("countryId")}
                errMsg={errors.countryId?.message}
                placeholder="Enter country ID"
              /> */}
              {/* <InputField
                label="City ID"
                type="number"
                {...register("cityId", { valueAsNumber: true })}
                errMsg={errors.cityId?.message}
                placeholder="Enter city ID"
              /> */}
              {/* <InputField
                label="City Relation ID"
                {...register("city_relation_id")}
                errMsg={errors.city_relation_id?.message}
                placeholder="Enter city relation ID"
              /> */}
              //i want to make another tabs for loation and i want to add map
              that can change map click and custom input for latitue and
              longitude
              <InputField
                label="Latitude"
                type="number"
                {...register("latitude", { valueAsNumber: true })}
                errMsg={errors.latitude?.message}
                placeholder="Enter latitude"
              />
              <InputField
                label="Longitude"
                type="number"
                {...register("longitude", { valueAsNumber: true })}
                errMsg={errors.longitude?.message}
                placeholder="Enter longitude"
              />
              <InputField
                label="Timezone Offset"
                type="number"
                {...register("timezoneOffset", { valueAsNumber: true })}
                errMsg={errors.timezoneOffset?.message}
                placeholder="Enter timezone offset"
              />
              <InputField
                label="Original Price"
                type="number"
                {...register("originalPrice", { valueAsNumber: true })}
                errMsg={errors.originalPrice?.message}
                placeholder="Enter original price"
              />
              <InputField
                label="Keywords"
                {...register("keywords")}
                errMsg={errors.keywords?.message}
                placeholder="Enter keywords separated by commas"
              />
              <InputField
                label="Image URL"
                {...register("image")}
                errMsg={errors.image?.message}
                placeholder="Enter image URL"
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                Features & Attributes
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isBestSeller"
                    checked={watch("isBestSeller")}
                    onCheckedChange={(checked) =>
                      setValue("isBestSeller", Boolean(checked))
                    }
                  />
                  <div>
                    <Label htmlFor="isBestSeller" className="font-medium">
                      Best Seller
                    </Label>
                    <p className="text-xs text-gray-500">
                      Mark as best selling ticket
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isCancellable"
                    checked={watch("isCancellable")}
                    onCheckedChange={(checked) =>
                      setValue("isCancellable", Boolean(checked))
                    }
                  />
                  <div>
                    <Label htmlFor="isCancellable" className="font-medium">
                      Cancellable
                    </Label>
                    <p className="text-xs text-gray-500">Allow cancellations</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isGTRecommend"
                    checked={watch("isGTRecommend")}
                    onCheckedChange={(checked) =>
                      setValue("isGTRecommend", Boolean(checked))
                    }
                  />
                  <div>
                    <Label htmlFor="isGTRecommend" className="font-medium">
                      GT Recommend
                    </Label>
                    <p className="text-xs text-gray-500">
                      GlobalTix recommendation
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isInstantConfirmation"
                    checked={watch("isInstantConfirmation")}
                    onCheckedChange={(checked) =>
                      setValue("isInstantConfirmation", Boolean(checked))
                    }
                  />
                  <div>
                    <Label
                      htmlFor="isInstantConfirmation"
                      className="font-medium"
                    >
                      Instant Confirmation
                    </Label>
                    <p className="text-xs text-gray-500">
                      Provide instant booking confirmation
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isOpenDated"
                    checked={watch("isOpenDated")}
                    onCheckedChange={(checked) =>
                      setValue("isOpenDated", Boolean(checked))
                    }
                  />
                  <div>
                    <Label htmlFor="isOpenDated" className="font-medium">
                      Open Dated
                    </Label>
                    <p className="text-xs text-gray-500">
                      Allow flexible dates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {currentTab === "details" && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-indigo-600" />
                Detailed Information
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Provide comprehensive details about the ticket
              </p>
            </div>

            <div className="space-y-6">
              <TextareaField
                label="Description"
                rows={5}
                {...register("description")}
                errMsg={errors.description?.message}
                placeholder="Enter a detailed description of the ticket..."
              />

              <TextareaField
                label="What To Expect"
                rows={5}
                {...register("whatToExpect")}
                errMsg={errors.whatToExpect?.message}
                placeholder="Describe what customers can expect from this ticket..."
              />

              <TextareaField
                label="Terms & Conditions"
                rows={5}
                {...register("termsAndConditions")}
                errMsg={errors.termsAndConditions?.message}
                placeholder="Enter terms and conditions for this ticket..."
              />
            </div>

            <div className="border-t pt-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                  <NotebookIcon className="h-5 w-5 text-green-500"  />
                    <h4 className="text-lg font-medium">Highlights</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addToArray(setHighlights)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Highlight
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 rounded-lg w-full"
                    >
                      <InputField
                        value={highlight}
                        onChange={(e) =>
                          updateArrayValue(setHighlights, index, e.target.value)
                        }
                        placeholder="Enter highlight"
                        className="w-full! rounded-md "
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setHighlights, index)}
                        className="text-red-500  hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                  <NotebookIcon className="h-5 w-5 text-green-500"  />
                    <h4 className="text-lg font-medium">How To Use</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addToArray(setHowToUseList)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Instruction
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {howToUseList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 rounded-lg w-full"
                    >
                      <InputField
                        value={item}
                        onChange={(e) =>
                          updateArrayValue(
                            setHowToUseList,
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter instruction"
                        className="w-full! rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setHowToUseList, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                  <NotebookIcon className="h-5 w-5 text-green-500"  />
                    <h4 className="text-lg font-medium">Inclusions</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addToArray(setInclusions)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Inclusion
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {inclusions.map((inclusion, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 rounded-lg w-full"
                    >
                      <InputField
                        value={inclusion}
                        onChange={(e) =>
                          updateArrayValue(setInclusions, index, e.target.value)
                        }
                        placeholder="Enter inclusion"
                        className="w-full! rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setInclusions, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                  <NotebookIcon className="h-5 w-5 text-green-500"  />
                    <h4 className="text-lg font-medium">Exclusions</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addToArray(setExclusions)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Exclusion
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {exclusions.map((exclusion, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 rounded-lg w-full"
                    >
                      <InputField
                        value={exclusion}
                        onChange={(e) =>
                          updateArrayValue(setExclusions, index, e.target.value)
                        }
                        placeholder="Enter exclusion"
                        className="w-full! rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setExclusions, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <NotebookIcon className="h-5 w-5 text-green-500"  />
                    <h4 className="text-lg font-medium">Things To Note</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addToArray(setThingsToNote)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Note
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {thingsToNote.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 rounded-lg w-full"
                    >
                      <InputField
                        value={note}
                        onChange={(e) =>
                          updateArrayValue(
                            setThingsToNote,
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter note"
                        className="w-full! rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setThingsToNote, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <h4 className="text-lg font-medium">Blocked Dates</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={addBlockedDate}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Date
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {blockedDates.map((date, index) => (
                    <div
                      key={index}
                      className="p-4  rounded-lg border  grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <InputField
                        label="Date"
                        type="datetime-local"
                        value={date.date}
                        onChange={(e) =>
                          updateBlockedDate(index, "date", e.target.value)
                        }
                        placeholder="YYYY-MM-DD"
                      />
                      <div className="flex gap-3">
                        <InputField
                          label="Title"
                          value={date.title}
                          onChange={(e) =>
                            updateBlockedDate(index, "title", e.target.value)
                          }
                          placeholder="Event title"
                          className="grow"
                        />
                        <div className="flex items-end pb-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBlockedDate(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {currentTab === "media" && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Media & Images
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage the ticket's visual content
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <ImageUpload
                  label="Main Image"
                  value={watch("image")}
                  onChange={(val) => setValue("image", val)}
                  errMsg={errors.image?.message}
                  folderType="PRODUCT_MEDIA"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <h4 className="text-lg font-medium">
                      Additional Media Items
                    </h4>
                  </div>
                  <Button
                    type="button"
                    onClick={addMediaItem}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Media
                  </Button>
                </div>

                <div className="space-y-4">
                  {mediaItems.map((media, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      <div>
                        <Label>Image Path</Label>
                        <InputField
                          label="Image Path"
                          value={media.path}
                          onChange={(e) =>
                            updateMediaItem(index, "path", e.target.value)
                          }
                          placeholder="Image path"
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <InputField
                          label="Name"
                          value={media.name}
                          onChange={(e) =>
                            updateMediaItem(index, "name", e.target.value)
                          }
                          placeholder="Name"
                        />
                      </div>
                      <div>
                        <Label>Extension</Label>
                        <InputField
                          label="Extension"
                          value={media.extension}
                          onChange={(e) =>
                            updateMediaItem(index, "extension", e.target.value)
                          }
                          placeholder="Extension"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-grow">
                          <Label>Size (bytes)</Label>
                          <InputField
                            label="Size (bytes)"
                            type="number"
                            value={media.size}
                            onChange={(e) =>
                              updateMediaItem(
                                index,
                                "size",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="Size"
                          />
                        </div>
                        <div className="flex items-end pb-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMediaItem(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operating Hours Tab */}
        {currentTab === "operating-hours" && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Operating Hours
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure the ticket's operating schedule
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <InputField
                    label="Custom Hours"
                    {...register("operatingHours.custom")}
                    placeholder="Enter custom operating hours (e.g. Mon-Fri 9AM-5PM)"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isToursActivities" className="font-medium">
                      Tours & Activities
                    </Label>
                    <p className="text-sm text-gray-500">
                      Enable if this ticket includes tours or activities
                    </p>
                  </div>
                  <Switch
                    id="isToursActivities"
                    checked={watch("operatingHours.isToursActivities") || false}
                    onCheckedChange={(checked) =>
                      setValue("operatingHours.isToursActivities", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h4 className="text-lg font-medium">Fixed Days</h4>
                  </div>
                  <Button
                    type="button"
                    onClick={addFixedDay}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Day
                  </Button>
                </div>

                <div className="space-y-4">
                  {fixedDays.map((day, index) => (
                    <div
                      key={index}
                      className="p-4  rounded-lg border  grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div>
                        <InputField
                          label="Day"
                          value={day.day}
                          onChange={(e) =>
                            updateFixedDay(index, "day", e.target.value)
                          }
                          placeholder="Day (e.g., Monday)"
                        />
                      </div>
                      <div>
                        <InputField
                          label="Start Time"
                          value={day.startHour}
                          onChange={(e) =>
                            updateFixedDay(index, "startHour", e.target.value)
                          }
                          placeholder="Start Hour (HH:MM)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-grow">
                          <InputField
                            label="End Time"
                            value={day.endHour}
                            onChange={(e) =>
                              updateFixedDay(index, "endHour", e.target.value)
                            }
                            placeholder="End Hour (HH:MM)"
                          />
                        </div>
                        <div className="flex items-end pb-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFixedDay(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Options Tab */}
        {currentTab === "options" && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                Product Options
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage the ticket's product options
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <Tag className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                Product Options Management
              </h4>
              <p className="text-gray-600 mb-4">
                Product options can be managed separately in the product options
                section. This section provides a summary of the current options.
              </p>
              <div className="inline-flex flex-wrap gap-2 justify-center">
                {initialValues?.productOptions &&
                initialValues.productOptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                    {initialValues.productOptions.map((option, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-lg border border-gray-200 text-left"
                      >
                        <h5 className="font-medium text-gray-900">
                          {option.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                        {option.ticketType && option.ticketType.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Original Price: $
                            {option.ticketType[0]?.originalPrice || "N/A"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No product options configured for this ticket
                  </p>
                )}
              </div>
            </div>
          </div>
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
