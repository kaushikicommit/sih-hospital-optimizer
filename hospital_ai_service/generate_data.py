"""
generate_data.py
-----------------
Simulates 2 years of daily historical hospital data across multiple wards.
This stands in for "historical/simulated data" since you won't have real
hospital records for a hackathon prototype. The patterns baked in
(weekday effect, seasonal flu spike, ward capacity, holidays) are realistic
enough that a model trained on this will show genuinely sensible behavior
in your demo -- e.g. predicted demand spikes in winter for General/ICU wards.

Run:
    python generate_data.py

Output:
    hospital_admissions.csv
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

np.random.seed(42)

WARDS = {
    # ward_name: (base_daily_admissions, capacity, seasonal_sensitivity)
    # capacities tuned tighter than raw demand so occupancy realistically
    # crosses into medium/high risk during weekends/flu season/monsoon
    "General": (18, 26, 1.0),
    "ICU": (4, 7, 0.6),
    "Pediatrics": (8, 12, 1.3),
    "Maternity": (6, 9, 0.2),
    "Orthopedics": (5, 8, 0.4),
}

START_DATE = datetime(2024, 1, 1)
NUM_DAYS = 730  # 2 years

def is_flu_season(month):
    # Northern-hemisphere-ish flu season peak Dec-Feb, secondary bump Jul-Aug (monsoon/viral in India)
    return month in (12, 1, 2)

def is_monsoon_season(month):
    return month in (7, 8, 9)

def generate():
    rows = []
    for day_offset in range(NUM_DAYS):
        date = START_DATE + timedelta(days=day_offset)
        dow = date.weekday()          # 0=Mon ... 6=Sun
        month = date.month
        is_weekend = 1 if dow >= 5 else 0
        flu = 1 if is_flu_season(month) else 0
        monsoon = 1 if is_monsoon_season(month) else 0
        # crude "holiday" flag: 1st and 15th of month, purely synthetic
        is_holiday = 1 if date.day in (1, 15, 26) else 0

        for ward, (base, capacity, seasonality) in WARDS.items():
            demand = base

            # weekday pattern: admissions dip on weekends for elective wards,
            # ICU/emergency stays roughly flat or ticks up (accidents, weekend risk)
            if ward in ("Orthopedics", "General", "Maternity", "Pediatrics"):
                demand *= 0.75 if is_weekend else 1.0
            if ward == "ICU" and is_weekend:
                demand *= 1.15

            # seasonal flu bump
            if flu:
                demand *= (1 + 0.5 * seasonality)

            # monsoon bump for pediatrics/general (waterborne/viral illness in India)
            if monsoon and ward in ("General", "Pediatrics"):
                demand *= 1.25

            # holidays: elective wards drop, ICU/general slightly up (accidents/travel)
            if is_holiday:
                if ward in ("Orthopedics", "Maternity"):
                    demand *= 0.7
                else:
                    demand *= 1.1

            # random daily noise
            demand *= np.random.normal(1.0, 0.15)
            demand = max(0, round(demand))

            # bed occupancy carried over from previous day (simple AR(1)-ish behavior)
            occupancy_rate = min(1.0, demand / capacity + np.random.normal(0, 0.05))
            occupancy_rate = max(0.05, occupancy_rate)

            rows.append({
                "date": date.strftime("%Y-%m-%d"),
                "day_of_week": dow,
                "month": month,
                "is_weekend": is_weekend,
                "is_flu_season": flu,
                "is_monsoon_season": monsoon,
                "is_holiday": is_holiday,
                "ward": ward,
                "ward_capacity": capacity,
                "admissions": demand,
                "occupancy_rate": round(occupancy_rate, 3),
            })

    df = pd.DataFrame(rows)

    # risk_level classification target derived from occupancy_rate
    # low: <60%, medium: 60-85%, high: >85%
    def risk(r):
        if r < 0.60:
            return "low"
        elif r < 0.85:
            return "medium"
        else:
            return "high"

    df["risk_level"] = df["occupancy_rate"].apply(risk)

    df.to_csv("hospital_admissions.csv", index=False)
    print(f"Generated {len(df)} rows -> hospital_admissions.csv")
    print(df.groupby("ward")["admissions"].describe()[["mean", "min", "max"]])
    print("\nRisk level distribution:")
    print(df["risk_level"].value_counts())

if __name__ == "__main__":
    generate()
