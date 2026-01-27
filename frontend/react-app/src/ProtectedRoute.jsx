import { Navigate } from "react-router-dom";
import { useAuthz } from "./AuthzContext";

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isInsurer, loadingAuthz } = useAuthz();

  if (loadingAuthz) {
    return <div>Loading...</div>; 
  }

  if (allowedRole === "Insurer" && !isInsurer) {
    return <Navigate to="/roles" replace />;
  }

  if (allowedRole === "Patient" && isInsurer) {
    return <Navigate to="/roles" replace />;
  }

  return children;
};

export default ProtectedRoute;
