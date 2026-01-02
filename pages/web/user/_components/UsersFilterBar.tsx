import { UserRoleTypeT } from "@/types/user.type";
import * as Icons from "lucide-react";

const UsersFilterBar = ({
  type,
  onType,
  active,
  onActive,
  onAdd,
}: {
  type: UserRoleTypeT;
  onType: (type: UserRoleTypeT) => void;
  active: boolean | null;
  onActive: (active: boolean | null) => void;
  onAdd: () => void;
}) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-wrap justify-end items-center gap-4">
    {/* <div className="relative flex-1 items-center min-w-[300px]">
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
    </div> */}
    <select
      value={type}
      onChange={(v) => onType(v.target.value as UserRoleTypeT)}
      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
    >
      <option value={null}>All Roles</option>
      <option value={"RESELLER"}>Reseller</option>
      <option value={"MANAGER"}>Manager</option>
    </select>
    <select
      value={active === null ? "null" : active ? "true" : "false"}
      onChange={(v) => {
        onActive(
          v.target.value === "true"
            ? true
            : v.target.value === "false"
            ? false
            : null
        );
      }}
      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
    >
      <option value={null}>All Status</option>
      <option value={"true"}>Active</option>
      <option value={"false"}>Inactive</option>
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
