import React from 'react';
import Header from '../../components/Header';
import { BOOKINGS } from '../../constants';
import { FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const MyBookings = () => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Expired': return 'bg-red-100 text-red-700';
      case 'Near Expiry': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <Header 
        title="My Bookings" 
        subtitle="Measure your advertising ROI and report website traffic."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4">
             <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg block p-2.5">
               <option>Country</option>
             </select>
             <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg block p-2.5">
               <option>Status</option>
             </select>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
             Sort By: <span className="font-medium text-gray-900">Newest</span>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Package</th>
                <th scope="col" className="px-6 py-4 font-semibold">Country</th>
                <th scope="col" className="px-6 py-4 font-semibold">Validity</th>
                <th scope="col" className="px-6 py-4 font-semibold">Sold Tickets<br/><span className="text-gray-400 normal-case">(Adult / Child)</span></th>
                <th scope="col" className="px-6 py-4 font-semibold">Remaining<br/><span className="text-gray-400 normal-case">(Adult / Child)</span></th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((booking) => (
                <tr key={booking.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.package}</td>
                  <td className="px-6 py-4">{booking.country}</td>
                  <td className="px-6 py-4">{booking.validityStart} – {booking.validityEnd}</td>
                  <td className="px-6 py-4">{booking.sold} / {booking.totalSold}</td>
                  <td className="px-6 py-4">{booking.remaining} / {booking.totalRemaining}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-600 hover:text-indigo-800"><FileText size={18} /></button>
                      <button className="text-indigo-600 hover:text-indigo-800"><Download size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-end gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Result per page</span>
            <select className="border-none bg-transparent font-medium text-gray-900 focus:ring-0">
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <span>1-50 of 1,250</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
