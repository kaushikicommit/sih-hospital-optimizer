"""
seed_mongo.py
---------------
Populates a REAL MongoDB with synthetic doctors + a live appointment
queue, so the /doctor-availability endpoint has something to query
during your demo. Run this once before your demo (or re-run to reset
the queue with fresh random data).

Setup:
    export MONGO_URI="mongodb://localhost:27017"   # or your Atlas URI

Run:
    python seed_mongo.py
"""

import os
import random
from datetime import datetime, timedelta

from pymongo import MongoClient

DOCTORS = [
    {"doctor_id": "D001", "name": "Dr. Sharma", "department": "General"},
    {"doctor_id": "D002", "name": "Dr. Verma", "department": "ICU"},
    {"doctor_id": "D003", "name": "Dr. Iyer", "department": "Pediatrics"},
    {"doctor_id": "D004", "name": "Dr. Khan", "department": "Maternity"},
    {"doctor_id": "D005", "name": "Dr. Rao", "department": "Orthopedics"},
]

APPOINTMENT_TYPES = ["new_consult", "follow_up", "checkup", "emergency"]
AGE_GROUPS = ["child", "adult", "senior"]


def make_appointment(appt_id, doctor_id, status, queue_position=None, start_time=None):
    return {
        "appointment_id": appt_id,
        "doctor_id": doctor_id,
        "patient_id": f"P{random.randint(1000, 9999)}",
        "appointment_type": random.choice(APPOINTMENT_TYPES),
        "age_group": random.choice(AGE_GROUPS),
        "is_first_visit": random.choice([0, 1]),
        "status": status,
        "start_time": start_time,
        "queue_position": queue_position,
    }


def seed():
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["hospital_resource_system"]

    db.doctors.delete_many({})
    db.appointments.delete_many({})

    db.doctors.insert_many(DOCTORS)

    now = datetime.utcnow()
    appt_counter = 1
    appointments = []

    for doc in DOCTORS:
        doctor_id = doc["doctor_id"]
        # roughly 70% chance a doctor is currently mid-appointment
        if random.random() < 0.7:
            started_minutes_ago = random.randint(1, 15)
            appointments.append(
                make_appointment(
                    f"A{appt_counter}", doctor_id, "in_progress",
                    start_time=now - timedelta(minutes=started_minutes_ago),
                )
            )
            appt_counter += 1

            # 0-4 people waiting behind them
            queue_size = random.randint(0, 4)
            for i in range(queue_size):
                appointments.append(
                    make_appointment(f"A{appt_counter}", doctor_id, "waiting", queue_position=i + 1)
                )
                appt_counter += 1

    db.appointments.insert_many(appointments)

    print(f"Seeded {len(DOCTORS)} doctors and {len(appointments)} appointments into MongoDB.")
    print("Doctor IDs you can query: " + ", ".join(d["doctor_id"] for d in DOCTORS))


if __name__ == "__main__":
    seed()
