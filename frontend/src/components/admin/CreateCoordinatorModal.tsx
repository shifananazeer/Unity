import React, { useState } from "react";
import { districts } from "../superAdmin/CreateAdminModal";
import { createCoordinator } from "../../services/admin/adminService";



const CreateCoordinatorModal = ({ onClose, onCoordinatorCreated }: any) => {

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [district, setDistrict] = useState("");
  const [type, setType] = useState<"nano" | "micro">("nano");

  const [pin, setPin] = useState("");
  const [area, setArea] = useState("");

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!fullName.trim()) newErrors.fullName = "Name is required";

    if (!phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Phone must be 10 digits";

    if (!email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email";

    if (!district) newErrors.district = "District required";

    if (type === "nano" && !pin.match(/^[0-9]{6}$/))
      newErrors.pin = "Pincode must be 6 digits";

    if (type === "micro" && !area)
      newErrors.area = "Select Panchayat / Corporation";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) return;

    const payload = {
      fullName,
      phone,
      email,
      password,
      district,
      type,
      pin: type === "nano" ? pin : null,
      area: type === "micro" ? area : null
    };

    try {
    await createCoordinator(payload);

    onCoordinatorCreated();
    onClose();
  } catch (error) {
    console.error("Error creating coordinator", error);
  }

    onCoordinatorCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-semibold mb-4">Create Coordinator</h2>

        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="border w-full p-2 mb-1"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <p className="text-red-500 text-sm">{errors.fullName}</p>

        {/* PHONE */}
        <input
          type="text"
          placeholder="Phone"
          className="border w-full p-2 mb-1"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-red-500 text-sm">{errors.phone}</p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-red-500 text-sm">{errors.email}</p>

        <input
      type="password"
      placeholder="Password"
      className="border w-full p-2 mb-1"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
        {/* DISTRICT */}
        <select
          className="border w-full p-2 mb-1"
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
        <p className="text-red-500 text-sm">{errors.district}</p>

        {/* TYPE TOGGLE */}
        <div className="flex gap-2 mb-4 mt-2">

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

        {/* NANO PINCODE */}
        {type === "nano" && (
          <>
            <input
              type="text"
              placeholder="Enter Pincode"
              className="border w-full p-2 mb-1"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.pin}</p>
          </>
        )}

        {/* MICRO AREA */}
       {type === "micro" && (
  <>
    <input
      type="text"
      placeholder="Enter Panchayat / Corporation"
      className="border w-full p-2 mb-1"
      value={area}
      onChange={(e) => setArea(e.target.value)}
    />
    <p className="text-red-500 text-sm">{errors.area}</p>
  </>
)}

        <div className="flex justify-end gap-2 mt-4">

          <button
            className="border px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-black text-white px-3 py-1 rounded"
            onClick={handleSubmit}
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateCoordinatorModal;