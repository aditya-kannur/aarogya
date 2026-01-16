import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Roles.css";

const Roles = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authId, setAuthId] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (!isAuthenticated) {
      loginWithRedirect();
    } else if (savedRole) {
      navigate(savedRole === "Patient" ? "/patient-dashboard" : "/users");
    }
  }, [isAuthenticated, navigate, loginWithRedirect]);

  const handleContinue = async () => {
    setError("");
    if (!selectedRole) return;
    if (selectedRole === "Insurer") {
      // Check authorization from backend
      try {
        const res = await axios.post("http://localhost:5000/api/insurer/check-authorization", {
          email: user.email,
        });
        if (!res.data.authorized) {
          setShowAuthPrompt(true);
          return;
        }
      } catch {
        setShowAuthPrompt(true);
        return;
      }
    }
    localStorage.setItem("userRole", selectedRole);
    navigate(selectedRole === "Patient" ? "/patient-dashboard" : "/users");
  };

  // Show dialog to enter email and authorization ID
  const handleRequestAuthorization = () => {
    setShowAuthPrompt(false);
    setAuthEmail(user.email);
    setShowAuthDialog(true);
  };

  // Submit authorization request
  const handleAuthDialogSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/insurer/request-authorization", {
        email: authEmail,
        name: user.name,
        role: "Insurer",
        authId: authId,
      });
      setShowAuthDialog(false);
      setError("Authorization successful. You can now access the Insurer dashboard.");
    } catch (err) {
      setError("Authorization failed. Please check your Authorization ID.");
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-box">
        <h2>Select Your Role</h2>
        <label htmlFor="roleSelect">Choose a role:</label>
        <select id="roleSelect" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">-- Select Role --</option>
          <option value="Patient">Patient</option>
          <option value="Insurer">Insurer</option>
        </select>
        <button className="continue-btn" onClick={handleContinue} disabled={!selectedRole}>
          Continue
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {showAuthPrompt && (
          <div style={{ marginTop: "15px" }}>
            <p>You are not authorized as an insurer.<br />Do you want to request authorization?</p>
            <button onClick={handleRequestAuthorization}>Yes, Request Authorization</button>
            <button onClick={() => setShowAuthPrompt(false)} style={{ marginLeft: "10px" }}>Cancel</button>
          </div>
        )}
        {showAuthDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Authorization Required</h3>
              <form onSubmit={handleAuthDialogSubmit}>
                <label>
                  Email:
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Authorization ID:
                  <input
                    type="password"
                    value={authId}
                    onChange={(e) => setAuthId(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowAuthDialog(false)} style={{ marginLeft: "10px" }}>
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