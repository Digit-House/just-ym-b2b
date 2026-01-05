"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import { CityT } from "@/types/cities.type";


type Props = {
  initialValues: CityT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { id: string; isPublished: boolean }) => void;
};

export default function CityEditForm({
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [isPublished, setIsPublished] = useState(
    initialValues.isPublished
  );

  return (
    <div className="space-y-6">
      {/* City info (read-only) */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="City Name" value={initialValues.name} />
        <ReadOnly
          label="Capital"
          value={initialValues.isCapital ? "Yes" : "No"}
        />
        <ReadOnly
          label="Timezone"
          value={`UTC ${initialValues.timezoneOffset >= 0 ? "+" : ""}${
            initialValues.timezoneOffset
          }`}
        />
        <ReadOnly
          label="Created At"
          value={new Date(initialValues.createdAt).toLocaleString()}
        />
        <ReadOnly
          label="Last Updated"
          value={new Date(initialValues.updatedAt).toLocaleString()}
        />
      </div>

      {/* Editable field */}
      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
        <div>
          <p className="font-medium">Published</p>
          <p className="text-xs text-gray-500">
            Control city visibility in listings
          </p>
        </div>
        <Switch
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() =>
            onSubmit({
              id: initialValues.id,
              isPublished,
            })
          }
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
