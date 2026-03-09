import React from "react";
import { toggleUserBlock, toggleAdminBlock } from "../../services/superAdmin/authService";

interface User {
  _id: string;
  fullName: string;
  role: string;
  district?: string;
  isBlocked: boolean;
}

interface UsersTableProps {
  title: string;
  users: User[];
  refreshUsers: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;

  // optional edit support
  showEdit?: boolean;
  onEdit?: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  title,
  users,
  refreshUsers,
  page,
  totalPages,
  onPageChange,
  onSearchChange,
  showEdit = false,
  onEdit,
}) => {

  const toggleBlock = async (id: string, type: "user" | "admin") => {
    try {
      if (type === "user") {
        await toggleUserBlock(id);
      } else {
        await toggleAdminBlock(id);
      }

      refreshUsers();
    } catch (error) {
      console.error("Toggle block error", error);
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 rounded-lg px-3 py-2"
          onChange={(e) => {
            onPageChange(1);
            onSearchChange(e.target.value);
          }}
        />
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full">

          {/* TABLE HEADER */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
               <th className="px-6 py-4 font-semibold text-slate-700">District</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">

                  <td className="px-6 py-4 text-slate-900">
                    {user.fullName}
                  </td>

                  <td className="px-6 py-4 capitalize text-slate-700">
                    {user.role}
                  </td>

                    <td className="px-6 py-4 text-slate-900">
                    {user.district}
                  </td>

                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 flex gap-2">

                    {/* BLOCK BUTTON */}
                    <button
                      onClick={() =>
                        toggleBlock(
                          user._id,
                          user.role === "admin" ? "admin" : "user"
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        user.isBlocked
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {/* EDIT BUTTON (ONLY FOR ADMINS PAGE) */}
                    {showEdit && (
                      <button
                        onClick={() => onEdit?.(user)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default UsersTable;