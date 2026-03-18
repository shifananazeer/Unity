import React from "react";
import { signupUser } from "../../services/user/authService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface SignupFormProps {
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = React.useState({
  fullName: "",
  mobileNumber: "",
  pinCode: "",
  district: "",
  state: "",
  localBody: "",
  password: "",
  confirmPassword: "",
  type: "nano" // default
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     const res = await signupUser(
  formData.fullName,
  formData.mobileNumber,
  formData.pinCode,
  formData.district,
  formData.state,
  formData.localBody,
  formData.password,
  formData.type // 👈 add this
);

      localStorage.setItem("token", res.token);

      window.dispatchEvent(new Event("authChange"));

      onClose();

      Swal.fire({
        icon: "success",
        title: t("signup.success"),
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true
      });

    } catch (error: any) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder={t("signup.fullName")}
        className="col-span-2 border p-2 rounded-lg"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />

      <input
        type="tel"
        placeholder={t("signup.mobile")}
        className="border p-2 rounded-lg"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
      />
     <div className="col-span-2 flex gap-4">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="type"
      value="nano"
      checked={formData.type === "nano"}
      onChange={handleChange}
    />
    Nano
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="type"
      value="micro"
      checked={formData.type === "micro"}
      onChange={handleChange}
    />
    Micro
  </label>
</div>
      <input
        type="text"
        placeholder={t("signup.pin")}
        className="border p-2 rounded-lg"
        name="pinCode"
        value={formData.pinCode}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder={t("signup.district")}
        className="border p-2 rounded-lg"
        name="district"
        value={formData.district}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder={t("signup.state")}
        className="border p-2 rounded-lg"
        name="state"
        value={formData.state}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder={t("signup.localBody")}
        className="col-span-2 border p-2 rounded-lg"
        name="localBody"
        value={formData.localBody}
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder={t("signup.password")}
        className="border p-2 rounded-lg"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder={t("signup.confirmPassword")}
        className="border p-2 rounded-lg"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="col-span-2 bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
      >
        {t("signup.signupButton")}
      </button>

    </form>
  );
};

export default SignupForm;