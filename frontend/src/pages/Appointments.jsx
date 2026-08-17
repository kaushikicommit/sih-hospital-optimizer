import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/appointments`)
      .then((r) => r.json())
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Appointments</h2>
          <p className="dashboard-subtitle">Scheduled appointments.</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>All appointments ({appointments.length})</h3>
        </div>
        <div className="ward-list">
          {appointments.map((a) => (
            <div className="ward-row" key={a._id}>
              <div className="ward-name">
                {a.patientId?.name ?? "Patient"} with {a.doctorId?.name ?? "Doctor"}
              </div>
              <div className="ward-occupancy">{new Date(a.scheduledTime).toLocaleString()}</div>
              <span className="risk-badge tone-green">{a.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
