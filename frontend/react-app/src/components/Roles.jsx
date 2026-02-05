import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthz } from "../AuthzContext"; // Import Context
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
      navigate("/users");
    }
  }, [savedRole, navigate]);

  const checkInsurerAuthorization = async () => {
    const res = await axios.post("https://aarogya-qmzf.onrender.com/api/insurer/check-authorization", { email: user.email });
    return res.data.authorized;
  };

  const handleContinue = async () => {
    setError("");
    if (!selectedRole || !user) return;

    if (selectedRole === "Patient") {
      // SAVE PREFERENCE
      await axios.post("https://aarogya-qmzf.onrender.com/api/user/role", { email: user.email, role: "Patient" });
      await refreshAuth();
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

        // SAVE PREFERENCE
        await axios.post("https://aarogya-qmzf.onrender.com/api/user/role", { email: user.email, role: "Insurer" });
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
      await axios.post("https://aarogya-qmzf.onrender.com/api/insurer/request-authorization", {
        email: user.email, name: user.name, role: "Insurer", authId,
      });

      // SAVE PREFERENCE & REFRESH
      await axios.post("https://aarogya-qmzf.onrender.com/api/user/role", { email: user.email, role: "Insurer" });
      await refreshAuth();

      setShowAuthDialog(false);
      setAuthId("");
      navigate("/users");
    } catch {
      setError("Invalid Authorization ID.");
    }
  };

  if (isLoading) return null;

  return (
    <div className="roles-container">
      <div className="roles-box">
        <h2>Select Your Role</h2>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
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
                <label>Email</label>
                <input type="email" value={user.email} disabled />

                <label>Authorization ID</label>
                <input
                  type="password"
                  value={authId}
                  onChange={(e) => setAuthId(e.target.value)}
                  required
                  placeholder="Enter your admin ID"
                />

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowAuthDialog(false)}>Cancel</button>
                  <button type="submit" className="confirm-btn">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;