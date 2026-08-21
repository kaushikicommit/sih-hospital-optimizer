"""
test_availability.py
-----------------------
Sanity-checks availability_service.py using mongomock -- an in-memory
fake MongoDB. This lets us verify the logic works BEFORE connecting to
a real database. Not needed for production, just for verifying the code.

Run:
    python test_availability.py
"""

from datetime import datetime, timedelta
import mongomock

from availability_service import load_duration_model, estimate_doctor_free_time


def main():
    model, encoders = load_duration_model()
    client = mongomock.MongoClient()
    db = client["hospital_test"]

    now = datetime.utcnow()

    db.doctors.insert_many([
        {"doctor_id": "D001", "name": "Dr. Sharma", "department": "General"},
        {"doctor_id": "D002", "name": "Dr. Verma", "department": "ICU"},
    ])

    # D001 is currently mid-appointment, with 2 people waiting
    db.appointments.insert_many([
        {
            "appointment_id": "A1", "doctor_id": "D001", "patient_id": "P1",
            "appointment_type": "new_consult", "age_group": "senior",
            "is_first_visit": 1, "status": "in_progress",
            "start_time": now - timedelta(minutes=5),
        },
        {
            "appointment_id": "A2", "doctor_id": "D001", "patient_id": "P2",
            "appointment_type": "follow_up", "age_group": "adult",
            "is_first_visit": 0, "status": "waiting", "queue_position": 1,
        },
        {
            "appointment_id": "A3", "doctor_id": "D001", "patient_id": "P3",
            "appointment_type": "checkup", "age_group": "child",
            "is_first_visit": 0, "status": "waiting", "queue_position": 2,
        },
    ])

    # D002 has no active appointment -> should be "free"
    print("Test 1: Busy doctor with 2-person queue")
    result1 = estimate_doctor_free_time(db, "D001", model, encoders, now=now)
    print(result1)
    assert result1["status"] == "busy"
    assert result1["queue_length"] == 2
    print("PASSED\n")

    print("Test 2: Free doctor (no active appointment)")
    result2 = estimate_doctor_free_time(db, "D002", model, encoders, now=now)
    print(result2)
    assert result2["status"] == "free"
    print("PASSED\n")

    print("Test 3: Unknown doctor ID")
    result3 = estimate_doctor_free_time(db, "D999", model, encoders, now=now)
    print(result3)
    assert "error" in result3
    print("PASSED\n")

    print("All tests passed.")


if __name__ == "__main__":
    main()
