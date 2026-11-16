import { HotelRoomRatePaymentTypeT } from "@/types/hotel.type";
import { getPriceBreakdown } from "@/lib/hotelPriceBreakdown";
import { formatPrice } from "@/lib/utils";

type Props = {
  payment?: HotelRoomRatePaymentTypeT | null;
  nights: number;
  rooms: number;
  /** useUser().user?.type === "OWNER"; the API also nulls the owner fields for others. */
  isOwner: boolean;
};

const taxLabel = (name: string) => {
  const words = name.replace(/[_-]/g, " ").trim();
  return words.length <= 3
    ? words.toUpperCase()
    : words.replace(/\b\w/g, (c) => c.toUpperCase());
};

// Shared by the room sidebar and the checkout summary: price rows, total, pay-at-hotel
// box and OWNER box. Total Payment is show_amount untouched.
const PriceBreakdown = ({ payment, nights, rooms, isOwner }: Props) => {
  const total = Number(payment?.show_amount);
  const hasTotal = !!payment?.show_amount && Number.isFinite(total);
  const currency = payment?.show_currency_code;
  const b = hasTotal
    ? getPriceBreakdown({
        total,
        bar: payment?.bar_show_amount,
        nights,
        rooms,
        taxes: payment?.tax_data?.taxes,
      })
    : null;
  const nightsRooms = b
    ? `${b.nights} night${b.nights !== 1 ? "s" : ""} × ${b.rooms} room${b.rooms !== 1 ? "s" : ""}`
    : "";
  const showOwner =
    isOwner &&
    payment?.settlement_show_amount != null &&
    payment?.markup_show_amount != null;

  return (
    <div className="flex flex-col gap-3">
      {b && (
        <div className="flex flex-col gap-2 text-sm">
          {b.barAmount !== null && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500">Price at hotel</span>
              <span className="text-gray-400 line-through">
                {formatPrice(b.barAmount, "THB")}
              </span>
            </div>
          )}
          {b.roomAmount !== null ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-gray-800">Room price</span>
                  <span className="text-xs text-gray-500">{nightsRooms}</span>
                </div>
                <span className="text-gray-800 shrink-0">
                  {formatPrice(b.roomAmount, currency)}
                </span>
              </div>
              {b.includedThbTaxes.map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="flex items-start justify-between gap-2 text-gray-500"
                >
                  <span>+ {taxLabel(t.name)}</span>
                  <span className="shrink-0 text-gray-800">
                    {formatPrice(t.amount, currency)}
                  </span>
                </div>
              ))}
              {b.includedOtherTaxes.map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="flex items-start justify-between gap-2 text-gray-500"
                >
                  <span>
                    + {taxLabel(t.name)} <span className="text-xs">(incl.)</span>
                  </span>
                  <span className="shrink-0 text-gray-800">
                    {formatPrice(t.amount, t.currency_code)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              <span className="text-gray-500">{nightsRooms}</span>
              {b.includedTaxes.map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="flex items-start justify-between gap-2 text-xs text-gray-400"
                >
                  <span>Includes taxes: {taxLabel(t.name)}</span>
                  <span className="shrink-0">
                    {formatPrice(t.amount, t.currency_code)}
                  </span>
                </div>
              ))}
            </>
          )}
          {b.saving !== null && (
            <div>
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                You save {formatPrice(b.saving, "THB")} ({b.savingPercent}%)
              </span>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <p className="font-semibold text-gray-900">Total Payment</p>
        <p className="font-bold text-gray-900">
          {hasTotal ? formatPrice(total, currency) : "—"}
        </p>
      </div>

      {b && b.payAtHotelTaxes.length > 0 && (
        <div className="rounded-xl border border-gray-200 px-4 py-3 flex items-start justify-between gap-3 text-xs text-gray-500">
          <span>Pay at hotel (not in total)</span>
          <div className="flex flex-col items-end gap-0.5 text-gray-800">
            {b.payAtHotelTaxes.map((t, i) => (
              <span key={`${t.name}-${i}`}>
                {taxLabel(t.name)} {formatPrice(t.amount, t.currency_code)}
              </span>
            ))}
          </div>
        </div>
      )}

      {showOwner && (
        <div className="rounded-xl bg-gray-100 px-4 py-3 text-xs text-gray-500 flex flex-col gap-1.5">
          <p className="font-semibold text-gray-700">Owner only</p>
          <div className="flex items-center justify-between">
            <span>Supplier net</span>
            <span className="text-gray-800">
              {formatPrice(payment?.settlement_show_amount, "THB")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>
              Markup
              {payment?.markup_percent != null
                ? ` (${Math.round(payment.markup_percent)}%)`
                : ""}
            </span>
            <span className="text-gray-800">
              {formatPrice(payment?.markup_show_amount, "THB")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
