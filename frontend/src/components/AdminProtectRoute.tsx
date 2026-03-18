import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role: "superadmin" | "admin" | "coordinator";
}

const AdminProtectedRoute: React.FC<Props> = ({ children, role }) => {

  const tokenMap = {
    superadmin: "superAdminToken",
    admin: "adminToken",
    coordinator: "coordinatorToken",
  };

  const token = localStorage.getItem(tokenMap[role]);

  console.log(`${role} token in ProtectedRoute:`, token);

  if (!token || token === "null" || token === "undefined") {
    return <Navigate to={`/login/${role}`} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;