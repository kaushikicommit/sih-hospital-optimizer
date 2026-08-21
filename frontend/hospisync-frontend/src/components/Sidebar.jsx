import { NavLink } from "react-router-dom";
import { useState } from "react";

const NAV = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "grid",
  },
  {
    path: "/beds",
    label: "Beds",
    icon: "bed",
  },
  {
    path: "/patients",
    label: "Patients",
    icon: "user",
  },
  {
    path: "/staff",
    label: "Staff",
    icon: "users",
  },
  {
    path: "/appointments",
    label: "Appointments",
    icon: "calendar",
  },
  {
    path: "/predictions",
    label: "AI Predictions",
    icon: "pulse",
  },
];

const ICONS = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),

  bed: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 14V6a1 1 0 011-1h3v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 10.5h13a1 1 0 011 1V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 14v1.5M16 14v1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="6"
        cy="7.5"
        r="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  ),

  user: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle
        cx="9"
        cy="6"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 15c0-3 2.7-5 6-5s6 2 6 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  users: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle
        cx="6.5"
        cy="6"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M1.5 15c0-2.5 2.2-4 5-4s5 1.5 5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 4.2a2.5 2.5 0 010 4.6M13.5 15c0-2.1-1.3-3.5-3-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  calendar: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3.5"
        width="14"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 7h14M6 2v3M12 2v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  pulse: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 9h3l1.5-4L9 13l1.5-4H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M3 6h14M3 10h14M3 14h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">
            +
          </span>

          <div>
            <div className="sidebar-brand-name">
              ForeCare
            </div>

            <div className="sidebar-brand-sub">
              Resource Optimizer
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span className="sidebar-nav-icon">
                {ICONS[item.icon]}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot" />
            Systems live
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="sidebar-scrim"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}