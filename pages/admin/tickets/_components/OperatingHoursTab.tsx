// pages/admin/tickets/_components/OperatingHoursTab.tsx
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, FixedDayT, UpdateProductPayloadT } from "@/types/product.type";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
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
  // State for fixed days - Handle nullable values from updated schema
  const [fixedDays, setFixedDays] = useState<FixedDayT[]>(() => {
    const initialFixedDays = (initialValues as UpdateProductPayloadT)?.operatingHours?.fixedDays;
    if (initialFixedDays && Array.isArray(initialFixedDays)) {
      // Convert potentially nullable FixedDay objects to FixedDayT with default values
      return initialFixedDays.map(day => ({
        day: day.day ?? "",
        startHour: day.startHour ?? "",
        endHour: day.endHour ?? ""
      }));
    }
    return [];
  });
  
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
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Operating Hours
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure the ticket's operating schedule
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div
            className={`${
              errors.operatingHours?.custom
                ? "border border-red-300 rounded-lg p-3 bg-red-50"
                : ""
            }`}
          >
            <Controller
              name="operatingHours.custom"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Custom Hours"
                  {...field}
                  placeholder="Enter custom operating hours (e.g. Mon-Fri 9AM-5PM)"
                />
              )}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            errors.operatingHours?.isToursActivities
              ? "bg-red-50 border-red-300"
              : "bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isToursActivities" className="font-medium">
                Tours & Activities
              </Label>
              <p className="text-sm text-gray-500">
                Enable if this ticket includes tours or activities
              </p>
            </div>
            <Controller
              name="operatingHours.isToursActivities"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isToursActivities"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
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
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <h4 className="text-lg font-medium">Fixed Days</h4>
            </div>
            <Button type="button" onClick={addFixedDay} size="sm" disabled>
              <Plus className="h-4 w-4 mr-1" /> Add Day
            </Button>
          </div>

          <div className="space-y-4">
            {fixedDays.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4 ${
                  errors.operatingHours?.fixedDays?.[index]
                    ? "bg-red-50 border-red-300"
                    : ""
                }`}
              >
                <div
                  className={`${
                    errors.operatingHours?.fixedDays?.[index]?.day
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <InputField
                    label="Day"
                    value={day.day}
                    onChange={(e) =>
                      updateFixedDay(index, "day", e.target.value)
                    }
                    placeholder="Day (e.g., Monday)"
                  />
                </div>
                <div
                  className={`${
                    errors.operatingHours?.fixedDays?.[index]?.startHour
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
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
                    <div
                      className={`${
                        errors.operatingHours?.fixedDays?.[index]?.endHour
                          ? "border border-red-300 rounded-lg p-2 bg-red-50"
                          : ""
                      }`}
                    >
                      <InputField
                        label="End Time"
                        value={day.endHour}
                        onChange={(e) =>
                          updateFixedDay(index, "endHour", e.target.value)
                        }
                        placeholder="End Hour (HH:MM)"
                      />
                    </div>
                  </div>
                  <div className="flex items-end pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFixedDay(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled
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
  );
};

export default OperatingHoursTab;