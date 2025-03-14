import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Roles.css"; 

const Roles = () => {

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(""); 

  useEffect(() => {

    // Check if the user already selected a role
    const savedRole = localStorage.getItem("userRole");

    if (!isAuthenticated) {
      loginWithRedirect(); 
    } else if (savedRole) {
      navigate(savedRole === "Patient" ? "/patient-dashboard" : "/insurer-dashboard");
    }
  }, [isAuthenticated, navigate, loginWithRedirect]);

  const handleContinue = () => {
    if (!selectedRole) return; 
    localStorage.setItem("userRole", selectedRole);
    navigate(selectedRole === "Patient" ? "/patient-dashboard" : "/insurer-dashboard");
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
      </div>
    </div>
  );
};

export default Roles;
