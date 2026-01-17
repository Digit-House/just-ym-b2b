import { QrCode, Upload, X, Eye } from "lucide-react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { useImagePreview } from "@/hooks/useImagePreview";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Props = {
  qrCodeUrl: string;
  bankName: string;
  accountName: string;
  control: any;
  files?: File[];
  onRemoveFile: (index: number) => void;
};

export const QRCodeSection = ({ 
  qrCodeUrl, 
  bankName, 
  accountName,
  control,
  files = [],
  onRemoveFile
}: Props) => {
  const { previewImage, previewFile, openPreview, closePreview } = useImagePreview();

  const handlePreview = async (file: File) => {
    const result = openPreview(file);
    
    if (result.error) {
      toast.error(result.error);
    }
  };

  const isValidImageType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  // Keep the existing validation in file input onChange for batch validation

  return (
    <div className="space-y-8">
      {/* QR Code Payment Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black mb-6">QR Code Payment</h3>
        
        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for payment" 
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                  <QrCode size={48} className="text-gray-300" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              Scan this QR code with your mobile banking app to make payment
            </p>
          </div>

          {/* Bank Information */}
          <div className="space-y-4">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Bank Name
              </p>
              <p className="text-sm font-black text-gray-900">{bankName || "N/A"}</p>
            </div>
            
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Account Name
              </p>
              <p className="text-sm font-black text-gray-900">{accountName || "N/A"}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h4 className="font-black text-blue-900 mb-2">Payment Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Open your mobile banking app</li>
              <li>• Select "Scan QR" or similar option</li>
              <li>• Scan the QR code above</li>
              <li>• Enter the exact amount shown</li>
              <li>• Confirm and complete the payment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Payment Proof */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black mb-6">
          Upload Payment Proof <span className="text-red-500 text-sm">*</span>
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
                  accept=".jpeg,.jpg,.png"
                  onChange={(e) => {
                    const newFiles = Array.from(
                      e.target.files || []
                    );
                    
                    // Validate each file before adding
                    const validFiles = newFiles.filter(file => {
                      if (!isValidImageType(file)) {
                        toast.error(`${file.name}: Please upload only JPEG or PNG images`);
                        return false;
                      }
                      
                      const maxSize = 5 * 1024 * 1024;
                      if (file.size > maxSize) {
                        toast.error(`${file.name}: File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
                        return false;
                      }
                      
                      return true;
                    });
                    
                    if (validFiles.length > 0) {
                      field.onChange([
                        ...(field.value || []),
                        ...validFiles,
                      ]);
                    }
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

              {/* File list with preview */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl group hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-indigo-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-indigo-400 font-bold">
                          {(file.size / 1024).toFixed(2)} KB
                          <span className="ml-2 text-green-600">• Image</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Preview button for images */}
                        {file.type.startsWith('image/') && (
                          <button
                            type="button"
                            onClick={() => handlePreview(file)}
                            className="p-2 rounded-lg hover:bg-white text-indigo-600 transition-colors"
                            title="Preview image"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => onRemoveFile(index)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        />
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={previewImage}
        fileName={previewFile?.name || ""}
        fileSize={previewFile?.size || 0}
        onClose={closePreview}
      />
    </div>
  );
};