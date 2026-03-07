import React from "react";
import { signupUser } from "../../services/user/authService";
import Swal from "sweetalert2";

interface SignupFormProps {
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = React.useState({
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    district: "",
    state: "",
    localBody: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      console.log(formData);
    try {
      const res = await signupUser(
        formData.fullName,
        formData.mobileNumber,
        formData.pinCode,
        formData.district,
        formData.state,
        formData.localBody,
        formData.password
      );
      localStorage.setItem("token", res.token);

       // Dispatch event so Navbar/Hero rerender
     window.dispatchEvent(new Event("authChange"));
    
      // Close modal
         onClose();
     
         // Success toast
         Swal.fire({
           icon: "success",
           title: "Registration Successful",
           showConfirmButton: false,
           timer: 1500,
           position: "top-end",
           toast: true,
         });
         
      console.log("Signup successful:", res.data);

    } catch (error: any) {
      console.error("Signup failed:", error);
      console.log(error.response.data);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Full Name"
        className="col-span-2 border p-2 rounded-lg"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />

      <input
        type="tel"
        placeholder="Mobile Number"
        className="border p-2 rounded-lg"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="PIN Code"
        className="border p-2 rounded-lg"
        name="pinCode"
        value={formData.pinCode}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="District"
        className="border p-2 rounded-lg"
        name="district"
        value={formData.district}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="State"
        className="border p-2 rounded-lg"
        name="state"
        value={formData.state}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Panchayath / Corporation"
        className="col-span-2 border p-2 rounded-lg"
        name="localBody"
        value={formData.localBody}
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded-lg"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded-lg"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="col-span-2 bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
      >
        Sign Up
      </button>

    </form>
  );
};

export default SignupForm;