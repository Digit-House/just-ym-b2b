import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useCities } from "@/hooks/useCities";

type BasicInfoTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT;
};

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  control,
  errors,
  watch,
  setValue,
  mode,
  initialValues,
}) => {
  const isEdit = mode === "edit";

  // Fetch categories and cities
  const { data: categories = [] } = useCategories({ limit: 50, page: 1 });
  const { data: citiesData } = useCities({
    countryId: watch("countryId") || "",
    limit: 50,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: true,
    search: undefined,
  });

  // Extract cities from the response
  const cities = citiesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-indigo-600"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Basic Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter the fundamental details about the ticket
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`space-y-3 ${
            errors.name
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                label="Ticket Name"
                {...field}
                errMsg={errors.name?.message}
                placeholder="Enter ticket name"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.category
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${errors.category ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message?.toString()}
            </p>
          )}
        </div>

        <div
          className={`space-y-3 ${
            errors.addressLine
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="addressLine"
            control={control}
            render={({ field }) => (
              <InputField
                label="Address Line"
                {...field}
                errMsg={errors.addressLine?.message}
                placeholder="Enter address"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.location
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <InputField
                label="Location"
                {...field}
                errMsg={errors.location?.message}
                placeholder="Enter location"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.city
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Label>City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${errors.city ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">
              {errors.city.message?.toString()}
            </p>
          )}
        </div>

        <div
          className={`space-y-3 ${
            errors.postalCode
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <InputField
                label="Postal Code"
                {...field}
                errMsg={errors.postalCode?.message}
                placeholder="Enter postal code"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.timezoneOffset
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="timezoneOffset"
            control={control}
            render={({ field }) => (
              <InputField
                label="Timezone Offset"
                type="number"
                {...field}
                value={field.value || ""}
                errMsg={errors.timezoneOffset?.message}
                placeholder="Enter timezone offset"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.originalPrice
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="originalPrice"
            control={control}
            render={({ field }) => (
              <InputField
                label="Original Price"
                type="number"
                {...field}
                value={field.value || ""}
                errMsg={errors.originalPrice?.message}
                placeholder="Enter original price"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.keywords
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <InputField
                label="Keywords"
                {...field}
                errMsg={errors.keywords?.message}
                placeholder="Enter keywords separated by commas"
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.image
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <InputField
                label="Image URL"
                {...field}
                errMsg={errors.image?.message}
                placeholder="Enter image URL"
              />
            )}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
          Features & Attributes
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              errors.isBestSeller
                ? "bg-red-50 border border-red-300"
                : "bg-gray-50"
            }`}
          >
            <Controller
              name="isBestSeller"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isBestSeller"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
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

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              errors.isCancellable
                ? "bg-red-50 border border-red-300"
                : "bg-gray-50"
            }`}
          >
            <Controller
              name="isCancellable"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isCancellable"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div>
              <Label htmlFor="isCancellable" className="font-medium">
                Cancellable
              </Label>
              <p className="text-xs text-gray-500">Allow cancellations</p>
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              errors.isGTRecommend
                ? "bg-red-50 border border-red-300"
                : "bg-gray-50"
            }`}
          >
            <Controller
              name="isGTRecommend"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isGTRecommend"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
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

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              errors.isInstantConfirmation
                ? "bg-red-50 border border-red-300"
                : "bg-gray-50"
            }`}
          >
            <Controller
              name="isInstantConfirmation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isInstantConfirmation"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
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

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              errors.isOpenDated
                ? "bg-red-50 border border-red-300"
                : "bg-gray-50"
            }`}
          >
            <Controller
              name="isOpenDated"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isOpenDated"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
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
  );
};

export default BasicInfoTab;