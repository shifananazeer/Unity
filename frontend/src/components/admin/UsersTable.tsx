import React from "react";
import api from "../../services/api";

interface User {
  _id: string;
  fullName: string;

  role: string;
  isBlocked: boolean;
}

interface UsersTableProps {
  title: string;
  users: User[];
  refreshUsers: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  title,
  users,
  refreshUsers,
}) => {

  const toggleBlock = async (id: string) => {
    try {
      await api.patch(`/admin/users/block/${id}`);
      refreshUsers(); // reload users after block/unblock
    } catch (error) {
      console.error("Error updating user status");
    }
  };

  return (
    <div className="p-6">
      
      <h2 className="text-3xl font-bold mb-8 text-slate-900">{title}</h2>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full">

          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">

                  <td className="px-6 py-4 text-slate-900">{user.fullName}</td>

                

                  <td className="px-6 py-4 capitalize text-slate-700">{user.role}</td>

                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                        user.isBlocked
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default UsersTable;
