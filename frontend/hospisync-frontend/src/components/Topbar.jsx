export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="topbar">
      <div>
        <div className="topbar-eyebrow">{today}</div>
        <h1 className="topbar-title">Ward Overview</h1>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input placeholder="Search patients, wards, staff" />
        </div>
        <div className="topbar-avatar">A</div>
      </div>
    </header>
  );
}
