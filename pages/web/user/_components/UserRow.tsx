import * as Icons from "lucide-react";
import dayjs from "dayjs";
import { UserManagementT } from "@/types/user.type";

type Props = {
  user: UserManagementT;
  onEdit: (user: UserManagementT) => void;
  onDelete: (user: UserManagementT) => void;
};

// ✅ Date formatter using library
const formatDateTime = (date?: string) => {
  if (!date) return "—";
  return dayjs(date).format("YYYY MMM DD HH:mm");
};

export default function UserRow({ user, onEdit, onDelete }: Props) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">
              {user.username}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              Joined {formatDateTime(user.createdAt)}
            </p>
          </div>
        </div>
      </td>

      {/* Contact Column */}
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Icons.Mail size={12} className="text-slate-400" />
            <span className="text-xs font-medium">{user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Icons.Phone size={12} className="text-slate-400" />
            <span className="text-xs font-medium">
              {user.contactNo || "------"}
            </span>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-5">
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
            user.roles[0].name === "ADMIN"
              ? "bg-green-100 text-green-700"
              : user.roles[0].name === "MANAGER"
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {user.roles[0].name}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-5 text-center">
        <div className="inline-flex items-center gap-1.5 bg-slate-100/50 px-2 py-1 rounded-full border border-slate-100">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              user.active ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-[10px] font-bold ${
              user.active ? "text-green-600" : "text-red-600"
            }`}
          >
            {user.active ? "Active" : "Inactive"}
          </span>
        </div>
      </td>

      {/* Last Login */}
      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-800 mb-0.5">
          {formatDateTime(user.lastLogin)}
        </p>
        <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
          Last: {formatDateTime(user.lastLogin)}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
          >
            <Icons.Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Icons.Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
