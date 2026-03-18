import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../services/superAdmin/authService";
import { adminLogin } from "../services/admin/adminService";
import { coordinatorLogin } from "../services/coordinator/CoordinatorService";

interface LoginProps {
  role: "superadmin" | "admin" | "coordinator";
}

const Login: React.FC<LoginProps> = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMap = {
    superadmin: superAdminLogin,
    admin: adminLogin,
    coordinator: coordinatorLogin,
  };

  const tokenMap = {
    superadmin: "superAdminToken",
    admin: "adminToken",
    coordinator: "coordinatorToken",
  };

  const redirectMap = {
    superadmin: "/superadmin/dashboard",
    admin: "/admin/dashboard",
    coordinator: "/coordinator/dashboard",
  };

  const titleMap = {
    superadmin: "Super Admin Login",
    admin: "Admin Login",
    coordinator: "Coordinator Login",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginFunction = loginMap[role];
      const data = await loginFunction(email, password);

      console.log(`${role} login response:`, data);

      localStorage.setItem(tokenMap[role], data.token);
      console.log(`${role} token stored:`, data.token);

      navigate(redirectMap[role]);
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
          {titleMap[role]}
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