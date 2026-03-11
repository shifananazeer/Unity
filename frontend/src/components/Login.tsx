import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../services/superAdmin/authService";
import { adminLogin } from "../services/admin/adminService";

interface LoginProps {
  role: "superadmin" | "admin"; // pass the role
}

const Login: React.FC<LoginProps> = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call API based on role
      const data =
        role === "superadmin"
          ? await superAdminLogin(email, password)
          : await adminLogin(email, password);

      console.log(`${role} login response:`, data);

      // Store token based on role
      const tokenKey = role === "superadmin" ? "superAdminToken" : "adminToken";
      localStorage.setItem(tokenKey, data.token);
      console.log(`${role} token stored in localStorage:`, data.token);

      // Redirect based on role
      const redirectPath =
        role === "superadmin" ? "/superadmin/dashboard" : "/admin/dashboard";
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {role === "superadmin" ? "Super Admin Login" : "Admin Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;