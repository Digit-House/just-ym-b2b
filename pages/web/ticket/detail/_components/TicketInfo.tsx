function TicketInfo() {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow space-y-4">
      <h2 className="text-lg font-semibold">
        Safari World Tickets with Optional Marine Park and Lunch
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <InfoRow label="B2B Rate" value="THB 650" />
        <InfoRow label="Suggested Retail" value="THB 750" />
        <InfoRow label="Commission" value="15%" />
        <InfoRow label="Allotment" value="Available" highlight />
        <InfoRow label="Valid Dates" value="1/1/2025 - 1/6/2025" />
        <InfoRow label="Blackout Dates" value="None" badge />
      </div>
    </div>
  );
}

export default TicketInfo;

function InfoRow({ label, value, highlight, badge }: any) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-medium ${highlight ? "text-indigo-600" : ""}`}>
        {badge ? (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            {value}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
