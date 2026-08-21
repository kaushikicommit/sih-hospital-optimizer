import { Navigate, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import StaffPage from "./pages/Staff";
import StaffRegister from "./pages/StaffRegister";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import PatientPortal from "./pages/PatientPortal";

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

            {/* ========================================
                DEFAULT / OPENING PAGE
                ======================================== */}

            <Route
              path="/"
              element={<Navigate to="/register" replace />}
            />


            {/* ========================================
                STAFF REGISTRATION
                ======================================== */}

            <Route
              path="/register"
              element={<StaffRegister />}
            />


            {/* ========================================
                STAFF / PATIENT LOGIN
                ======================================== */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* ========================================
                STAFF DASHBOARD
                ======================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ========================================
                STAFF MODULES
                ======================================== */}

            <Route
              path="/beds"
              element={<Beds />}
            />

            <Route
              path="/patients"
              element={<Patients />}
            />

            <Route
              path="/staff"
              element={<StaffPage />}
            />

            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/predictions"
              element={<Dashboard />}
            />


            {/* ========================================
                PATIENT PORTAL
                ======================================== */}

            <Route
              path="/patient-portal"
              element={<PatientPortal />}
            />


            {/* ========================================
                UNKNOWN URL
                ======================================== */}

            <Route
              path="*"
              element={<Navigate to="/register" replace />}
            />

          </Routes>

        </div>
      </div>
    </div>
  );
}