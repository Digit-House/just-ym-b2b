"use client";

import { useState, useEffect } from "react";
import { CurrencyRateT } from "@/types/currencyRate.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateCurrencyRate } from "@/graphql/currencyRate";

type Props = {
  initialValues: CurrencyRateT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function CurrencyRateForm({
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [mmkRate, setMmkRate] = useState(initialValues.mmk);

  useEffect(() => {
    setMmkRate(initialValues.mmk);
  }, [initialValues]);

  const handleSubmit = async () => {
    try {
      await updateCurrencyRate(Number(mmkRate));
      toast.success("Currency rate updated successfully!");
      onSubmit();
    } catch (error) {
      toast.error("Failed to update currency rate");
      console.error("Error updating currency rate:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mmkRate">MMK to THB Rate <span className="text-red-500">*</span></Label>
          <Input
            id="mmkRate"
            type="number"
            step="any"
            value={mmkRate}
            onChange={(e) => setMmkRate(e.target.value)}
            placeholder="Enter THB to MMK exchange rate"
          />
          <p className="mt-1 text-xs text-gray-500">
            Current rate: 1 THB = {mmkRate} MMK
          </p>
        </div>
        
        <div className="text-sm p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Information</h3>
          <p className="text-gray-600">
            This rate determines how much Myanmar Kyat (MMK) is equivalent to 1 Thai Baht (THB).
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={handleSubmit}
          disabled={loading || !mmkRate}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}