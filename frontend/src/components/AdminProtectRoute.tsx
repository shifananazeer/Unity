import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role: "superadmin" | "admin";
}

const AdminProtectedRoute: React.FC<Props> = ({ children, role }) => {
  // Choose token based on role
  const tokenKey = role === "superadmin" ? "superAdminToken" : "adminToken";
  const token = localStorage.getItem(tokenKey);

  console.log(`${role} token in ProtectedRoute:`, token);

  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;