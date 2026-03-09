import React, { useState } from "react";
import { loginUser } from "../../services/user/authService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {

  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData.mobileNumber, formData.password);

      localStorage.setItem("token", data.token);

      window.dispatchEvent(new Event("authChange"));

      onClose();

      Swal.fire({
        icon: "success",
        title: t("login.success"),
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });

    } catch (error: any) {

      Swal.fire({
        icon: "error",
        title: t("login.failed"),
        text: error?.response?.data?.message || t("login.error"),
        showConfirmButton: false,
        timer: 2000,
        position: "top-end",
        toast: true,
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      {/* Phone Number */}
      <div>
        <label className="text-sm text-gray-600">
          {t("login.phoneLabel")}
        </label>

        <input
          type="text"
          placeholder={t("login.phonePlaceholder")}
          className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-600">
          {t("login.passwordLabel")}
        </label>

        <input
          type="password"
          placeholder={t("login.passwordPlaceholder")}
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
        {t("login.button")}
      </button>

    </form>
  );
};

export default LoginForm;