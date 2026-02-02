import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthz } from "../AuthzContext"; 
import "./Roles.css";

const Roles = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const { refreshAuth, savedRole } = useAuthz(); 
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authId, setAuthId] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  useEffect(() => {
    if (savedRole === "Patient") {
        navigate("/patient-dashboard");
    } else if (savedRole === "Insurer") {
        navigate("/users"); // Or /insurer-dashboard
    }
  }, [savedRole, navigate]);

  const checkInsurerAuthorization = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/insurer/check-authorization",
      { email: user.email }
    );
    return res.data.authorized;
  };

  const handleContinue = async () => {
    setError("");
    if (!selectedRole || !user) return;

    if (selectedRole === "Patient") {
      // 1. SAVE ROLE TO DB
      await axios.post("http://localhost:5000/api/user/role", { email: user.email, role: "Patient" });
      // 2. Refresh Context
      await refreshAuth();
      // 3. Go
      navigate("/patient-dashboard");
      return;
    }

    if (selectedRole === "Insurer") {
      try {
        setCheckingAuth(true);
        const authorized = await checkInsurerAuthorization();
        
        if (!authorized) {
          setCheckingAuth(false);
          setShowAuthDialog(true);
          return;
        }

        // SAVE ROLE TO DB
        await axios.post("http://localhost:5000/api/user/role", { email: user.email, role: "Insurer" });
        
        await refreshAuth(); 
        setCheckingAuth(false);
        navigate("/users"); 
      } catch {
        setCheckingAuth(false);
        setError("Unable to verify authorization.");
      }
    }
  };

  const submitAuthorizationRequest = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/insurer/request-authorization",
        {
          email: user.email,
          name: user.name,
          role: "Insurer",
          authId,
        }
      );

      // SAVE ROLE & REFRESH
      await axios.post("http://localhost:5000/api/user/role", { email: user.email, role: "Insurer" });
      await refreshAuth(); 
      
      setShowAuthDialog(false);
      setAuthId("");
      setError("Authorization request submitted.");
    } catch {
      setError("Invalid Authorization ID.");
    }
  };

  if (isLoading) return null;

  return (
    <div className="roles-container">
      <div className="roles-box">
        <h2>Select Your Role</h2>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          <option value="Patient">Patient</option>
          <option value="Insurer">Insurer</option>
        </select>

        <button onClick={handleContinue} disabled={!selectedRole || checkingAuth}>
          {checkingAuth ? "Checking..." : "Continue"}
        </button>

        {error && <p className="error">{error}</p>}

        {showAuthDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Insurer Authorization Required</h3>

              <form onSubmit={submitAuthorizationRequest}>
                <label>
                  Email
                  <input type="email" value={user.email} disabled />
                </label>

                <label>
                  Authorization ID
                  <input
                    type="password"
                    value={authId}
                    onChange={(e) => setAuthId(e.target.value)}
                    required
                  />
                </label>

                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowAuthDialog(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;