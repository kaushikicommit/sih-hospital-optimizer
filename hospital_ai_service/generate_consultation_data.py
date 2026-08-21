"""
generate_consultation_data.py
-------------------------------
Simulates historical consultation records: how long a doctor actually
spends per appointment, based on appointment type and patient factors.
Used to train a regression model that predicts "how long will THIS
appointment take", which feeds the doctor-availability estimator.

Run:
    python generate_consultation_data.py

Output:
    consultation_history.csv
"""

import numpy as np
import pandas as pd

np.random.seed(7)

APPOINTMENT_TYPES = {
    # type: (base_minutes, variability)
    "new_consult": (25, 6),
    "follow_up": (12, 4),
    "checkup": (15, 4),
    "emergency": (30, 10),
}

AGE_GROUPS = ["child", "adult", "senior"]
DEPARTMENTS = ["General", "ICU", "Pediatrics", "Maternity", "Orthopedics"]

NUM_RECORDS = 4000

def generate():
    rows = []
    for _ in range(NUM_RECORDS):
        appt_type = np.random.choice(list(APPOINTMENT_TYPES.keys()), p=[0.3, 0.4, 0.25, 0.05])
        base, spread = APPOINTMENT_TYPES[appt_type]
        age_group = np.random.choice(AGE_GROUPS, p=[0.2, 0.55, 0.25])
        department = np.random.choice(DEPARTMENTS)
        is_first_visit = np.random.choice([0, 1], p=[0.7, 0.3])

        duration = base
        if age_group == "senior":
            duration += 4  # seniors tend to take a bit longer
        if age_group == "child":
            duration += 2
        if is_first_visit:
            duration += 5  # first visits take longer (history-taking)
        if department == "ICU":
            duration += 8
        if department == "Maternity":
            duration += 3

        duration += np.random.normal(0, spread)
        duration = max(5, round(duration))

        rows.append({
            "appointment_type": appt_type,
            "age_group": age_group,
            "department": department,
            "is_first_visit": is_first_visit,
            "duration_minutes": duration,
        })

    df = pd.DataFrame(rows)
    df.to_csv("consultation_history.csv", index=False)
    print(f"Generated {len(df)} records -> consultation_history.csv")
    print(df.groupby("appointment_type")["duration_minutes"].mean().round(1))

if __name__ == "__main__":
    generate()
