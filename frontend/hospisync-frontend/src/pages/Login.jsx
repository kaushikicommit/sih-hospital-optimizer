import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "staff",
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
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      /* ----------------------------------------
         SAVE TOKEN
         ---------------------------------------- */

      if (data.token) {
        localStorage.setItem("token", data.token);
      }


      /* ----------------------------------------
         SAVE USER
         ---------------------------------------- */

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }


      /* ----------------------------------------
         GET ROLE FROM BACKEND
         ---------------------------------------- */

      const backendRole =
        data.user?.role ||
        data.role ||
        form.role;


      /* ----------------------------------------
         CHECK ROLE
         ---------------------------------------- */

      if (
        backendRole &&
        form.role &&
        backendRole.toLowerCase() !==
          form.role.toLowerCase()
      ) {
        throw new Error(
          `This account is registered as ${backendRole}, not ${form.role}.`
        );
      }


      /* ----------------------------------------
         LOGIN SUCCESS
         ---------------------------------------- */

      setMessage("Login successful!");


      /* ----------------------------------------
         STAFF → STAFF DASHBOARD
         ---------------------------------------- */

      if (form.role === "staff") {
        setTimeout(() => {
          navigate("/dashboard");
        }, 400);

        return;
      }


      /* ----------------------------------------
         PATIENT → PATIENT PORTAL
         ---------------------------------------- */

      if (form.role === "patient") {
        setTimeout(() => {
          navigate("/patient-portal");
        }, 400);

        return;
      }

    } catch (error) {
      setMessage(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="auth-page-header">

        <div className="auth-brand">

          <div className="auth-brand-mark">
            +
          </div>

          <div>
            <div className="auth-brand-name">
              ForeCare
            </div>

            <div className="auth-brand-sub">
              Resource Optimizer
            </div>
          </div>

        </div>


        <h1>
          Staff & Patient Login
        </h1>

        <p>
          Sign in to access the ForeCare platform.
        </p>

      </div>


      {/* ========================================
          LOGIN CARD
          ======================================== */}

      <section className="auth-card">

        <div className="auth-card-header">

          <h2>
            Welcome back
          </h2>

          <p>
            Enter your credentials to continue.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="auth-form-grid">

            {/* ====================================
                ROLE
                ==================================== */}

            <div className="auth-field">

              <label htmlFor="role">
                Login as
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >

                <option value="staff">
                  Staff
                </option>

                <option value="patient">
                  Patient
                </option>

              </select>

            </div>


            {/* ====================================
                EMAIL
                ==================================== */}

            <div className="auth-field">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder={
                  form.role === "patient"
                    ? "patient@hospital.com"
                    : "staff@hospital.com"
                }
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* ====================================
                PASSWORD
                ==================================== */}

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


          {/* ======================================
              LOGIN BUTTON
              ====================================== */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Login"}

          </button>


          {/* ======================================
              MESSAGE
              ====================================== */}

          {message && (
            <p
              className={`auth-message ${
                message
                  .toLowerCase()
                  .includes("successful")
                  ? "auth-message-success"
                  : "auth-message-error"
              }`}
            >
              {message}
            </p>
          )}

        </form>


        {/* ========================================
            REGISTER LINK
            ======================================== */}

        <div className="auth-footer">

          <span>
            New staff member?
          </span>

          <Link to="/register">
            Register here
          </Link>

        </div>

      </section>

    </div>
  );
}