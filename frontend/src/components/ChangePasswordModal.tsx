import React, { useState } from "react";

interface Props {
  role: "superadmin" | "admin" | "coordinator";
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const ChangePasswordModal: React.FC<Props> = ({ role, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      currentPassword,
      newPassword,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4 capitalize">
          Change {role} Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border p-2 rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;