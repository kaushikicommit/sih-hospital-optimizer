"""
push_predictions_to_mongo.py
------------------------------
Alternative to running the FastAPI service live: this script runs
periodically (e.g. every hour via cron, or a simple `while True` + sleep
for the demo) and writes fresh predictions directly into a MongoDB
collection. Your Node backend then just reads from Mongo -- no HTTP
call to Python needed at request time.

Use this approach if your team prefers "Python computes offline, Node
only reads from DB" over "Node calls a live Python API".

Setup:
    pip install pymongo
    export MONGO_URI="mongodb://localhost:27017"   # or your Atlas URI

Run once:
    python push_predictions_to_mongo.py

Run continuously for a live demo (refreshes every 60s):
    python push_predictions_to_mongo.py --loop --interval 60
"""

import argparse
import os
import time
from datetime import datetime, timedelta

import joblib
import pandas as pd
from pymongo import MongoClient

WARD_CAPACITY = {
    "General": 26,
    "ICU": 7,
    "Pediatrics": 12,
    "Maternity": 9,
    "Orthopedics": 8,
}

FEATURE_COLS = [
    "day_of_week", "month", "is_weekend", "is_flu_season",
    "is_monsoon_season", "is_holiday", "ward_encoded", "ward_capacity",
]

regressor = joblib.load("models/demand_regressor.joblib")
classifier = joblib.load("models/risk_classifier.joblib")
ward_encoder = joblib.load("models/ward_encoder.joblib")


def build_features(ward: str, date: datetime) -> pd.DataFrame:
    month = date.month
    row = {
        "day_of_week": date.weekday(),
        "month": month,
        "is_weekend": 1 if date.weekday() >= 5 else 0,
        "is_flu_season": 1 if month in (12, 1, 2) else 0,
        "is_monsoon_season": 1 if month in (7, 8, 9) else 0,
        "is_holiday": 1 if date.day in (1, 15, 26) else 0,
        "ward_encoded": int(ward_encoder.transform([ward])[0]),
        "ward_capacity": WARD_CAPACITY[ward],
    }
    return pd.DataFrame([row])[FEATURE_COLS]


def recommend_action(risk_level: str, ward: str) -> str:
    actions = {
        "high": f"Trigger overflow protocol for {ward}: reassign staff, delay elective admissions.",
        "medium": f"Monitor {ward} closely; pre-stage discharges.",
        "low": f"{ward} has spare capacity; available for transfers.",
    }
    return actions.get(risk_level, "No action needed.")


def run_once(collection, days_ahead: int = 3):
    """Predict for today + next `days_ahead` days, for every ward."""
    now = datetime.utcnow()
    written = 0
    for offset in range(days_ahead + 1):
        target_date = now + timedelta(days=offset)
        for ward in WARD_CAPACITY:
            features = build_features(ward, target_date)
            predicted_admissions = max(0, round(float(regressor.predict(features)[0])))
            risk_level = classifier.predict(features)[0]
            capacity = WARD_CAPACITY[ward]
            occupancy_pct = round(min(100.0, predicted_admissions / capacity * 100), 1)

            doc = {
                "ward": ward,
                "date": target_date.strftime("%Y-%m-%d"),
                "predicted_admissions": predicted_admissions,
                "ward_capacity": capacity,
                "predicted_occupancy_pct": occupancy_pct,
                "risk_level": risk_level,
                "recommended_action": recommend_action(risk_level, ward),
                "generated_at": datetime.utcnow(),
            }
            # upsert so re-running doesn't create duplicate rows for same ward+date
            collection.update_one(
                {"ward": ward, "date": doc["date"]},
                {"$set": doc},
                upsert=True,
            )
            written += 1
    print(f"[{datetime.utcnow().isoformat()}] Wrote {written} predictions to MongoDB.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop", action="store_true", help="Run continuously")
    parser.add_argument("--interval", type=int, default=3600, help="Seconds between runs when looping")
    parser.add_argument("--days-ahead", type=int, default=3, help="How many future days to predict")
    args = parser.parse_args()

    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["hospital_resource_system"]
    collection = db["bed_demand_predictions"]

    if args.loop:
        print(f"Looping every {args.interval}s. Ctrl+C to stop.")
        while True:
            run_once(collection, args.days_ahead)
            time.sleep(args.interval)
    else:
        run_once(collection, args.days_ahead)


if __name__ == "__main__":
    main()
