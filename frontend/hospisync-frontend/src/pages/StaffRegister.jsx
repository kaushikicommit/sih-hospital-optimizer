import { useState } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

export default function StaffRegister() {
  const [form, setForm] = useState({
    name: "",
    staffId: "",
    email: "",
    password: "",
    role: "Doctor",
    department: "General",
    shift: "Morning",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Staff registered successfully!");

      setForm({
        name: "",
        staffId: "",
        email: "",
        password: "",
        role: "Doctor",
        department: "General",
        shift: "Morning",
      });
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Staff Registration</h2>
          <p className="dashboard-subtitle">
            Register a new hospital staff member.
          </p>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 24 }}>
        <div className="panel-header">
          <h3>Register New Staff</h3>
        </div>

        <form onSubmit={handleSubmit}>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >

            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Staff ID</label>
              <input
                type="text"
                name="staffId"
                placeholder="e.g. DOC001"
                value={form.staffId}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="staff@hospital.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label>Department</label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Cardiology"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Shift</label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="quick-action"
            disabled={loading}
            style={{
              marginTop: 20,
              textAlign: "center",
              width: "180px",
            }}
          >
            {loading ? "Registering..." : "Register Staff"}
          </button>

          {message && (
            <p
              style={{
                marginTop: 16,
                fontWeight: 600,
              }}
            >
              {message}
            </p>
          )}

        </form>
      </section>

    </div>
  );
}