"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import { TopUpHistoryT } from "@/types/wallet.type";


type TopUpStatus = "CONFIRMED" | "PENDING" | "REJECTED";

type Props = {
  initialValues: TopUpHistoryT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { id: string; status: TopUpStatus }) => void;
};

export default function TopUpEditForm({
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<TopUpStatus>(
    initialValues.status as TopUpStatus
  );

  return (
    <div className="space-y-6">
      {/* Top-up info (read-only) */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Reseller" value={initialValues.reseller?.name} />
        <ReadOnly
          label="Top-up Amount"
          value={initialValues.topUpBalance.toLocaleString()}
        />
        <ReadOnly label="Currency" value={initialValues.currency} />
        <ReadOnly label="Created By" value={initialValues.createdBy?.email} />
        <ReadOnly label="Created At" value={new Date(initialValues.createdAt).toLocaleString()} />
        <ReadOnly label="Last Updated" value={new Date(initialValues.updatedAt).toLocaleString()} />
      </div>

      {/* Editable field */}
      <div className="space-y-2">
        <p className="font-medium text-sm">Status</p>

        <div className="flex gap-3">
          {(["CONFIRMED", "PENDING", "REJECTED"] as TopUpStatus[]).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                  status === value
                    ? value === "CONFIRMED"
                      ? "bg-green-100 border-green-500 text-green-700"
                      : value === "PENDING"
                      ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                      : "bg-red-100 border-red-500 text-red-700"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {value}
              </button>
            )
          )}
        </div>

        <p className="text-xs text-gray-500">
          Changing status will affect reseller balance and audit records
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          loading={loading}
          disabled={status === initialValues.status}
          onClick={() =>
            onSubmit({
              id: initialValues.id,
              status,
            })
          }
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
