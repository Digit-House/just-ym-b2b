import React from "react";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
// REMOVED: react-leaflet imports
// ADDED: pigeon-maps
import { Map, Marker } from "pigeon-maps";

import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";

type LocationTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

// REMOVED: MapResizer component (Not needed for pigeon-maps)

const LocationTab: React.FC<LocationTabProps> = ({ control, errors }) => {
  const [latitude, longitude] = useWatch({
    control,
    name: ["latitude", "longitude"],
  });

  // Ensure we have valid numbers for the map, otherwise fallback to Bangkok
  const position: [number, number] =
    latitude != null && longitude != null
      ? [Number(latitude), Number(longitude)]
      : [13.7563, 100.5018];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="latitude"
          control={control}
          render={({ field }) => (
            <InputField
              label="Latitude"
              type="number"
              isRequired={true}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              errMsg={errors.latitude?.message}
            />
          )}
        />

        <Controller
          name="longitude"
          control={control}
          render={({ field }) => (
            <InputField
              label="Longitude"
              type="number"
              isRequired={true}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              errMsg={errors.longitude?.message}
            />
          )}
        />
      </div>

      {/* Map */}
      <div className="relative border rounded-xl overflow-hidden h-[350px] w-full">
        {/* Pigeon Maps Component */}
        <Map
          height={350} 
          center={position} 
          defaultZoom={14} 
          // You can add attribution if you want, or provider props for custom tiles
        >
          <Marker 
            width={40} 
            height={40} 
            anchor={position} 
          />
        </Map>
      </div>
    </div>
  );
};

export default LocationTab;