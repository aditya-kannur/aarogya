import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Roles from "./components/Roles";
import PatientDashboard from './pages/PatientDashboard'
import InsurerDashboard from "./pages/InsurerDashboard";
import SelectUser from "./pages/SelectUser";

function App() {
  // 1. Create state to hold the selected User ID
  const [selectedUserID, setSelectedUserID] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roles" element={<Roles />} />
        
        {/* 2. Pass the setter function to SelectUser */}
        <Route 
          path="/users" 
          element={<SelectUser onUserSelect={setSelectedUserID} />} 
        />
        
        {/* 3. Pass the selectedUserID value to InsurerDashboard */}
        <Route 
          path="/insurer-dashboard" 
          element={
            // Redirect to selection if no user is selected
            selectedUserID ? (
              <InsurerDashboard userID={selectedUserID} />
            ) : (
              <Navigate to="/users" />
            )
          } 
        />

        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;