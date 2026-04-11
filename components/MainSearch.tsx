import React from "react";
import { Search} from "lucide-react";

interface SearchUIProps {
  search:string;
  placeHolder:string;
  onClick:(search:string)=>void;
}

const MainSearch: React.FC<SearchUIProps> = ({search,placeHolder,onClick}) => {
  return (
    <div className="w-full  mt-0 relative z-10 bg-gray-200 p-4">
        <div className="relative m-auto w-[90%] md:w-[50%]">
          <Search className="absolute left-4 top-[33px] -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            value={search}
            onChange={(e) =>
              onClick(e.target.value)
            }
            placeholder={placeHolder}
            className="w-full pl-10 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>
  );
};

export default MainSearch;
