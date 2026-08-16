import {
  Search,
  Bell,
  ChevronDown,
  Clock3,
  Sparkles,
  Activity,
} from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* =====================================================
            TOPBAR ACTIONS
        ====================================================== */}

        <div className="topbar-actions">

          {/* ================= LAST UPDATED ================= */}

          <div className="topbar-card last-updated">

            <div className="topbar-icon blue-icon">
              <Clock3 size={20} />
            </div>

            <div className="topbar-text">
              <span className="topbar-label">
                LAST UPDATED
              </span>

              <strong>
                Just now
              </strong>
            </div>

          </div>


          {/* ================= AI ENGINE ================= */}

          <div className="topbar-card ai-engine">

            <div className="topbar-icon ai-icon">

              <Sparkles size={20} />

              <span className="status-dot"></span>

            </div>

            <div className="topbar-text">

              <span className="topbar-label purple-label">
                AI ENGINE
              </span>

              <strong>
                Active
              </strong>

            </div>

          </div>


          {/* ================= SYSTEM ================= */}

          <div className="operational-card">

            <Activity
              size={25}
              strokeWidth={2.1}
            />

            <div className="operational-content">

              <span className="operational-label">
                SYSTEM
              </span>

              <strong>
                Operational
              </strong>

            </div>

          </div>


          {/* ================= SEARCH ================= */}

          <button
            type="button"
            className="icon-button"
            aria-label="Search"
          >
            <Search size={20} />
          </button>


          {/* ================= NOTIFICATIONS ================= */}

          <button
            type="button"
            className="icon-button notification-button"
            aria-label="Notifications"
          >

            <Bell size={20} />

            <span className="notification-dot"></span>

          </button>


          {/* ================= DIVIDER ================= */}

          <div className="topbar-divider"></div>


          {/* ================= ADMIN ================= */}

          <button
            type="button"
            className="admin-profile"
          >

            <div className="admin-avatar">

              A

              <span className="online-dot"></span>

            </div>

            <div className="admin-info">

              <strong>
                Admin
              </strong>

              <span>
                Hospital Administrator
              </span>

            </div>

            <ChevronDown
              size={17}
              className="admin-arrow"
            />

          </button>

        </div>

      </div>
    </header>
  );
}

export default Topbar;