import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClaimModel from "./ClaimModel"; 
import "./InsurerDashboard.css"; 

function InsurerDashboard({ userID }) {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  
  // STATE
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  //  NEW: MODAL STATE
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);

  useEffect(() => {
    if(userID) {
        fetchClaims();
    }
    // eslint disable next line
  }, [userID]);

  const fetchClaims = async () => {
    if (!userID) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/insurer/claims/user/${encodeURIComponent(userID)}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setClaims(res.data || []);
    } catch (err) {
      console.error("fetchClaims error:", err);
      setClaims([]);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Show Confirmation Modal
  const handleSwitchClick = () => {
      setShowSwitchConfirm(true);
  };

  // Update DB and Navigate
  const executeSwitch = async () => {
      try {
          await axios.post("http://localhost:5000/api/user/role", { 
             email: user.email, 
             role: "Patient" 
          });
          
          // Navigate
          navigate("/patient-dashboard");
      } catch (err) {
          console.error("Error switching role", err);
          navigate("/patient-dashboard"); 
      }
  };

  // FILTERING
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = searchQuery
      ? claim.name.toLowerCase().includes(searchQuery) ||
        claim.status.toLowerCase().includes(searchQuery) ||
        claim.amount.toString().includes(searchQuery)
      : true;

    const matchesFilter = filter === "All" || claim.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Logo" />
        </div>
        <div className="sidebar-icons">
          <button>Claims</button>
        </div>
        
        {/* --- FOOTER WITH SWITCH BUTTON --- */}
        <div className="sidebar-footer">
          <button onClick={handleSwitchClick}>
            Switch to Patient
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="content">
        <div className="header">
          <div className="user-greeting">
            <h1>Hi, {user?.name}</h1>
            <p>Viewing Claims for User ID: <strong>{userID}</strong></p>
          </div>

          <div className="user-info" onClick={toggleDropdown}>
            <img src={user?.picture} alt="User" className="user-img" />
            <div className="user-details">
              <p>{user?.name}</p>
              <p>{user?.email}</p>
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="search-claims-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        <div className="filters">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="claims-section">
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim, index) => (
              <div key={claim._id} className="claim-tile" onClick={() => setSelectedClaim(claim)}>
                <span className="col-no">{index + 1}</span>
                <span className="col-name">{claim.name}</span>
                <span className="col-date">{new Date(claim.submissionDate).toLocaleDateString()}</span>
                <span className="col-amount">${claim.amount}</span>
                <span className="col-approved">${claim.approvedAmount}</span>
                <span className={`col-status ${claim.status.toLowerCase()}`}>{claim.status}</span>
              </div>
            ))
          ) : (
            <p className="no-claims">No claims found for this user.</p>
          )}
        </div>

        {selectedClaim && <ClaimModel claim={selectedClaim} onClose={() => setSelectedClaim(null)} onUpdate={fetchClaims} />}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {showSwitchConfirm && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <h3>Switch Role?</h3>
            <p>You are about to switch to the Patient Dashboard.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowSwitchConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={executeSwitch}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InsurerDashboard;