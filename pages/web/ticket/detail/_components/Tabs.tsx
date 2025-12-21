function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "highlights", label: "Highlights" },
    { id: "inclusion", label: "Inclusion" },
    { id: "terms", label: "Booking Terms" },
    { id: "notes", label: "Special Notes" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-4">
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
        <li>Enjoy unlimited access to Safari World attractions.</li>
        <li>Special anniversary shows and experiences.</li>
        <li>Perfect for families and groups.</li>
      </ul>
    </div>
  );
}

export default Tabs;
