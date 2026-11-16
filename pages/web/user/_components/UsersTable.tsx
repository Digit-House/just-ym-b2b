import { UserManagementT } from "@/types/user.type";
import UserRow from "./UserRow";
import EmptyState from "@/components/EmptyState";


export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: {
  users: UserManagementT[];
  onEdit: (u: UserManagementT) => void;
  onDelete: (u: UserManagementT) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-x-scroll">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-indigo-50 text-slate-600">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4">Last Login</th>
           <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10">
                <EmptyState size={128} title="No users found" />
              </td>
            </tr>
          ) : (
            users.map((u) => (
              //@ts-ignore
              <UserRow
                key={u.id}
                user={u}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
