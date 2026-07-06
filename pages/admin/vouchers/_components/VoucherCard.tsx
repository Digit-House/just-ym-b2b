import {
  VOUCHER_DATA_TYPE,
  VOUCHER_DISCOUNT_TYPE_ENUM,
} from "@/types/voucher.type";
import { formatDate } from "date-fns";
import {
  Calendar,
  CircleAlert,
  CircleCheckBig,
  Copy,
  Pen,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";

type Props = {
  data: VOUCHER_DATA_TYPE;
};

const handleCopyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied");
  } catch {
    toast.error("Failed to copy code");
  }
};

const VoucherCard = ({ data }: Props) => {
  const [showCodes, setShowCodes] = useState(false);

  return (
    <div className="w-full bg-white border-2 border-[#F5F5F5] p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{data.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {data.description}
          </p>
        </div>
        <Link
          to={`/admin-vouchers/${data.id}`}
          className="text-indigo-700 hover:text-indigo-400 transition-all duration-300 p-3"
        >
          <Pen size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-sm text-gray-500">Discount</h5>
          <p className="font-bold text-base">
            {data.discountType === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE
              ? `${data.discountValue}% OFF Up to ${data.maximumAmount} THB`
              : `${data.discountValue} THB OFF`}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm text-gray-500">Min. Purchase</h5>
          <p className="font-bold text-base">{data.minPurchase} THB</p>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm text-gray-500">Usage Limit</h5>
          <p className="font-bold text-base">{data.usageLimit}</p>
        </div>
        {data.isCodeOnly && (
          <div className="flex flex-col gap-1">
            <h5 className="text-sm text-gray-500">Used Count</h5>
            <p className="font-bold text-base">{data.usedCount}</p>
          </div>
        )}
        {!data.specialDay && !data.isCodeOnly && (
          <div className="flex flex-col gap-1">
            <h5 className="text-sm text-gray-500">Valid Date</h5>
            <p className="font-bold text-base">
              {formatDate(data.endDate, "dd/MM/yyyy")}
            </p>
          </div>
        )}
      </div>

      <div className="py-2 border-t border-[#E0E0E0] flex gap-4 items-center">
        <div
          className={`flex items-center gap-1 py-1 px-3 rounded-full ${
            data.active ? "bg-[#E8F5E9]" : "bg-[#FFEBEE]"
          }`}
        >
          {data.active ? (
            <CircleCheckBig size={12} className="text-[#4CAF50]" />
          ) : (
            <CircleAlert size={12} className="text-[#D32F2F]" />
          )}
          <p
            className={`text-sm font-bold ${
              data.active ? "text-[#4CAF50]" : "text-[#D32F2F]"
            }`}
          >
            {data.active ? "Active" : "Inactive"}
          </p>
        </div>
        {data.specialDay && (
          <div className="flex items-center gap-1 py-1 px-3 rounded-full bg-[#FFF3E0]">
            <Calendar size={12} className="text-[#F57C00]" />
            <p className="text-sm font-bold capitalize text-[#F57C00]">
              {data.specialDay.toLowerCase()}
            </p>
          </div>
        )}

        {data.isCodeOnly && (
          <button
            type="button"
            onClick={() => setShowCodes(true)}
            className="flex items-center gap-1 py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            <Ticket size={12} />
            <span className="text-sm font-bold">View Codes</span>
          </button>
        )}
      </div>

      {showCodes && (
        <ModalWrapper title="Codes" onClose={() => setShowCodes(false)}>
          <div className="flex flex-col gap-2">
            {data.codes.length === 0 && (
              <p className="text-sm text-gray-500">No codes generated yet.</p>
            )}

            {data.codes.map((code) => (
              <div
                key={code.id}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                  !code.redeemedAt ? "bg-indigo-100" : "bg-[#FFEBEE]"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    !code.redeemedAt ? "text-indigo-700" : "text-[#D32F2F]"
                  }`}
                >
                  {code.code}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyCode(code.code)}
                  disabled={code.redeemedAt ? true : false}
                  title={!code.redeemedAt ? "Copy code" : "Code inactive"}
                  className={
                    !code.redeemedAt
                      ? "text-indigo-700 hover:text-indigo-900 transition-all duration-300"
                      : "text-[#D32F2F] opacity-50 cursor-not-allowed"
                  }
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default VoucherCard;
