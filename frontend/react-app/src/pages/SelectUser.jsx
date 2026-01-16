import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 1. Destructure the prop correctly here
const SelectUser = ({ onUserSelect }) => {
  const [userIDs, setUserIDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIDs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/insurer/unique-users");
        setUserIDs(res.data);
      } catch (err) {
        setUserIDs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserIDs();
  }, []);

  const handleUserSelection = () => {
    if (selectedUser) {
      // 2. Send the ID up to App.js using the prop
      onUserSelect(selectedUser);
      // 3. Navigate to the dashboard
      navigate("/insurer-dashboard");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!userIDs.length) return <div>No users found.</div>;

  return (
    <div>
      <h3>Select a User</h3>
      <ul>
        {userIDs.map((id) => (
          <li
            key={id}
            onClick={() => {
              // Only update local state here (highlight the row)
              setSelectedUser(id);
            }}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              fontWeight: selectedUser === id ? "bold" : "normal",
              background: selectedUser === id ? "#e0e0e0" : "transparent"
            }}
          >
            {id}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleUserSelection} disabled={!selectedUser}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectUser;