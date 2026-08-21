"""
app.py
-------
FastAPI microservice that your Node/Express backend calls to get
bed-demand predictions. This is the "intelligent" piece of the
resource-optimization system.

Run:
    uvicorn app:app --reload --port 8000

Then test:
    curl http://localhost:8000/health
    curl "http://localhost:8000/predict?ward=ICU&date=2026-01-15"

From your Node backend, call it like any REST API:
    const res = await fetch(`http://localhost:8000/predict?ward=${ward}&date=${date}`);
    const prediction = await res.json();

Docs auto-generated at: http://localhost:8000/docs
"""

from datetime import datetime
from typing import Optional

import os

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

from availability_service import load_duration_model, estimate_doctor_free_time

app = FastAPI(
    title="Hospital Resource Optimization - Prediction Service",
    description="Predicts per-ward bed demand and occupancy risk for dynamic resource allocation.",
    version="1.0.0",
)

# allow the Node backend / React dashboard to call this cross-origin during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load models once at startup (not per-request -- keeps latency low)
# ---------------------------------------------------------------------------
try:
    regressor = joblib.load("models/demand_regressor.joblib")
    classifier = joblib.load("models/risk_classifier.joblib")
    ward_encoder = joblib.load("models/ward_encoder.joblib")
except FileNotFoundError:
    raise RuntimeError(
        "Model files not found. Run `python generate_data.py` then "
        "`python train_model.py` before starting the service."
    )

# ward capacities must match generate_data.py -- in a real system this
# would come from a hospital_config collection in MongoDB instead of
# being hardcoded here.
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

# ---------------------------------------------------------------------------
# Doctor-availability: connects to MongoDB + the consultation-duration model
# ---------------------------------------------------------------------------
duration_model, duration_encoders = load_duration_model()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
mongo_db = mongo_client["hospital_resource_system"]


class PredictionResponse(BaseModel):
    ward: str
    date: str
    predicted_admissions: int
    ward_capacity: int
    predicted_occupancy_pct: float
    risk_level: str
    recommended_action: str


def build_features(ward: str, date_str: str) -> pd.DataFrame:
    if ward not in WARD_CAPACITY:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown ward '{ward}'. Valid wards: {list(WARD_CAPACITY.keys())}",
        )
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="date must be in YYYY-MM-DD format")

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
        "high": f"Trigger overflow protocol: reassign nurses to {ward}, flag elective admissions for reschedule, alert bed management team.",
        "medium": f"Monitor {ward} closely; pre-stage discharge planning to free beds proactively.",
        "low": f"Normal staffing sufficient for {ward}; capacity available for transfers from other wards.",
    }
    return actions.get(risk_level, "No action needed.")


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": True}


@app.get("/wards")
def list_wards():
    return {"wards": list(WARD_CAPACITY.keys())}


@app.get("/predict", response_model=PredictionResponse)
def predict(
    ward: str = Query(..., description="Ward name, e.g. ICU, General, Pediatrics"),
    date: str = Query(..., description="Target date, format YYYY-MM-DD"),
):
    """Predict bed demand + risk level for a single ward on a given date."""
    features = build_features(ward, date)

    predicted_admissions = max(0, round(float(regressor.predict(features)[0])))
    risk_level = classifier.predict(features)[0]
    capacity = WARD_CAPACITY[ward]
    occupancy_pct = round(min(100.0, predicted_admissions / capacity * 100), 1)

    return PredictionResponse(
        ward=ward,
        date=date,
        predicted_admissions=predicted_admissions,
        ward_capacity=capacity,
        predicted_occupancy_pct=occupancy_pct,
        risk_level=risk_level,
        recommended_action=recommend_action(risk_level, ward),
    )


@app.get("/predict/all-wards")
def predict_all_wards(date: str = Query(..., description="Target date, format YYYY-MM-DD")):
    """Predict for every ward at once -- handy for a single dashboard refresh call."""
    results = []
    for ward in WARD_CAPACITY:
        features = build_features(ward, date)
        predicted_admissions = max(0, round(float(regressor.predict(features)[0])))
        risk_level = classifier.predict(features)[0]
        capacity = WARD_CAPACITY[ward]
        occupancy_pct = round(min(100.0, predicted_admissions / capacity * 100), 1)
        results.append({
            "ward": ward,
            "predicted_admissions": predicted_admissions,
            "ward_capacity": capacity,
            "predicted_occupancy_pct": occupancy_pct,
            "risk_level": risk_level,
            "recommended_action": recommend_action(risk_level, ward),
        })
    return {"date": date, "predictions": results}


@app.get("/doctor-availability")
def doctor_availability(
    doctor_id: str = Query(..., description="Doctor ID, e.g. D001"),
):
    """
    Checks MongoDB for the doctor's current appointment + waiting queue,
    and returns whether they're free now, or when they will be free.
    Used by both the patient-facing and admin/staff-facing pages.
    """
    try:
        result = estimate_doctor_free_time(mongo_db, doctor_id, duration_model, duration_encoders)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not reach MongoDB or compute estimate: {e}")

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@app.get("/doctors")
def list_doctors():
    """Lists all doctors -- handy for populating a dropdown on the frontend."""
    try:
        doctors = list(mongo_db.doctors.find({}, {"_id": 0}))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not reach MongoDB: {e}")
    return {"doctors": doctors}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
