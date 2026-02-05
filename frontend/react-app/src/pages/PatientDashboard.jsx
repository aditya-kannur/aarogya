import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import ClaimForm from "./ClaimForm";
import { useAuthz } from "../AuthzContext";
import "./PatientDashboard.css";

function PatientDashboard() {
  const { user, logout, isLoading, isAuthenticated } = useAuth0();
  const { refreshAuth } = useAuthz();
  const navigate = useNavigate();

  // STATE
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // MODAL STATE
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authId, setAuthId] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      fetchClaims();
    }
  }, [isLoading, user]);

  const fetchClaims = async () => {
    if (!user?.sub) return;
    try {
      const encodedUserID = encodeURIComponent(user.sub);
      const response = await axios.get(`https://aarogya-qmzf.onrender.com/api/patient/claims/${encodedUserID}`);
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };


  const handleSwitchClick = async () => {
    try {
      const res = await axios.post("https://aarogya-qmzf.onrender.com/api/insurer/check-authorization", {
        email: user.email
      });

      const isAuthorized = res.data.authorized;

      if (isAuthorized) {
        setShowSwitchConfirm(true);
      } else {
        setShowAuthPrompt(true);
      }
    } catch (err) {
      console.error("Check failed", err);
      setShowAuthPrompt(true);
    }
  };

  // UPDATE DB & CONTEXT
  const executeSwitch = async () => {
    try {
      // SAVE PREFERENCE: Insurer
      await axios.post("https://aarogya-qmzf.onrender.com/api/user/role", {
        email: user.email, role: "Insurer"
      });
      navigate("/users");
    } catch (err) {
      console.error("Switch failed", err);
      navigate("/users");
    }
  };

  // Submit Auth Request
  const submitAuthRequest = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      await axios.post(
        "https://aarogya-qmzf.onrender.com/api/insurer/request-authorization",
        {
          email: user.email,
          name: user.name,
          role: "Insurer",
          authId,
        }
      );

      await axios.post("https://aarogya-qmzf.onrender.com/api/user/role", { email: user.email, role: "Insurer" });
      await refreshAuth();

      setShowAuthForm(false);
      navigate("/users");

    } catch (err) {
      setAuthError("Invalid Authorization ID or Server Error.");
    }
  };

  //  UTILS 
  const handleShowForm = () => setShowForm(true);
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const filteredClaims = claims.filter((claim) => {
    const matchesFilter = filter === "All" || claim.status === filter;
    const matchesSearch =
      claim.name.toLowerCase().includes(searchQuery) ||
      claim.amount.toString().includes(searchQuery) ||
      claim.approvedAmount.toString().includes(searchQuery) ||
      claim.status.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return <div className="dashboard-loading">Loading...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="logo"><img src="/assets/logo.svg" alt="Logo" /></div>
        <div className="sidebar-icons"><button>Claims</button></div>
        <div className="sidebar-footer">
          <button onClick={handleSwitchClick}>Switch to Insurer</button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="content">
        <div className="header">
          <div className="user-greeting">
            <h1>Hi, {user.name}</h1>
            <p>Welcome to your Patient Dashboard</p>
          </div>
          <div className="user-info" onClick={toggleDropdown}>
            <img src={user.picture} alt="User" className="user-img" />
            <div className="user-details"><p>{user.name}</p><p>{user.email}</p></div>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
              </div>
            )}
          </div>
        </div>

        <div className="search-claims-container">
          <input type="text" className="search-bar" placeholder="Search claims..." value={searchQuery} onChange={handleSearch} />
          <button className="claims-btn" onClick={handleShowForm}>Add Claim</button>
        </div>

        {showForm && (<div className="claim-form-wrapper"><ClaimForm onClose={() => setShowForm(false)} onSuccess={() => fetchClaims()} /></div>)}

        <div className="filters">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button key={status} className={`filter-btn ${filter === status ? "active" : ""}`} onClick={() => setFilter(status)}>{status}</button>
          ))}
        </div>

        <div className="claims-header">
          <span className="col-no">No</span><span className="col-name">Name</span><span className="col-date">Date</span><span className="col-amount">Amount</span><span className="col-approved">Approved</span><span className="col-status">Status</span>
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
          ) : (<p className="no-claims">No claims found.</p>)}
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      {showSwitchConfirm && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <h3>Switch Role?</h3>
            <p>You are about to switch to the Insurer Dashboard.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowSwitchConfirm(false)}>Cancel</button>
              <button className="confirm-btn" onClick={executeSwitch}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* UNAUTHORIZED PROMPT */}
      {showAuthPrompt && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <h3>Access Denied</h3>
            <p>You are not currently authorized as an Insurer.</p>
            <p>Would you like to request access?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAuthPrompt(false)}>No, Cancel</button>
              <button className="confirm-btn" onClick={() => { setShowAuthPrompt(false); setShowAuthForm(true); }}>Yes, Authorize</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHORIZATION FORM */}
      {showAuthForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Insurer Authorization</h3>
            <form onSubmit={submitAuthRequest}>
              <label>Authorization ID</label>
              <input
                type="password"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
                required
                placeholder="Enter admin provided ID"
              />
              {authError && <p className="error-text">{authError}</p>}
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => { setShowAuthForm(false); setAuthError(""); }}>Cancel</button>
                <button type="submit" className="confirm-btn">Authorize & Switch</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientDashboard;