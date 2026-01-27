import { Navigate } from "react-router-dom";
import { useAuthz } from "./AuthzContext";

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isInsurer, loadingAuthz } = useAuthz();

  if (loadingAuthz) return null; 

  if (allowedRole === "Insurer" && !isInsurer) {
    return <Navigate to="/roles" replace />;
  }

  return children;
};

export default ProtectedRoute;
