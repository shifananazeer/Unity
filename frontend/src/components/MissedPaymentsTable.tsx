"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import AdminCoordinatorChatModal from "./AdminCoordinatorChatModal";
interface User {
  _id: string;
  fullName: string;
  mobileNumber?: string;
  missedMonths: number;
}

interface Props {
  users: User[];
  role: "coordinator" | "admin"; // coordinator/admin pages
  showHierarchy?: boolean;
  onRemove?: (userId: string) => void;
}

const MissedPaymentsTable: React.FC<Props> = ({
  users,
  role,
  onRemove,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Logged-in user ID (coordinator or admin)
  const loggedInUserId =
    
    localStorage.getItem(role === "coordinator" ? "coordinatorId" : "adminId") ||
    "";

  const getRowColor = (missedMonths: number) => {
    if (missedMonths >= 3) return "bg-red-100";
    if (missedMonths === 2) return "bg-orange-100";
    if (missedMonths === 1) return "bg-pink-100";
    return "";
  };

  const handleRemove = async (user: any) => {
    if (!onRemove) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${user.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      try {
        await onRemove(user._id);
        Swal.fire({
          title: "Removed!",
          text: `${user.fullName} removed successfully`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire("Error!", "Failed to remove user", "error");
      }
    }
  };

  const handleChat = (user: User) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-slate-300">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Missed Months</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className={`${getRowColor(user.missedMonths)} border-t`}>
              <td className="p-3">{user.fullName}</td>
              <td className="p-3">{user.mobileNumber || "-"}</td>
              <td className="p-3 font-semibold text-center">{user.missedMonths}</td>
              <td className="p-3 text-center flex gap-2 justify-center">
                {/* Chat Button */}
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleChat(user)}
                >
                  Chat
                </button>

                {/* Remove Button */}
                {user.missedMonths >= 3 && onRemove && (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleRemove(user)}
                  >
                    Remove
                  </button>
                )}

                {/* Call Button */}
                <a
                  href={`tel:${user.mobileNumber}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Call
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chat Modal for both coordinator/admin */}
      {selectedUser && (
      <AdminCoordinatorChatModal
  isOpen={chatOpen}
  onClose={() => setChatOpen(false)}
  userId={loggedInUserId}
  userRole={role}             // admin or coordinator
  receiverId={selectedUser._id}
  receiverRole="user"         // user being messaged
  receiverName={selectedUser.fullName}
/>
      )}
    </div>
  );
};

export default MissedPaymentsTable;