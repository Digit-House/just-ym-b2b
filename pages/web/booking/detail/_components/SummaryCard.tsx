import { Download } from "lucide-react";

const Stat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}
    />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const SummaryCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Safari Park Only
          </h2>
          <p className="text-sm text-gray-500">
            Valid from : Oct 1 – Dec 31, 2025
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          <Download size={14} />
          Download E-Voucher
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <Stat
          label="Purchased Tickets"
          value={150}
          color="bg-indigo-100"
        />
        <Stat label="Used Tickets" value={50} color="bg-green-100" />
        <Stat
          label="Remaining Tickets"
          value={100}
          color="bg-yellow-100"
        />
      </div>

      {/* Progress */}
      <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-indigo-600"
          style={{ width: "66%" }}
        />
      </div>
    </div>
  );
};

export default SummaryCard;
