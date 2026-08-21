import { useState } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

export default function PatientPortal() {
  const [query, setQuery] = useState("");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setMessage("Please enter a patient name, ID, or email.");
      setPatient(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setPatient(null);

    try {
      const response = await fetch(
        `${API_BASE}/patients?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Unable to search patient records.");
      }

      const data = await response.json();

      const results =
        Array.isArray(data)
          ? data
          : data.patients || data.data || [];

      if (!results.length) {
        setMessage("No patient found.");
        return;
      }

      setPatient(results[0]);
    } catch (error) {
      setMessage(
        error.message || "Unable to search patient records."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-portal">

      <div className="patient-portal-header">
        <div>
          <p className="dashboard-kicker">
            ForeCare Patient Portal
          </p>

          <h1 className="dashboard-title">
            Find Your Doctor
          </h1>

          <p className="dashboard-subtitle">
            Search your patient record to view your appointed
            doctor and current location.
          </p>
        </div>
      </div>


      <section className="panel patient-search-card">

        <div className="panel-header">
          <div>
            <h3>Search Patient</h3>

            <p>
              Enter your name, patient ID, or registered email.
            </p>
          </div>
        </div>


        <form
          onSubmit={handleSearch}
          className="patient-search-form"
        >

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient name, ID or email..."
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </form>


        {message && (
          <p className="patient-search-message">
            {message}
          </p>
        )}


        {patient && (
          <div className="patient-result">

            <div className="patient-result-header">
              <div>
                <span className="patient-result-label">
                  Patient
                </span>

                <h2>
                  {patient.name ||
                    patient.fullName ||
                    patient.patientName ||
                    "Patient"}
                </h2>
              </div>
            </div>


            <div className="patient-info-grid">

              <div className="patient-info-item">
                <span>Patient ID</span>

                <strong>
                  {patient.patientId ||
                    patient.id ||
                    "Not available"}
                </strong>
              </div>


              <div className="patient-info-item">
                <span>Doctor</span>

                <strong>
                  {patient.doctorName ||
                    patient.doctor?.name ||
                    patient.doctor ||
                    "Not assigned"}
                </strong>
              </div>


              <div className="patient-info-item">
                <span>Department</span>

                <strong>
                  {patient.department ||
                    patient.doctor?.department ||
                    "Not available"}
                </strong>
              </div>


              <div className="patient-info-item">
                <span>Room</span>

                <strong>
                  {patient.roomNumber ||
                    patient.room ||
                    patient.bed?.room ||
                    "Not assigned"}
                </strong>
              </div>


              <div className="patient-info-item">
                <span>Bed</span>

                <strong>
                  {patient.bedNumber ||
                    patient.bed ||
                    patient.bed?.number ||
                    "Not assigned"}
                </strong>
              </div>

            </div>

          </div>
        )}

      </section>

    </div>
  );
}