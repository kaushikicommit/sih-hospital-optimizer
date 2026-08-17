import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

export default function Beds() {
  const [beds, setBeds] = useState([]);
  const [form, setForm] = useState({ bedNumber: "", ward: "General" });
  const [msg, setMsg] = useState("");

  const loadBeds = () => {
    fetch(`${API_BASE}/beds`)
      .then((r) => r.json())
      .then(setBeds)
      .catch(() => setBeds([]));
  };

  useEffect(() => {
    loadBeds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/beds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ bedNumber: "", ward: "General" });
      setMsg("Bed added");
      loadBeds();
    } catch {
      setMsg("Failed to add bed");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Beds</h2>
          <p className="dashboard-subtitle">All beds and their current status.</p>
        </div>
      </div>

      <section className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <h3>Add new bed</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "12px 0" }}>
          <input
            placeholder="Bed number (e.g. B031)"
            value={form.bedNumber}
            onChange={(e) => setForm({ ...form, bedNumber: e.target.value })}
            required
          />
          <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })}>
            {["General", "ICU", "Emergency", "Pediatric", "Maternity"].map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button className="quick-action" type="submit">Add bed</button>
        </form>
        {msg && <div className="stat-sub">{msg}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>All beds ({beds.length})</h3>
        </div>
        <div className="ward-list">
          {beds.map((b) => (
            <div className="ward-row" key={b._id}>
              <div className="ward-name">{b.bedNumber} — {b.ward}</div>
              <span className={`risk-badge tone-${b.status === "available" ? "green" : b.status === "occupied" ? "coral" : "amber"}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
