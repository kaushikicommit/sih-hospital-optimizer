"""
train_duration_model.py
--------------------------
Trains a regression model that predicts how long a single consultation
will take, based on appointment type, patient age group, department,
and whether it's a first visit. This feeds the doctor-availability
estimator (availability_service.py).

Run:
    python train_duration_model.py

Output:
    models/duration_regressor.joblib
    models/duration_encoders.joblib
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

FEATURE_COLS = ["appointment_type_enc", "age_group_enc", "department_enc", "is_first_visit"]

def main():
    df = pd.read_csv("consultation_history.csv")

    encoders = {}
    for col in ["appointment_type", "age_group", "department"]:
        le = LabelEncoder()
        df[col + "_enc"] = le.fit_transform(df[col])
        encoders[col] = le

    X = df[FEATURE_COLS]
    y = df["duration_minutes"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=150, max_depth=8, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, pred)
    r2 = r2_score(y_test, pred)
    print(f"[Duration model] MAE: {mae:.2f} min | R^2: {r2:.3f}")

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/duration_regressor.joblib")
    joblib.dump(encoders, "models/duration_encoders.joblib")
    print("Saved models/duration_regressor.joblib and models/duration_encoders.joblib")

if __name__ == "__main__":
    main()
