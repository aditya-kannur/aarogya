import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./SelectUser.css";
import "./InsurerDashboard.css";

const SelectUser = ({ onUserSelect }) => {
  const { user, logout } = useAuth0();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/insurer/unique-users"
        );
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    onUserSelect(userId);
    navigate("/insurer-dashboard");
  };

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  if (loading)
    return (
      <div className="dashboard-container">
        <div className="content" style={{ marginLeft: '200px', padding: '20px' }}>Loading...</div>
      </div>
    );

  return (
    <div className="dashboard-container">
      {/* SIDEBAR  */}
      <div className="sidebar">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Logo" />
        </div>
        <div className="sidebar-icons">
          <button className="active" style={{ background: "rgba(255, 255, 255, 0.1)" }}>Users</button>
        </div>
        <div className="sidebar-footer">
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="content">
        <div className="header">
          <div className="user-greeting">
            <h1>Hi, {user?.name}</h1>
            <p>Select a user from the list below to view their claims.</p>
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
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="claims-section">
          {filteredUsers.length === 0 ? (
            <p className="no-claims">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.userID}
                className="claim-tile"
                onClick={() => handleUserClick(user.userID)}
              >
                {/* Avatar Column */}
                <span className="col-avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random&size=40`}
                    alt="Avatar"
                    className="user-avatar-small"
                  />
                </span>

                {/* Name Column */}
                <span className="col-user-name">
                  {user.name || "Unknown"}
                </span>

                {/* Claims Count Column */}
                <span className="col-claims-count">
                  {user.totalClaims} Claims
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default SelectUser;