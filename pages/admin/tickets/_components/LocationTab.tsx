import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";

type LocationTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

const LocationTab: React.FC<LocationTabProps> = ({
  control,
  errors,
}) => {
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Location Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Set the location for this ticket
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`space-y-3 ${
            errors.latitude
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <InputField
                label="Latitude"
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                errMsg={errors.latitude?.message}
                placeholder="Enter latitude"
              />
            )}
          />
        </div>
        <div
          className={`space-y-3 ${
            errors.longitude
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <InputField
                label="Longitude"
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                errMsg={errors.longitude?.message}
                placeholder="Enter longitude"
              />
            )}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
          Interactive Map
        </h4>

        <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p className="font-medium text-gray-900 mb-1">
            Location Map Preview
          </p>
          <p className="text-sm text-gray-500 mb-4">
            A map would be displayed here to allow location selection
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            onClick={() => {
              // In a real implementation, this would open a map modal
              // For now, we'll just show an alert
              alert("Map functionality would be implemented here");
            }}
          >
            Select Location on Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationTab;