import React from "react";
import UserRow from "./UserRow";
import { UserRoleT } from "@/types/user.type";

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: {
  users: UserRoleT[];
  onEdit: (u: UserRoleT) => void;
  onDelete: (u: UserRoleT) => void;
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
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-gray-500 text-sm"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              //@ts-ignore
              <UserRow key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}