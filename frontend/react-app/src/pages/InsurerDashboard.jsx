import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClaimModel from "./ClaimModel"; 
import "./InsurerDashboard.css"; 

function InsurerDashboard() {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); 

  useEffect(() => {
    fetchClaims();
  }, []);

  // Fetch all claims
  const fetchClaims = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/insurer/claims");
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <img src="../../assets/logo.svg" alt="Logo" />
        </div>
        <div className="sidebar-icons">
          <button>Claims</button>
        </div>
        <div className="sidebar-footer">
          <button
            onClick={() => {
              localStorage.removeItem("userRole");
              navigate("/roles");
            }}
          >
            Change Role
          </button>
        </div>
      </div>

      <div className="content">
        <div className="header">
          <div className="user-greeting">
            <h1>Hi, {user?.name}</h1>
            <p>Welcome to your Insurer Dashboard</p>
          </div>

          {/* User Profile Dropdown */}
          <div className="user-info" onClick={toggleDropdown}>
            <img src={user?.picture} alt="User" className="user-img" />
            <div className="user-details">
              <p>{user?.name}</p>
              <p>{user?.email}</p>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-claims-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        {/* Filters */}
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

        {/* Claims List */}
        <div className="claims-section">
          {claims.length > 0 ? (
            claims.map((claim, index) => (
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
            <p className="no-claims">No claims found.</p>
          )}
        </div>

        {/* Claim Modal */}
        {selectedClaim && <ClaimModel claim={selectedClaim} onClose={() => setSelectedClaim(null)} onUpdate={fetchClaims} />}
      </div>
    </div>
  );
}

export default InsurerDashboard;
