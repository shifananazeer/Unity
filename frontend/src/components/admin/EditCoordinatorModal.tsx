import React, { useState, useEffect } from "react";
import { updateCoordinator } from "../../services/admin/adminService";
import { districts } from "../superAdmin/CreateAdminModal";

interface Props {
  coordinator: any;
  onClose: () => void;
  onCoordinatorUpdated: () => void;
}

const EditCoordinatorModal: React.FC<Props> = ({
  coordinator,
  onClose,
  onCoordinatorUpdated
}) => {

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [district, setDistrict] = useState("");
  const [type, setType] = useState<"nano" | "micro">("nano");

  const [pin, setPin] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (coordinator) {
      setFullName(coordinator.fullName || "");
      setPhone(coordinator.phone || "");
      setEmail(coordinator.email || "");
      setDistrict(coordinator.district || "");
      setType(coordinator.type || "nano");
      setPin(coordinator.pin || "");
      setArea(coordinator.area || "");
    }
  }, [coordinator]);

  const handleUpdate = async () => {
    try {

      const payload = {
        fullName,
        phone,
        email,
        password: password || undefined, // only update if entered
        district,
        type,
        pin: type === "nano" ? pin : null,
        area: type === "micro" ? area : null
      };

      await updateCoordinator(coordinator._id, payload);

      onCoordinatorUpdated();
      onClose();

    } catch (error) {
      console.error("Update coordinator error", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-semibold mb-4">
          Edit Coordinator
        </h2>

        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="border w-full p-2 mb-3 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* PHONE */}
        <input
          type="text"
          placeholder="Phone"
          className="border w-full p-2 mb-3 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="New Password (optional)"
          className="border w-full p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* DISTRICT */}
        <select
          className="border w-full p-2 mb-3 rounded"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">Select District</option>

          {districts.map((d: string) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* TYPE TOGGLE */}
        <div className="flex gap-2 mb-4">

          <button
            className={`flex-1 p-2 rounded ${
              type === "nano" ? "bg-black text-white" : "border"
            }`}
            onClick={() => setType("nano")}
          >
            Nano
          </button>

          <button
            className={`flex-1 p-2 rounded ${
              type === "micro" ? "bg-black text-white" : "border"
            }`}
            onClick={() => setType("micro")}
          >
            Micro
          </button>

        </div>

        {/* NANO PIN */}
        {type === "nano" && (
          <input
            type="text"
            placeholder="Enter Pincode"
            className="border w-full p-2 mb-3 rounded"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        )}

        {/* MICRO AREA */}
        {type === "micro" && (
          <input
            type="text"
            placeholder="Enter Panchayat / Corporation"
            className="border w-full p-2 mb-3 rounded"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2">

          <button
            className="border px-4 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditCoordinatorModal;