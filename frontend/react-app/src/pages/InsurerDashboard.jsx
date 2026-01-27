import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClaimModel from "./ClaimModel"; 
import "./InsurerDashboard.css"; 

// 1. CRITICAL FIX: Add curly braces { userID } to destructure the prop
function InsurerDashboard({ userID }) {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if(userID) {
        fetchClaims();
    }
  }, [userID]);

  // Fetch user specific claims
const fetchClaims = async (userID) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/insurer/claims/user/${encodeURIComponent(userID)}`,
      { headers: { "Cache-Control": "no-cache" } }
    );
    // axios throws on non-2xx, but guard in case response has no data
    setClaims(res.data || []);
  } catch (err) {
    console.error("fetchClaims error:", err);
    setClaims([]);
  }
};

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Filter + Search Logic
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
      <div className="sidebar">
        <div className="logo">
           {/* Ensure path is correct for your project structure */}
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
            <p>Viewing Claims for User ID: <strong>{userID}</strong></p>
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

        {/* Claim Modal */}
        {selectedClaim && <ClaimModel claim={selectedClaim} onClose={() => setSelectedClaim(null)} onUpdate={fetchClaims} />}
      </div>
    </div>
  );
}

export default InsurerDashboard;