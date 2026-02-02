import { Navigate } from "react-router-dom";
import { useAuthz } from "./AuthzContext";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isInsurer, loadingAuthz } = useAuthz();
  const { isAuthenticated, isLoading } = useAuth0(); // check Auth0 status too

  // 1. Wait for everything to load
  if (loadingAuthz || isLoading) {
    return <div>Loading...</div>; 
  }

  // 2. Security: If not logged in, go Home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. INSURER CHECK: If accessing Insurer page, MUST be authorized
  if (allowedRole === "Insurer" && !isInsurer) {
    return <Navigate to="/roles" replace />;
  }

  // 4. FIX: We REMOVED the "Patient" check.
  // Now, both Patients and Insurers are allowed to view the Patient Dashboard.

  return children;
};

export default ProtectedRoute;