import React, { useState } from "react";
import { BOOKINGS } from "../../../constants";
import { FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import { useCountries } from "@/hooks/useCountries";
import SortSelect, { SortOption } from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useNavigate } from "react-router-dom";

const STATUS = [
  {
    name: "Active",
    id: "1",
  },
  {
    name: "Expired",
    id: "1",
  },
];

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const total = BOOKINGS.length;

const Bookings = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [countries, setCountries] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  const { data: COUNTRIES } = useCountries();

  const paginatedBookings = BOOKINGS.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Near Expiry":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full mx-auto">
      <PageHeader
        title="My Bookings"
        des="Measure your advertising ROI and report website traffic."
      />
      <div className="flex items-center justify-between mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <div className="flex items-center">
          <Select
            label="Country"
            placeholder="Country"
            options={COUNTRIES}
            value={countries}
            onChange={setCountries}
            width="w-48"
          />
          <Select
            label="Status"
            placeholder="Status"
            options={STATUS}
            value={statuses}
            onChange={setStatuses}
            width="w-48"
          />
        </div>
        <SortSelect options={SORT_OPTION} value={sort} onChange={setSort} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Package
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Country
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Validity
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Sold Tickets
                  <br />
                  <span className="text-gray-400 normal-case">
                    (Adult / Child)
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Remaining
                  <br />
                  <span className="text-gray-400 normal-case">
                    (Adult / Child)
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {booking.package}
                  </td>
                  <td className="px-6 py-4">{booking.country}</td>
                  <td className="px-6 py-4">
                    {booking.validityStart} – {booking.validityEnd}
                  </td>
                  <td className="px-6 py-4">
                    {booking.sold} / {booking.totalSold}
                  </td>
                  <td className="px-6 py-4">
                    {booking.remaining} / {booking.totalRemaining}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => {
                        navigate(`/bookings/${booking.id}`)
                      }} className="text-indigo-600 hover:text-indigo-800">
                        <FileText size={18} />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1); 
          }}
        />
    </div>
  );
};

export default Bookings;
