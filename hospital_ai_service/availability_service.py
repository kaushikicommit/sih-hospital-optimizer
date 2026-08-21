"""
availability_service.py
--------------------------
Core logic for "is the doctor free, and if not, when will they be free".

Kept separate from app.py (the API layer) so the estimation logic can be
unit-tested without needing a live MongoDB connection -- see
test_availability.py which uses mongomock to verify this works before
you ever touch a real database.

MongoDB collections expected:

  doctors: {
      "doctor_id": "D001",
      "name": "Dr. Sharma",
      "department": "General",
  }

  appointments: {
      "appointment_id": "A1001",
      "doctor_id": "D001",
      "patient_id": "P2001",
      "appointment_type": "new_consult" | "follow_up" | "checkup" | "emergency",
      "age_group": "child" | "adult" | "senior",
      "is_first_visit": 0 | 1,
      "status": "in_progress" | "waiting" | "completed",
      "start_time": datetime | None,   # actual start, set when status becomes in_progress
      "queue_position": int,           # order for "waiting" appointments
  }
"""

from datetime import datetime, timedelta

import joblib
import pandas as pd

FEATURE_COLS = ["appointment_type_enc", "age_group_enc", "department_enc", "is_first_visit"]


def load_duration_model(models_dir="models"):
    model = joblib.load(f"{models_dir}/duration_regressor.joblib")
    encoders = joblib.load(f"{models_dir}/duration_encoders.joblib")
    return model, encoders


def predict_duration(model, encoders, appointment: dict, department: str) -> int:
    """Predict how many minutes a single appointment will take."""
    def safe_encode(encoder, value, fallback_index=0):
        try:
            return int(encoder.transform([value])[0])
        except ValueError:
            # unseen category at inference time -- fall back gracefully
            # instead of crashing the whole prediction
            return fallback_index

    row = {
        "appointment_type_enc": safe_encode(encoders["appointment_type"], appointment.get("appointment_type", "checkup")),
        "age_group_enc": safe_encode(encoders["age_group"], appointment.get("age_group", "adult")),
        "department_enc": safe_encode(encoders["department"], department),
        "is_first_visit": int(appointment.get("is_first_visit", 0)),
    }
    features = pd.DataFrame([row])[FEATURE_COLS]
    minutes = float(model.predict(features)[0])
    return max(5, round(minutes))


def estimate_doctor_free_time(db, doctor_id: str, model, encoders, now: datetime = None) -> dict:
    """
    Looks up a doctor's current appointment + waiting queue in MongoDB,
    and estimates when they'll be free.

    `db` is a pymongo (or mongomock) Database object with `doctors` and
    `appointments` collections.
    """
    now = now or datetime.utcnow()

    doctor = db.doctors.find_one({"doctor_id": doctor_id})
    if not doctor:
        return {"error": f"Doctor '{doctor_id}' not found"}

    department = doctor.get("department", "General")

    in_progress = db.appointments.find_one({"doctor_id": doctor_id, "status": "in_progress"})

    if not in_progress:
        # doctor has no active appointment -> free right now
        return {
            "doctor_id": doctor_id,
            "doctor_name": doctor.get("name"),
            "status": "free",
            "free_by": now.strftime("%I:%M %p"),
            "queue_length": db.appointments.count_documents(
                {"doctor_id": doctor_id, "status": "waiting"}
            ),
        }

    # doctor is busy -- compute when current appointment ends
    start_time = in_progress.get("start_time", now)
    if isinstance(start_time, str):
        start_time = datetime.fromisoformat(start_time)

    current_duration = predict_duration(model, encoders, in_progress, department)
    free_at = start_time + timedelta(minutes=current_duration)

    # add up the waiting queue, in order
    waiting = list(
        db.appointments.find({"doctor_id": doctor_id, "status": "waiting"}).sort("queue_position", 1)
    )
    for appt in waiting:
        duration = predict_duration(model, encoders, appt, department)
        free_at += timedelta(minutes=duration)

    return {
        "doctor_id": doctor_id,
        "doctor_name": doctor.get("name"),
        "status": "busy",
        "free_by": free_at.strftime("%I:%M %p"),
        "queue_length": len(waiting),
        "estimated_wait_minutes": max(0, round((free_at - now).total_seconds() / 60)),
    }
