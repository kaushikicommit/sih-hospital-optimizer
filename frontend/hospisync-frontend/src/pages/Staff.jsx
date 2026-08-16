import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", role: "Doctor", department: "General", shift: "Morning" });
  const [msg, setMsg] = useState("");

  const loadStaff = () => {
    fetch(`${API_BASE}/staff`)
      .then((r) => r.json())
      .then(setStaff)
      .catch(() => setStaff([]));
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "on-duty" }),
      });
      if (!res.ok) throw new Error();
      setForm({ name: "", role: "Doctor", department: "General", shift: "Morning" });
      setMsg("Staff added");
      loadStaff();
    } catch {
      setMsg("Failed to add staff");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Staff</h2>
          <p className="dashboard-subtitle">All staff and their current workload.</p>
        </div>
      </div>

      <section className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <h3>Add new staff</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "12px 0" }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {["Doctor", "Nurse", "Technician", "Support"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
            {["Morning", "Evening", "Night"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="quick-action" type="submit">Add staff</button>
        </form>
        {msg && <div className="stat-sub">{msg}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>All staff ({staff.length})</h3>
        </div>
        <div className="ward-list">
          {staff.map((s) => (
            <div className="ward-row" key={s._id}>
              <div className="ward-name">{s.name} — {s.role}, {s.department}</div>
              <div className="ward-occupancy">{s.currentLoad}/{s.maxLoad}</div>
              <span className={`risk-badge tone-${s.status === "on-duty" ? "green" : "amber"}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
