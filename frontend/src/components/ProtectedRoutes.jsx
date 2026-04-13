import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { userToken } = useAuth();

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;