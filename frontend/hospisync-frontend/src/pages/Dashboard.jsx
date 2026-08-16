import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";
const AI_BASE = "http://localhost:8000";

// Fallback data so the UI never looks broken if a service is down
const FALLBACK_STATS = { totalBeds: 120, occupiedBeds: 87, totalStaff: 45, staffOnDuty: 31, totalPatients: 96, todaysAppointments: 18 };
const FALLBACK_WARDS = [
  { ward: "General", occupancy: 78, risk: "moderate" },
  { ward: "ICU", occupancy: 92, risk: "high" },
  { ward: "Maternity", occupancy: 54, risk: "low" },
  { ward: "Pediatric", occupancy: 61, risk: "low" },
  { ward: "Surgery", occupancy: 85, risk: "moderate" },
];

function useFetch(url, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setIsLive(true);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLive(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, isLive };
}

function StatCard({ label, value, sub, tone = "teal" }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value tone-${tone}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function riskTone(risk) {
  if (risk === "high" || risk === "critical") return "coral";
  if (risk === "moderate" || risk === "medium") return "amber";
  return "green";
}

export default function Dashboard() {
  const { data: stats, isLive: statsLive } = useFetch(`${API_BASE}/dashboard`, FALLBACK_STATS);
  const { data: wardsRaw, isLive: wardsLive } = useFetch(`${AI_BASE}/predict/all-wards`, FALLBACK_WARDS);

  const wards = Array.isArray(wardsRaw) ? wardsRaw : FALLBACK_WARDS;

  const occupancyPct = stats?.totalBeds
    ? Math.round(((stats.occupiedBeds ?? 0) / stats.totalBeds) * 100)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Hospital status, at a glance</h2>
          <p className="dashboard-subtitle">
            Live occupancy, staffing, and AI-forecasted ward risk.
          </p>
        </div>
        <div className={`live-pill ${statsLive ? "on" : "off"}`}>
          <span className="status-dot" />
          {statsLive ? "Backend connected" : "Showing sample data"}
        </div>
      </div>

      <div className="pulse-divider" aria-hidden="true">
        <svg viewBox="0 0 400 24" preserveAspectRatio="none">
          <path
            d="M0 12 H140 L155 3 L170 21 L185 12 H400"
            fill="none"
            stroke="var(--teal-700)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="stat-grid">
        <StatCard label="Total beds" value={stats?.totalBeds ?? "—"} sub={`${occupancyPct}% occupied`} />
        <StatCard
          label="Beds occupied"
          value={stats?.occupiedBeds ?? "—"}
          sub={`${(stats?.totalBeds ?? 0) - (stats?.occupiedBeds ?? 0)} available`}
          tone="coral"
        />
        <StatCard label="Staff on duty" value={stats?.staffOnDuty ?? "—"} sub={`of ${stats?.totalStaff ?? "—"} total`} />
        <StatCard label="Patients admitted" value={stats?.totalPatients ?? "—"} />
        <StatCard label="Today's appointments" value={stats?.todaysAppointments ?? "—"} tone="amber" />
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Ward occupancy & AI risk forecast</h3>
            <span className={`live-pill small ${wardsLive ? "on" : "off"}`}>
              <span className="status-dot" />
              {wardsLive ? "AI service live" : "sample"}
            </span>
          </div>

          <div className="ward-list">
            {wards.map((w, i) => (
              <div className="ward-row" key={w.ward ?? i}>
                <div className="ward-name">{w.ward ?? w.name ?? `Ward ${i + 1}`}</div>
                <div className="ward-bar-track">
                  <div
                    className="ward-bar-fill"
                    style={{ width: `${w.occupancy ?? 0}%` }}
                  />
                </div>
                <div className="ward-occupancy">{w.occupancy ?? 0}%</div>
                <span className={`risk-badge tone-${riskTone(w.risk)}`}>
                  {w.risk ?? "n/a"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel-narrow">
          <div className="panel-header">
            <h3>Quick actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action">Admit patient</button>
            <button className="quick-action">Assign bed</button>
            <button className="quick-action">Schedule appointment</button>
            <button className="quick-action">Roster staff</button>
          </div>
        </section>
      </div>
    </div>
  );
}
