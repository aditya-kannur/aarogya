import { Navigate } from "react-router-dom";
import { useAuthz } from "./AuthzContext";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isInsurer, loadingAuthz } = useAuthz();
  const { isAuthenticated, isLoading } = useAuth0(); // check Auth0 status too

  // Wait for everything to load
  if (loadingAuthz || isLoading) {
    return <div>Loading...</div>; 
  }

  //Security: If not logged in, go Home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // INSURER CHECK: If accessing Insurer page, MUST be authorized
  if (allowedRole === "Insurer" && !isInsurer) {
    return <Navigate to="/roles" replace />;
  }

  return children;
};

export default ProtectedRoute;