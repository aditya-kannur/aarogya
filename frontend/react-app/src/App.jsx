import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Roles from "./components/Roles";
import PatientDashboard from './pages/PatientDashboard'
import InsurerDashboard from "./pages/InsurerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
