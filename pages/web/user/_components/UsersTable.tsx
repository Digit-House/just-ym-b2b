import React from "react";
import { User } from "@/types/user.type";
import UserRow from "./UserRow";

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-indigo-50 text-slate-600">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4">Bookings</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow user={u} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
