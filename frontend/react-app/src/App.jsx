import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Roles from "./components/Roles";
import PatientDashboard from "./pages/PatientDashboard";
import InsurerDashboard from "./pages/InsurerDashboard";
import SelectUser from "./pages/SelectUser";

import { AuthzProvider } from "./AuthzContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [selectedUserID, setSelectedUserID] = useState(() => {
    return localStorage.getItem("selectedUserID") || null;
  });

  useEffect(() => {
    if (selectedUserID) {
      localStorage.setItem("selectedUserID", selectedUserID);
    } else {
      localStorage.removeItem("selectedUserID"); // Clean up on logout/reset
    }
  }, [selectedUserID]);

  return (
    <BrowserRouter>
      <AuthzProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roles" element={<Roles />} />

          {/* INSURER ONLY */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRole="Insurer">
                <SelectUser onUserSelect={setSelectedUserID} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insurer-dashboard"
            element={
              <ProtectedRoute allowedRole="Insurer">
                {selectedUserID ? (
                  <InsurerDashboard userID={selectedUserID} />
                ) : (
                  <Navigate to="/users" replace />
                )}
              </ProtectedRoute>
            }
          />

          {/* PATIENT ONLY */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRole="Patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthzProvider>
    </BrowserRouter>
  );
}

export default App;