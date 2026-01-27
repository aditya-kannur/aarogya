import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Navigate } from "react-router-dom"; // Added Navigate
import axios from "axios";
import ClaimForm from "./ClaimForm"; 
import "./PatientDashboard.css"; 

function PatientDashboard() {
  const { user, logout, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState([]); 
  const [filter, setFilter] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showDropdown, setShowDropdown] = useState(false);

  // Debugging: Check what is happening in the console
  useEffect(() => {
    console.log("Dashboard State -> Loading:", isLoading, "User:", user);
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user) {
      fetchClaims();
    }
  }, [isLoading, user]);

  const fetchClaims = async () => {
    if (!user?.sub) return;
    try {
      // Encode the ID to handle special characters like '|'
      const encodedUserID = encodeURIComponent(user.sub);  
      const response = await axios.get(`http://localhost:5000/api/patient/claims/${encodedUserID}`);
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesFilter = filter === "All" || claim.status === filter;
    const matchesSearch =
      claim.name.toLowerCase().includes(searchQuery) ||
      claim.amount.toString().includes(searchQuery) ||
      claim.approvedAmount.toString().includes(searchQuery) ||
      claim.status.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };


  if (isLoading) {
    return <div className="dashboard-loading">Loading your profile...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Logo" />
        </div>
        <div className="sidebar-icons">
          <button>Claims</button>
        </div>
      </div>

      <div className="content">
        <div className="header">
          <div className="user-greeting">
            {/* These should now always appear because we checked !user above */}
            <h1>Hi, {user.name}</h1>
            <p>Welcome to your Patient Dashboard</p>
          </div>
          
          <div className="user-info" onClick={toggleDropdown}>
            <img src={user.picture} alt="User" className="user-img" />
            <div className="user-details">
              <p>{user.name}</p>
              <p>{user.email}</p>
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
            onChange={handleSearch}
          />
          <button className="claims-btn" onClick={handleShowForm}>Add Claim</button>
        </div>

        {showForm && (
          <div className="claim-form-wrapper">
            <ClaimForm onClose={() => setShowForm(false)} />
          </div>
        )}

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

        <div className="claims-header">
          <span className="col-no">No</span>
          <span className="col-name">Name</span>
          <span className="col-date">Submission Date</span>
          <span className="col-amount">Claim Amount</span>
          <span className="col-approved">Approved Amount</span>
          <span className="col-status">Status</span>
        </div>

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