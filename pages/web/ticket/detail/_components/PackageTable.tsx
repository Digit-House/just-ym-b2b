function PackageTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Package</th>
            <th className="p-4">Net Price</th>
            <th className="p-4">Suggested Retail</th>
            <th className="p-4">Commission</th>
            <th className="p-4">Allotment</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Safari Park Only", "650", "750", "15%", "20/day"],
            ["Safari + Marine Park", "850", "950", "18%", "15/day"],
            ["Safari + Marine + Lunch", "950", "1000", "20%", "10/day"],
          ].map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="p-4 text-center first:text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PackageTable;
