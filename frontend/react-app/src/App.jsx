import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Roles from "./components/Roles";
import PatientDashboard from "./pages/PatientDashboard";
import InsurerDashboard from "./pages/InsurerDashboard";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
