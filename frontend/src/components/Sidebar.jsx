import {
  Activity,
  BarChart3,
  BedDouble,
  BellRing,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Siren,
  Stethoscope,
  UsersRound,
  UserRoundSearch,
  BrainCircuit,
} from "lucide-react";

const commandCenterItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Beds & Capacity",
    icon: BedDouble,
  },
  {
    label: "Patients",
    icon: UserRoundSearch,
  },
  {
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    label: "Staff & Shifts",
    icon: UsersRound,
  },
];

const operationsItems = [
  {
    label: "Departments",
    icon: Stethoscope,
  },
  {
    label: "Emergency",
    icon: Siren,
    badge: "3",
    badgeType: "danger",
  },
  {
    label: "Resources & Inventory",
    icon: Package,
  },
];

const intelligenceItems = [
  {
    label: "AI Forecasts",
    icon: BrainCircuit,
    badge: "AI",
    badgeType: "ai",
  },
  {
    label: "Alerts & Recommendations",
    icon: BellRing,
    badge: "5",
    badgeType: "warning",
  },
  {
    label: "Reports & Analytics",
    icon: BarChart3,
  },
];

function NavigationItem({ item, active }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={`nav-item ${active ? "active" : ""}`}
    >
      <span className="nav-icon">
        <Icon size={20} strokeWidth={2.1} />
      </span>

      <span className="nav-name">
        {item.label}
      </span>

      {item.badge && (
        <span className={`nav-badge ${item.badgeType || ""}`}>
          {item.badge}
        </span>
      )}

      {active && (
        <ChevronRight
          size={18}
          strokeWidth={2.2}
          className="nav-arrow"
        />
      )}
    </button>
  );
}

function SidebarSection({ title, items, currentPage }) {
  return (
    <section className="sidebar-section">
      <p className="nav-heading">{title}</p>

      <div className="nav-list">
        {items.map((item) => (
          <NavigationItem
            key={item.label}
            item={item}
            active={currentPage === item.label}
          />
        ))}
      </div>
    </section>
  );
}

function Sidebar() {
  const currentPage = "Dashboard";

  return (
    <aside className="sidebar">

      {/* ================= BRAND ================= */}

      <div className="brand">
        <div className="brand-logo">
          <Activity
            size={31}
            strokeWidth={2.2}
          />
        </div>

        <div className="brand-text">
          <h2>
            Medi<span>Optima</span>
          </h2>

          <p>
            <span className="brand-dot"></span>
            RESOURCE
            <br />
            <span className="brand-indent">
              INTELLIGENCE
            </span>
          </p>
        </div>
      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="system-status">

        <div className="system-icon">
          <Activity
            size={22}
            strokeWidth={2.2}
          />

          <span className="system-dot"></span>
        </div>

        <div className="system-status-text">
          <strong>System Operational</strong>

          <span>
            All services running normally
          </span>
        </div>

      </div>


      {/* ================= ALL NAVIGATION ================= */}

      <div className="sidebar-nav">

        <SidebarSection
          title="COMMAND CENTER"
          items={commandCenterItems}
          currentPage={currentPage}
        />

        <SidebarSection
          title="OPERATIONS"
          items={operationsItems}
          currentPage={currentPage}
        />

        <SidebarSection
          title="INTELLIGENCE"
          items={intelligenceItems}
          currentPage={currentPage}
        />

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="settings-item"
        >
          <span className="nav-icon">
            <Settings
              size={20}
              strokeWidth={2.1}
            />
          </span>

          <span className="nav-name">
            Settings
          </span>
        </button>


        {/* ADMIN PROFILE */}

        <div className="sidebar-admin">

          <div className="sidebar-admin-avatar">
            A
            <span></span>
          </div>

          <div className="sidebar-admin-info">
            <strong>Admin</strong>

            <span>
              Hospital Administrator
            </span>
          </div>

          <b>ONLINE</b>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;