import React, { useState } from "react";
import { loginUser } from "../../services/user/authService";
import Swal from "sweetalert2";

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        mobileNumber: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log(formData);

  try {
    const data = await loginUser(formData.mobileNumber, formData.password);
    // Save token
    localStorage.setItem("token", data.token);
    // Dispatch event so Navbar/Hero rerender
    window.dispatchEvent(new Event("authChange"));
    // Close modal
    onClose();

    // Success toast
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
      toast: true,
    });

    console.log("Login successful:", data);

  } catch (error: any) {
    console.error("Login failed:", error);

    // Error toast
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error?.response?.data?.message || "Something went wrong",
      showConfirmButton: false,
      timer: 2000,
      position: "top-end",
      toast: true,
    });
  }
};
  return (
    <form className="space-y-4"
      onSubmit={handleSubmit}>
      {/* Phone Number */}
      <div>
        <label className="text-sm text-gray-600">Phone Number</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            name="mobileNumber"    
            value={formData.mobileNumber}
            onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            name="password"
            value={formData.password}
            onChange={handleChange}
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;