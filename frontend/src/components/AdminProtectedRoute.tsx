import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("adminToken");
  console.log("Admin token in AdminProtectedRoute:", token);

    if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;