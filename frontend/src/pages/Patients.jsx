import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", condition: "", priority: "medium" });
  const [msg, setMsg] = useState("");

  const loadPatients = () => {
    fetch(`${API_BASE}/patients`)
      .then((r) => r.json())
      .then(setPatients)
      .catch(() => setPatients([]));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) throw new Error();
      setForm({ name: "", age: "", condition: "", priority: "medium" });
      setMsg("Patient registered");
      loadPatients();
    } catch {
      setMsg("Failed to register patient");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Patients</h2>
          <p className="dashboard-subtitle">Registered patients.</p>
        </div>
      </div>

      <section className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <h3>Register new patient</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "12px 0" }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          <input placeholder="Condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} required />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {["critical", "high", "medium", "low"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button className="quick-action" type="submit">Register</button>
        </form>
        {msg && <div className="stat-sub">{msg}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>All patients ({patients.length})</h3>
        </div>
        <div className="ward-list">
          {patients.map((p) => (
            <div className="ward-row" key={p._id}>
              <div className="ward-name">{p.name} — {p.condition}</div>
              <span className={`risk-badge tone-${p.priority === "critical" ? "coral" : p.priority === "high" ? "amber" : "green"}`}>
                {p.priority}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
