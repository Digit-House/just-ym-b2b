import { QrCode } from "lucide-react";

type Props = {
  qrCodeUrl: string;
  bankName: string;
  accountNumber: string;
};

export const QRCodeSection = ({ qrCodeUrl, bankName, accountNumber }: Props) => {
  return (
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
              Account Number
            </p>
            <p className="text-sm font-black text-gray-900">{accountNumber || "N/A"}</p>
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
  );
};