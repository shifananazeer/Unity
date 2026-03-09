import { useState } from "react";
import { createAdmin } from "../../services/superAdmin/authService";

interface Props {
  onClose: () => void;
  onAdminCreated: () => void;
}

export const districts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod"
];

const CreateAdminModal: React.FC<Props> = ({ onClose, onAdminCreated }) => {

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    district: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {

    await createAdmin(form);

    alert("Admin created successfully");

    onAdminCreated(); // refresh admin list
    onClose(); // close modal

  } catch (error) {

    console.error(error);
    alert("Failed to create admin");

  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-[400px]">

        <h2 className="text-lg font-semibold mb-4">Create Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            name="fullName"
            placeholder="Admin Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <select
            name="district"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>

            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}

          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-2 pt-3">

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
              Create
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateAdminModal;