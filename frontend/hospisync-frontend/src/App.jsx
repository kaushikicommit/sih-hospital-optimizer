import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import StaffPage from "./pages/Staff";
import StaffRegister from "./pages/StaffRegister";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";

import "./App.css";
import "./styles.css";

export default function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/register" ||
    location.pathname === "/login";

  // Registration and Login pages
  // do not show the dashboard sidebar.
  if (isAuthPage) {
    return (
      <div className="app-shell">
        <div className="app-main">
          <div className="app-content">
            <Routes>
              <Route
                path="/register"
                element={<StaffRegister />}
              />

              <Route
                path="/login"
                element={<Login />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  // Main ForeCare application
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar />

        <div className="app-content">
          <Routes>

            {/* Opening ForeCare */}
            <Route
              path="/"
              element={<Navigate to="/register" replace />}
            />

            {/* Staff Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Beds */}
            <Route
              path="/beds"
              element={<Beds />}
            />

            {/* Patients */}
            <Route
              path="/patients"
              element={<Patients />}
            />

            {/* Staff */}
            <Route
              path="/staff"
              element={<StaffPage />}
            />

            {/* Appointments */}
            <Route
              path="/appointments"
              element={<Appointments />}
            />

            {/* AI Predictions */}
            <Route
              path="/predictions"
              element={<Dashboard />}
            />

            {/* Unknown URL */}
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