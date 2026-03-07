import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

interface JwtPayload {
  id: string;
  role: string;
  exp?: number;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;