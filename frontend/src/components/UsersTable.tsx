import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCoordinatorChatModal from "./AdminCoordinatorChatModal";
import UserDetailsModal from "./UserDetailsModal";

export interface User {
  _id: string;
  fullName: string;
  role: string;
  district?: string;
  isBlocked: boolean;
  mobileNumber: string;
  coordinator?: {
    fullName: string;
    type: string;
  };
  admin?: {
    fullName: string;
  };
  type?: "nano" | "micro"; // optional, mainly for super admin
  area?: string;
  pin?: string;
}

interface UsersTableProps {
  title: string;
  users: User[];
  refreshUsers: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  toggleBlock?: (id: string, role: string) => Promise<void>;
  showEdit?: boolean;
  showDetails?: boolean;
  role: "coordinator" | "admin" | "superadmin";
  chatRole?: "coordinator" | "admin";
  onEdit?: (user: User) => void;
  showChat?: boolean;
  coordinatorType?: "nano" | "micro";
  showCoordinatorType?: boolean;
  showHierarchy?: boolean;
  showCoordinator?: boolean;
  showCoordinatorExtra?: boolean; // new prop
}

const UsersTable: React.FC<UsersTableProps> = ({
  title,
  users,
  refreshUsers,
  page,
  totalPages,
  onPageChange,
  onSearchChange,
  toggleBlock,
  role,
  showEdit = false,
  onEdit,
  showChat = false,
  showDetails = false,
  coordinatorType,
  showCoordinatorType = false,
  showHierarchy = false,
  showCoordinator = false,
  showCoordinatorExtra = false, // default false
}) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loggedInUserId =
    localStorage.getItem(role === "coordinator" ? "coordinatorId" : "adminId") ||
    "";

  const handleToggleBlock = async (id: string, role: string) => {
    if (!toggleBlock) return;
    await toggleBlock(id, role);
    refreshUsers();
  };

  const handleChat = (user: User) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setDetailsUser(user._id);
    setDetailsOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 rounded-lg px-3 py-2 w-full md:w-64"
          onChange={(e) => {
            onPageChange(1);
            onSearchChange(e.target.value);
          }}
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Phone</th>

              {showCoordinatorType && <th className="px-6 py-4">Type</th>}
              {coordinatorType && (
                <th className="px-6 py-4">
                  {coordinatorType === "nano" ? "Micro Coordinator" : "Nano Coordinator"}
                </th>
              )}
              {showHierarchy && (
                <>
                  <th className="px-6 py-4">Coordinator</th>
                  <th className="px-6 py-4">Admin</th>
                </>
              )}
              {showCoordinator && <th className="px-6 py-4">Coordinator</th>}

              {showCoordinatorExtra && <th className="px-6 py-4">Area / Pin</th>}

              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">{user.district || "-"}</td>
                <td className="px-6 py-4">{user.mobileNumber || "-"}</td>

                {showCoordinatorType && (
                  <td className="px-6 py-4 capitalize">{user.type || "-"}</td>
                )}
                {coordinatorType && (
                  <td className="px-6 py-4">
                    {user.coordinator
                      ? `${user.coordinator.fullName} - ${user.coordinator.type || "-"}`
                      : "-"}
                  </td>
                )}
                {showHierarchy && (
                  <>
                    <td className="px-6 py-4">
                      {user.coordinator
                        ? `${user.coordinator.fullName} - ${user.coordinator.type || "-"}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{user.admin?.fullName || "-"}</td>
                  </>
                )}
                {showCoordinator && (
                  <td className="px-6 py-4">
                    {user.coordinator
                      ? `${user.coordinator.fullName} - ${user.coordinator.type || "-"}`
                      : "-"}
                  </td>
                )}

                {showCoordinatorExtra && (
                  <td className="px-6 py-4">
                    {user.type === "micro" ? user.area || "-" : user.pin || "-"}
                  </td>
                )}

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
                  {toggleBlock && (
                    <button
                      onClick={() => handleToggleBlock(user._id, user.role)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}

                  {showEdit && (
                    <button
                      onClick={() => onEdit?.(user)}
                      className="px-3 py-1 rounded bg-blue-500 text-white"
                    >
                      Edit
                    </button>
                  )}

                  {showChat && role !== "superadmin" && ( // superadmin has no chat
                    <button
                      onClick={() => handleChat(user)}
                      className="px-3 py-1 rounded bg-green-500 text-white"
                    >
                      Chat
                    </button>
                  )}

                  {showDetails && (
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="px-3 py-1 rounded bg-purple-500 text-white"
                    >
                      Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="bg-white shadow rounded-lg p-4 border">
              <div className="font-semibold text-lg">{user.fullName}</div>
              <div className="text-sm text-gray-600 mt-1">Role: {user.role}</div>
              <div className="text-sm text-gray-600">District: {user.district || "-"}</div>

              {coordinatorType && (
                <div className="text-sm text-gray-600">
                  {user.coordinator
                    ? `Coordinator: ${user.coordinator.fullName} - ${user.coordinator.type || "-"}`
                    : "Coordinator: -"}
                </div>
              )}

              {showHierarchy && (
                <>
                  <div className="text-sm text-gray-600">
                    Coordinator: {user.coordinator?.fullName || "-"}
                    {user.coordinator?.type ? ` - ${user.coordinator.type}` : ""}
                  </div>
                  <div className="text-sm text-gray-600">Admin: {user.admin?.fullName || "-"}</div>
                </>
              )}

              {showCoordinatorExtra && (
                <div className="text-sm text-gray-600">
                  {user.type === "micro" ? `Area: ${user.area || "-"}` : `Pin: ${user.pin || "-"}`}
                </div>
              )}

              <div className="mt-2">
                {user.isBlocked ? (
                  <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-sm">
                    Blocked
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                    Active
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {toggleBlock && (
                  <button
                    onClick={() => handleToggleBlock(user._id, user.role)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      user.isBlocked ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}

                {showEdit && (
                  <button
                    onClick={() => onEdit?.(user)}
                    className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
                  >
                    Edit
                  </button>
                )}

                {showChat && role !== "superadmin" && (
                  <button
                    onClick={() => handleChat(user)}
                    className="px-3 py-1 rounded bg-green-500 text-white text-sm"
                  >
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">No users found</div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
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

      {selectedUser && (
        <AdminCoordinatorChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          userId={loggedInUserId}
          userRole={role} // only admin/coordinator
          receiverId={selectedUser._id}
          receiverRole="user"
          receiverName={selectedUser.fullName}
        />
      )}

      {detailsUser && (
        <UserDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          userId={detailsUser}
        />
      )}
    </div>
  );
};

export default UsersTable;