import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000/api";

export default function StaffRegister() {
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
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

      setSuccess(true);
      setMessage(
        "Staff registered successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Page Header */}
      <div className="auth-page-header">
        <div>
          <div className="auth-brand">
            <div className="auth-brand-mark">+</div>

            <div>
              <div className="auth-brand-name">
                ForeCare
              </div>

              <div className="auth-brand-sub">
                Resource Optimizer
              </div>
            </div>
          </div>

          <h1>Staff Registration</h1>

          <p>
            Register a new hospital staff member.
          </p>
        </div>
      </div>

      {/* Registration Card */}
      <section className="auth-card">

        <div className="auth-card-header">
          <div>
            <h2>Register New Staff</h2>

            <p>
              Enter the staff member's details to create
              their account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-form-grid">

            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Staff ID */}
            <div className="auth-field">
              <label htmlFor="staffId">
                Staff ID
              </label>

              <input
                id="staffId"
                type="text"
                name="staffId"
                placeholder="e.g. DOC001"
                value={form.staffId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="staff@hospital.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="auth-field">
              <label htmlFor="role">
                Role
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="Doctor">
                  Doctor
                </option>

                <option value="Nurse">
                  Nurse
                </option>

                <option value="Technician">
                  Technician
                </option>

                <option value="Support">
                  Support
                </option>
              </select>
            </div>

            {/* Department */}
            <div className="auth-field">
              <label htmlFor="department">
                Department
              </label>

              <input
                id="department"
                type="text"
                name="department"
                placeholder="e.g. Cardiology"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            {/* Shift */}
            <div className="auth-field">
              <label htmlFor="shift">
                Shift
              </label>

              <select
                id="shift"
                name="shift"
                value={form.shift}
                onChange={handleChange}
              >
                <option value="Morning">
                  Morning
                </option>

                <option value="Evening">
                  Evening
                </option>

                <option value="Night">
                  Night
                </option>
              </select>
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register Staff"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`auth-message ${
                success
                  ? "auth-message-success"
                  : "auth-message-error"
              }`}
            >
              {message}
            </div>
          )}

        </form>

        {/* Login */}
        <div className="auth-footer">
          Already registered?

          <Link to="/login">
            Login here
          </Link>
        </div>

      </section>
    </div>
  );
}