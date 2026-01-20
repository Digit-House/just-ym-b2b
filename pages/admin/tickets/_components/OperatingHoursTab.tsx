import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import {
  ProductInfoT,
  FixedDayT,
  UpdateProductPayloadT,
} from "@/types/product.type";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type OperatingHoursTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

const OperatingHoursTab: React.FC<OperatingHoursTabProps> = ({
  control,
  errors,
  initialValues,
}) => {
  const [fixedDays, setFixedDays] = useState<FixedDayT[]>(() => {
    const days =
      (initialValues as UpdateProductPayloadT)?.operatingHours?.fixedDays;

    if (!Array.isArray(days)) return [];

    return days.map((day) => ({
      day: day.day ?? "",
      startHour: day.startHour ?? "",
      endHour: day.endHour ?? "",
    }));
  });

  const updateFixedDay = (
    index: number,
    field: keyof FixedDayT,
    value: string
  ) => {
    setFixedDays((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-indigo-600">🕒</span>
          Operating Hours
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure the ticket's operating schedule
        </p>
      </div>

      {/* Custom Hours */}
      <Controller
        name="operatingHours.custom"
        control={control}
        render={({ field }) => (
          <InputField
            label="Custom Hours"
            {...field}
            placeholder="e.g. Mon–Fri 9AM–5PM"
          />
        )}
      />

      {/* Tours & Activities */}
      <div
        className={`p-4 rounded-lg border ${
          errors.operatingHours?.isToursActivities
            ? "bg-red-50 border-red-300"
            : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Tours & Activities</Label>
            <p className="text-sm text-gray-500">
              Enable if this ticket includes tours or activities
            </p>
          </div>
          <Controller
            name="operatingHours.isToursActivities"
            control={control}
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      {/* Fixed Days (Read-only structure, editable values) */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Fixed Days</h4>

        {fixedDays.length === 0 && (
          <p className="text-sm text-gray-500">
            No fixed days configured.
          </p>
        )}

        {fixedDays.map((day, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4 ${
              errors.operatingHours?.fixedDays?.[index]
                ? "bg-red-50 border-red-300"
                : ""
            }`}
          >
            <InputField
              label="Day"
              value={day.day}
              onChange={(e) =>
                updateFixedDay(index, "day", e.target.value)
              }
              placeholder="Monday"
            />

            <InputField
              label="Start Time"
              value={day.startHour}
              onChange={(e) =>
                updateFixedDay(index, "startHour", e.target.value)
              }
              placeholder="09:00"
            />

            <InputField
              label="End Time"
              value={day.endHour}
              onChange={(e) =>
                updateFixedDay(index, "endHour", e.target.value)
              }
              placeholder="17:00"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatingHoursTab;
