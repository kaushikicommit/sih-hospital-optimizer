import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import StaffPage from "./pages/Staff";
import StaffRegister from "./pages/StaffRegister";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";

import "./App.css";
import "./styles.css";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/beds" element={<Beds />} />

            <Route path="/patients" element={<Patients />} />

            <Route path="/staff" element={<StaffPage />} />

            <Route path="/appointments" element={<Appointments />} />

            <Route path="/predictions" element={<Dashboard />} />

            {/* Staff Registration */}
            <Route path="/register" element={<StaffRegister />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}