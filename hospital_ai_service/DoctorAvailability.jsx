/*
  DoctorAvailability.jsx
  -------------------------
  A "Check availability" button that calls the AI/ML service and shows
  either "Available now" or "Busy — free by 2:45 PM".

  Works the same on the patient page and the admin/staff page — just
  drop this component in wherever a doctor is being viewed/selected.

  Usage:
    <DoctorAvailability doctorId="D001" />

  Requires the FastAPI service running (default http://localhost:8000).
  If your Node backend proxies this instead of calling FastAPI directly
  from the browser, change API_BASE to your Node route.
*/

import { useState } from "react";

const API_BASE = "http://localhost:8000"; // change to your Node proxy route if needed

export default function DoctorAvailability({ doctorId }) {
  const [status, setStatus] = useState(null); // null | "loading" | result object | "error"

  async function checkAvailability() {
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/doctor-availability?doctor_id=${doctorId}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4 max-w-sm">
      <button
        onClick={checkAvailability}
        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
      >
        Check doctor availability
      </button>

      {status === "loading" && (
        <p className="mt-3 text-sm text-gray-500">Checking...</p>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          Could not fetch availability. Try again.
        </p>
      )}

      {status && status !== "loading" && status !== "error" && (
        <div className="mt-3 text-sm">
          <p className="font-medium text-gray-900">{status.doctor_name}</p>
          {status.status === "free" ? (
            <p className="text-green-600 mt-1">Available now</p>
          ) : (
            <>
              <p className="text-amber-600 mt-1">
                Busy — free by <span className="font-medium">{status.free_by}</span>
              </p>
              <p className="text-gray-500 mt-1">
                {status.queue_length} patient(s) ahead in queue
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
