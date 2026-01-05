"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { CountryT } from "@/types/country.type";
import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import { bool } from "@/util/initData";

type Props = {
  initialValues: CountryT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { id: string; isPublished: boolean }) => void;
};

export default function CountryEditForm({
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
      {/* Country info (read-only) */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Country Name" value={initialValues.name} />
        <ReadOnly label="Code" value={initialValues.code} />
        <ReadOnly label="Mobile Prefix" value={initialValues.mobilePrefix} />
        <ReadOnly label="Currency" value={initialValues.currency.code} />
        <ReadOnly
          label="Credit Card Fee"
          value={`${initialValues.currency.creditCardFee}%`}
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

      {/* Flags */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Billing" value={bool(initialValues.isBilling)} />
        <ReadOnly
          label="Currency Exchange"
          value={bool(initialValues.isCurrencyExchange)}
        />
        <ReadOnly
          label="Distribution Table"
          value={bool(initialValues.isDistributionTable)}
        />
        <ReadOnly label="Listing" value={bool(initialValues.isListing)} />
      </div>

      {/* Editable field */}
      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
        <div>
          <p className="font-medium">Published</p>
          <p className="text-xs text-gray-500">
            Control country visibility in listings
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

