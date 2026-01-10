import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Calendar, MapPin, Clock } from "lucide-react";
import { TicketFormValues, ticketSchema } from "@/types/schema/ticketSchema";
import { ProductInfoT, ProductOptionT, TicketTypeT, FixedDayT } from "@/types/product.type";
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

  // State for dynamic arrays
  const [exclusions, setExclusions] = useState<string[]>(initialValues?.exclusions ?? []);
  const [highlights, setHighlights] = useState<string[]>(initialValues?.highlights ?? []);
  const [howToUseList, setHowToUseList] = useState<string[]>(initialValues?.howToUseList ?? []);
  const [inclusions, setInclusions] = useState<string[]>(initialValues?.inclusions ?? []);
  const [thingsToNote, setThingsToNote] = useState<string[]>(initialValues?.thingsToNote ?? []);
  const [blockedDates, setBlockedDates] = useState(initialValues?.blockedDate ?? []);
  const [mediaItems, setMediaItems] = useState(initialValues?.media ?? []);
  const [fixedDays, setFixedDays] = useState<FixedDayT[]>(initialValues?.operatingHours.fixedDays ?? []);

  // Tab navigation
  const nextTab = () => {
    const tabs = ["basic-info", "details", "media", "operating-hours", "options"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["basic-info", "details", "media", "operating-hours", "options"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  // Simple tab navigation buttons
  const TabButton = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setCurrentTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        currentTab === id
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  // Array management functions
  const addToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string = "") => {
    setter(prev => [...prev, value]);
  };

  const removeFromArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateArrayValue = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addBlockedDate = () => {
    setBlockedDates(prev => [...prev, { date: "", title: "" }]);
  };

  const removeBlockedDate = (index: number) => {
    setBlockedDates(prev => prev.filter((_, i) => i !== index));
  };

  const updateBlockedDate = (index: number, field: keyof typeof blockedDates[0], value: string) => {
    setBlockedDates(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addMediaItem = () => {
    setMediaItems(prev => [...prev, { extension: "", name: "", path: "", size: 0, type: "" }]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateMediaItem = (index: number, field: keyof typeof mediaItems[0], value: string | number) => {
    setMediaItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addFixedDay = () => {
    setFixedDays(prev => [...prev, { day: "", startHour: "", endHour: "" }]);
  };

  const removeFixedDay = (index: number) => {
    setFixedDays(prev => prev.filter((_, i) => i !== index));
  };

  const updateFixedDay = (index: number, field: keyof FixedDayT, value: string) => {
    setFixedDays(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
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
        fixedDays
      }
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Custom Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <TabButton id="basic-info" label="Basic Info" />
        <TabButton id="details" label="Details" />
        <TabButton id="media" label="Media" />
        <TabButton id="operating-hours" label="Operating Hours" />
        <TabButton id="options" label="Options" />
      </div>

      <div className="p-4 border rounded-lg min-h-[400px]">
        {/* Basic Info Tab */}
        {currentTab === "basic-info" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Name"
                {...register("name")}
                errMsg={errors.name?.message}
              />
              
              <InputField
                label="Category"
                {...register("category")}
                errMsg={errors.category?.message}
              />
              
              <InputField
                label="Address Line"
                {...register("addressLine")}
                errMsg={errors.addressLine?.message}
              />
              
              <InputField
                label="Location"
                {...register("location")}
                errMsg={errors.location?.message}
              />
              
              <InputField
                label="City"
                {...register("city")}
                errMsg={errors.city?.message}
              />
              
              <InputField
                label="Postal Code"
                {...register("postalCode")}
                errMsg={errors.postalCode?.message}
              />
              
              <InputField
                label="Country ID"
                {...register("countryId")}
                errMsg={errors.countryId?.message}
              />
              
              <InputField
                label="City ID"
                type="number"
                {...register("cityId", { valueAsNumber: true })}
                errMsg={errors.cityId?.message}
              />
              
              <InputField
                label="City Relation ID"
                {...register("city_relation_id")}
                errMsg={errors.city_relation_id?.message}
              />
              
              <InputField
                label="Latitude"
                type="number"
                {...register("latitude", { valueAsNumber: true })}
                errMsg={errors.latitude?.message}
              />
              
              <InputField
                label="Longitude"
                type="number"
                {...register("longitude", { valueAsNumber: true })}
                errMsg={errors.longitude?.message}
              />
              
              <InputField
                label="Timezone Offset"
                type="number"
                {...register("timezoneOffset", { valueAsNumber: true })}
                errMsg={errors.timezoneOffset?.message}
              />
              
              <InputField
                label="Original Price"
                type="number"
                {...register("originalPrice", { valueAsNumber: true })}
                errMsg={errors.originalPrice?.message}
              />
              
              <InputField
                label="Keywords"
                {...register("keywords")}
                errMsg={errors.keywords?.message}
              />
              
              <InputField
                label="Image URL"
                {...register("image")}
                errMsg={errors.image?.message}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBestSeller"
                  checked={watch("isBestSeller")}
                  onCheckedChange={(checked) => setValue("isBestSeller", Boolean(checked))}
                />
                <Label htmlFor="isBestSeller">Is Best Seller</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCancellable"
                  checked={watch("isCancellable")}
                  onCheckedChange={(checked) => setValue("isCancellable", Boolean(checked))}
                />
                <Label htmlFor="isCancellable">Is Cancellable</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isGTRecommend"
                  checked={watch("isGTRecommend")}
                  onCheckedChange={(checked) => setValue("isGTRecommend", Boolean(checked))}
                />
                <Label htmlFor="isGTRecommend">Is GT Recommend</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isInstantConfirmation"
                  checked={watch("isInstantConfirmation")}
                  onCheckedChange={(checked) => setValue("isInstantConfirmation", Boolean(checked))}
                />
                <Label htmlFor="isInstantConfirmation">Is Instant Confirmation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOpenDated"
                  checked={watch("isOpenDated")}
                  onCheckedChange={(checked) => setValue("isOpenDated", Boolean(checked))}
                />
                <Label htmlFor="isOpenDated">Is Open Dated</Label>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {currentTab === "details" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Details</h3>
            
            <TextareaField
              label="Description"
              rows={4}
              {...register("description")}
              errMsg={errors.description?.message}
            />
            
            <TextareaField
              label="What To Expect"
              rows={4}
              {...register("whatToExpect")}
              errMsg={errors.whatToExpect?.message}
            />
            
            <TextareaField
              label="Terms & Conditions"
              rows={4}
              {...register("termsAndConditions")}
              errMsg={errors.termsAndConditions?.message}
            />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Highlights</Label>
                <Button type="button" onClick={() => addToArray(setHighlights)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Highlight
                </Button>
              </div>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <InputField
                    label={`Highlight ${index + 1}`}
                    value={highlight}
                    onChange={(e) => updateArrayValue(setHighlights, index, e.target.value)}
                    placeholder="Highlight"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeFromArray(setHighlights, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">How To Use List</Label>
                <Button type="button" onClick={() => addToArray(setHowToUseList)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add How To Use Item
                </Button>
              </div>
              {howToUseList.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <InputField
                    label={`How To Use ${index + 1}`}
                    value={item}
                    onChange={(e) => updateArrayValue(setHowToUseList, index, e.target.value)}
                    placeholder="How to use item"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeFromArray(setHowToUseList, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Inclusions</Label>
                <Button type="button" onClick={() => addToArray(setInclusions)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Inclusion
                </Button>
              </div>
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <InputField
                    label={`Inclusion ${index + 1}`}
                    value={inclusion}
                    onChange={(e) => updateArrayValue(setInclusions, index, e.target.value)}
                    placeholder="Inclusion"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeFromArray(setInclusions, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Exclusions</Label>
                <Button type="button" onClick={() => addToArray(setExclusions)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Exclusion
                </Button>
              </div>
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2">
                  <InputField
                    label={`Exclusion ${index + 1}`}
                    value={exclusion}
                    onChange={(e) => updateArrayValue(setExclusions, index, e.target.value)}
                    placeholder="Exclusion"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeFromArray(setExclusions, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Things To Note</Label>
                <Button type="button" onClick={() => addToArray(setThingsToNote)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Note
                </Button>
              </div>
              {thingsToNote.map((note, index) => (
                <div key={index} className="flex gap-2">
                  <InputField
                    label={`Thing To Note ${index + 1}`}
                    value={note}
                    onChange={(e) => updateArrayValue(setThingsToNote, index, e.target.value)}
                    placeholder="Thing to note"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeFromArray(setThingsToNote, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Blocked Dates</Label>
                <Button type="button" onClick={addBlockedDate} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Blocked Date
                </Button>
              </div>
              {blockedDates.map((date, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <InputField
                    label={`Date ${index + 1}`}
                    value={date.date}
                    onChange={(e) => updateBlockedDate(index, "date", e.target.value)}
                    placeholder="Date (YYYY-MM-DD)"
                  />
                  <div className="flex gap-2">
                    <InputField
                      label={`Title ${index + 1}`}
                      value={date.title}
                      onChange={(e) => updateBlockedDate(index, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeBlockedDate(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {currentTab === "media" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media</h3>
            
            <ImageUpload
              label="Main Image"
              value={watch("image")}
              onChange={(val) => setValue("image", val)}
              errMsg={errors.image?.message}
              folderType="PRODUCT_MEDIA"
            />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Additional Media Items</Label>
                <Button type="button" onClick={addMediaItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Media Item
                </Button>
              </div>
              {mediaItems.map((media, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <InputField
                    label={`Path ${index + 1}`}
                    value={media.path}
                    onChange={(e) => updateMediaItem(index, "path", e.target.value)}
                    placeholder="Image Path"
                  />
                  <InputField
                    label={`Name ${index + 1}`}
                    value={media.name}
                    onChange={(e) => updateMediaItem(index, "name", e.target.value)}
                    placeholder="Name"
                  />
                  <InputField
                    label={`Extension ${index + 1}`}
                    value={media.extension}
                    onChange={(e) => updateMediaItem(index, "extension", e.target.value)}
                    placeholder="Extension"
                  />
                  <div className="flex gap-2">
                    <InputField
                      label={`Size ${index + 1}`}
                      type="number"
                      value={media.size}
                      onChange={(e) => updateMediaItem(index, "size", parseInt(e.target.value))}
                      placeholder="Size"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeMediaItem(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours Tab */}
        {currentTab === "operating-hours" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operating Hours</h3>
            
            <div className="space-y-2">
              <InputField
                label="Custom Hours"
                {...register("operatingHours.custom")}
                placeholder="Custom operating hours"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isToursActivities"
                checked={watch("operatingHours.isToursActivities") || false}
                onCheckedChange={(checked) => setValue("operatingHours.isToursActivities", checked)}
              />
              <Label htmlFor="isToursActivities">Is Tours Activities</Label>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Fixed Days</Label>
                <Button type="button" onClick={addFixedDay} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Day
                </Button>
              </div>
              {fixedDays.map((day, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <InputField
                    label={`Day ${index + 1}`}
                    value={day.day}
                    onChange={(e) => updateFixedDay(index, "day", e.target.value)}
                    placeholder="Day (e.g., Monday)"
                  />
                  <InputField
                    label={`Start Hour ${index + 1}`}
                    value={day.startHour}
                    onChange={(e) => updateFixedDay(index, "startHour", e.target.value)}
                    placeholder="Start Hour (HH:MM)"
                  />
                  <div className="flex gap-2">
                    <InputField
                      label={`End Hour ${index + 1}`}
                      value={day.endHour}
                      onChange={(e) => updateFixedDay(index, "endHour", e.target.value)}
                      placeholder="End Hour (HH:MM)"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeFixedDay(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options Tab */}
        {currentTab === "options" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Options</h3>
            <p className="text-sm text-gray-500">Product options can be managed separately in the product options section.</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevTab}
          disabled={currentTab === "basic-info"}
        >
          Previous
        </Button>
        
        {currentTab !== "options" ? (
          <Button 
            type="button" 
            onClick={nextTab}
          >
            Next
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading}
            >
              {isEdit ? "Update Ticket" : "Create Ticket"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default TicketEditForm;