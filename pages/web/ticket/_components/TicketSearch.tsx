import React from "react";
import { Search} from "lucide-react";
import { TicketFilters } from "@/hooks/useTicketFilter";

interface SearchUIProps {
  filters: TicketFilters;
  setFilters: React.Dispatch<React.SetStateAction<TicketFilters>>;
}

const TicketSearch: React.FC<SearchUIProps> = ({ filters, setFilters }) => {
  return (
    <div className="w-full  mt-0 relative z-10 bg-gray-200 p-4">
        <div className="relative m-auto w-[50%]">
          <Search className="absolute left-4 top-[33px] -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            placeholder="Search tickets..."
            className="w-full pl-10 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>
  );
};

export default TicketSearch;
