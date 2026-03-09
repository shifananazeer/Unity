import { useState } from "react";
import { updateAdmin } from "../../services/superAdmin/authService";
import { districts } from "./CreateAdminModal";

interface Admin {
  _id: string;
  fullName: string;
  phone: string;
  district?: string;
}

interface Props {
  admin: Admin;
  onClose: () => void;
  onAdminUpdated: () => void;
}

const EditAdminModal: React.FC<Props> = ({ admin, onClose, onAdminUpdated }) => {
  const [fullName, setFullName] = useState(admin.fullName);
  const [phone, setPhone] = useState(admin.phone);
  const [district, setDistrict] = useState(admin.district || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAdmin(admin._id, {
        fullName,
        phone,
        district,
      });

      onAdminUpdated();
      onClose();
    } catch (error) {
      console.error("Update admin error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />

           <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select District</option>
            {districts.map((d: string) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;