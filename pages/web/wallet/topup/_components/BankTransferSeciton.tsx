import { Upload, X } from "lucide-react";
import { Controller } from "react-hook-form";
import { BankDetailRow } from "./BankDetailRow";

type Props = {
  control: any;
  files?: File[];
  onRemoveFile: (index: number) => void;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;
  instructions?: string;
};

export const BankTransferSection = ({
  control,
  files = [],
  onRemoveFile,
  bankName,
  accountName,
  accountNumber,
  swiftCode,
  instructions,
}: Props) => {
  return (
    <div className="space-y-8">
      {/* Bank details */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black mb-6">
          Bank Transfer Details
        </h3>

        <div className="space-y-4">
          <BankDetailRow label="Bank Name" value={bankName || "KBZ Bank"} />
          <BankDetailRow label="Account Name" value={accountName || "JustYm Services Ltd"} />
          <BankDetailRow
            label="Account Number"
            value={accountNumber || "1234 5678 1928 19283"}
          />
          {swiftCode && (
            <BankDetailRow label="SWIFT Code" value={swiftCode} />
          )}
          
          {instructions && (
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h4 className="font-black text-blue-900 mb-2">Payment Instructions</h4>
              <p className="text-sm text-blue-700">{instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload proof */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black mb-6">
          Upload Payment Proof
        </h3>

        <Controller
          name="proofFiles"
          control={control}
          render={({ field }) => (
            <>
              {/* Upload box */}
              <label className="border-4 border-dashed border-gray-100 rounded-3xl p-12 flex flex-col items-center text-center cursor-pointer hover:border-indigo-200 transition">
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const newFiles = Array.from(
                      e.target.files || []
                    );
                    field.onChange([
                      ...(field.value || []),
                      ...newFiles,
                    ]);
                  }}
                />

                <Upload size={32} className="text-indigo-600 mb-4" />
                <p className="font-black">
                  Click to upload payment receipts
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG, PDF · Max 5 files · 5MB each
                </p>
              </label>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl"
                    >
                      <div>
                        <p className="text-sm font-black text-indigo-900">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-indigo-400 font-bold">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFile(index)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};
