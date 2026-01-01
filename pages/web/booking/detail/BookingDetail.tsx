import React, { useState } from "react";
import Pagination from "@/components/Pagination";
import SummaryCard from "./_components/SummaryCard";
import PageContainer from "@/components/PageContainer";
import BackBtn from "@/components/BackBtn";

const TICKETS = Array.from({ length: 6 }).map((_, i) => ({
  id: `#TCK-1000${i + 1}`,
  type: "Adult",
  status: i === 0 ? "Used" : "Active",
}));

const getStatusClass = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Used":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const BookingDetail = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <PageContainer>
      <BackBtn route="/bookings" title="Back" />

      {/* Summary Card */}
      <SummaryCard />

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-indigo-50 text-gray-900 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ticket.id}
                </td>
                <td className="px-6 py-4">{ticket.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    disabled={ticket.status === "Used"}
                    className={`px-4 py-2 text-xs rounded-md font-medium ${
                      ticket.status === "Used"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    Download E-Voucher
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          page={page}
          pageSize={pageSize}
          total={1250}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
      </PageContainer>
  );
};

export default BookingDetail;
