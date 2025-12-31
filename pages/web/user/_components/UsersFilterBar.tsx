import React from "react";
import * as Icons from "lucide-react";

const UsersFilterBar = ({
  searchTerm,
  onSearch,
  onAdd,
}: {
  searchTerm: string;
  onSearch: (value: string) => void;
  onAdd: () => void;
}) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-wrap items-center gap-4">
    <div className="relative flex-1 items-center min-w-[300px]">
      <Icons.Search
        className="absolute left-4 top-3 text-slate-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
      />
    </div>
    <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
      <option>All Roles</option>
      <option>Admin</option>
      <option>Manager</option>
      <option>Member</option>
    </select>
    <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
      <option>All Status</option>
      <option>Active</option>
      <option>Inactive</option>
    </select>
    <button
      onClick={() => onAdd()}
      className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
    >
      <Icons.Plus size={18} />
      Add User
    </button>
  </div>
);
export default UsersFilterBar;
