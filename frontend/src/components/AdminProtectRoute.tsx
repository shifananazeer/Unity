import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface Props {
  children: React.ReactNode;
  role: "superadmin" | "admin" | "coordinator";
}

interface JwtPayload {
  role: string;
  exp?: number;
}

const AdminProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("userRole"); // ✅ role stored separately

  if (!token || storedRole !== role) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // ✅ expiry check
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return <Navigate to={`/login/${role}`} replace />;
    }

    // ✅ role check
    if (decoded.role !== role) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return <Navigate to={`/login/${role}`} replace />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    return <Navigate to={`/login/${role}`} replace />;
  }
};

export default AdminProtectedRoute;