import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMessage("Login successful!");

      // If backend returns token, store it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Go to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Header */}
      <div className="auth-page-header">

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

        <h1>Staff Login</h1>

        <p>
          Sign in to access the ForeCare staff dashboard.
        </p>

      </div>


      {/* Login Card */}
      <section className="auth-card">

        <div className="auth-card-header">
          <h2>Welcome back</h2>

          <p>
            Enter your staff credentials to continue.
          </p>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="auth-form-grid">

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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>


          {/* Message */}
          {message && (
            <p
              className={`auth-message ${
                message.toLowerCase().includes("success")
                  ? "auth-message-success"
                  : "auth-message-error"
              }`}
            >
              {message}
            </p>
          )}

        </form>


        {/* Register Link */}
        <div className="auth-footer">
          <span>New staff member?</span>

          <Link to="/register">
            Register here
          </Link>
        </div>

      </section>

    </div>
  );
}