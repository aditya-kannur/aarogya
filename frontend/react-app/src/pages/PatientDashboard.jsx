import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClaimForm from "./ClaimForm"; 
import "./PatientDashboard.css"; 

function PatientDashboard() {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState([]); 
  const [filter, setFilter] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState(""); 
    const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  // Fetch user-specific claims
 const fetchClaims = async () => {
  try {
    const encodedUserID = encodeURIComponent(user?.sub);  
    const response = await axios.get(`http://localhost:5000/api/patient/claims/${encodedUserID}`);
    setClaims(response.data);
  } catch (error) {
    console.error("Error fetching claims:", error);
  }
};


  // Handle role change
  const handleChangeRole = () => {
    localStorage.removeItem("userRole");
    navigate("/roles");
  };

  // Show Claim Form
  const handleShowForm = () => {
    setShowForm(true);
  };

  // Handle Search Input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter claims based on status and search query
  const filteredClaims = claims.filter((claim) => {
    const matchesFilter = filter === "All" || claim.status === filter;
    const matchesSearch =
      claim.name.toLowerCase().includes(searchQuery) ||
      claim.amount.toString().includes(searchQuery) ||
      claim.approvedAmount.toString().includes(searchQuery) ||
      claim.status.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

    // Toggle dropdown menu
    const toggleDropdown = () => {
      setShowDropdown((prev) => !prev);
    };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Logo" />
        </div>
        <div className="sidebar-icons">
          <button>Claims</button>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleChangeRole}>Change Role</button>
        </div>
      </div>

      <div className="content">
        <div className="header">
          <div className="user-greeting">
            <h1>Hi, {user?.name}</h1>
            <p>Welcome to your Patient Dashboard</p>
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

        {/* Search Bar and Claims Button */}
        <div className="search-claims-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="claims-btn" onClick={handleShowForm}>Add Claim</button>
        </div>

        {/* Show Claim Form */}
        {showForm && (
          <div className="claim-form-wrapper">
            <ClaimForm onClose={() => setShowForm(false)} />
          </div>
        )}

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

        {/* Claims Table Header */}
        <div className="claims-header">
          <span className="col-no">No</span>
          <span className="col-name">Name</span>
          <span className="col-date">Submission Date</span>
          <span className="col-amount">Claim Amount</span>
          <span className="col-approved">Approved Amount</span>
          <span className="col-status">Status</span>
        </div>

        {/* Claims List */}
        <div className="claims-section">
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim, index) => (
              <div key={claim._id} className="claim-tile">
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
      </div>
    </div>
  );
}

export default PatientDashboard;
