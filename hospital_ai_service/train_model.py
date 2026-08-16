"""
train_model.py
----------------
Trains two models on hospital_admissions.csv:

1. REGRESSION  -> predicts `admissions` (bed demand count) for a ward/day
2. CLASSIFICATION -> predicts `risk_level` (low/medium/high occupancy)

This satisfies the "regression/classification model" requirement directly:
you get a number to allocate resources against AND a traffic-light label
that's easy to show on a dashboard for judges.

Run:
    python train_model.py

Output:
    models/demand_regressor.joblib
    models/risk_classifier.joblib
    models/ward_encoder.joblib
    models/metrics.json   (so you can quote accuracy/MAE in your PPT)
"""

import json
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score, f1_score
import joblib

FEATURE_COLS = [
    "day_of_week", "month", "is_weekend", "is_flu_season",
    "is_monsoon_season", "is_holiday", "ward_encoded", "ward_capacity",
]

def main():
    df = pd.read_csv("hospital_admissions.csv")

    # encode ward name -> integer for the model
    ward_encoder = LabelEncoder()
    df["ward_encoded"] = ward_encoder.fit_transform(df["ward"])

    X = df[FEATURE_COLS]

    # ---------- Regression: predict bed demand (admissions count) ----------
    y_reg = df["admissions"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_reg, test_size=0.2, random_state=42
    )
    regressor = RandomForestRegressor(
        n_estimators=200, max_depth=10, random_state=42, n_jobs=-1
    )
    regressor.fit(X_train, y_train)
    y_pred = regressor.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"[Regression] MAE: {mae:.2f} beds  |  R^2: {r2:.3f}")

    # ---------- Classification: predict risk_level ----------
    y_clf = df["risk_level"]
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )
    classifier = RandomForestClassifier(
        n_estimators=200, max_depth=10, random_state=42, n_jobs=-1
    )
    classifier.fit(X_train_c, y_train_c)
    y_pred_c = classifier.predict(X_test_c)
    acc = accuracy_score(y_test_c, y_pred_c)
    f1 = f1_score(y_test_c, y_pred_c, average="weighted")
    print(f"[Classification] Accuracy: {acc:.3f}  |  Weighted F1: {f1:.3f}")

    # feature importance (nice slide for judges: "what drives demand")
    importances = dict(zip(FEATURE_COLS, regressor.feature_importances_.round(3)))
    print("\nFeature importance (regression):", importances)

    os.makedirs("models", exist_ok=True)
    joblib.dump(regressor, "models/demand_regressor.joblib")
    joblib.dump(classifier, "models/risk_classifier.joblib")
    joblib.dump(ward_encoder, "models/ward_encoder.joblib")

    with open("models/metrics.json", "w") as f:
        json.dump({
            "regression_mae_beds": round(mae, 3),
            "regression_r2": round(r2, 3),
            "classification_accuracy": round(acc, 3),
            "classification_f1_weighted": round(f1, 3),
            "feature_importance": {k: float(v) for k, v in importances.items()},
        }, f, indent=2)

    print("\nSaved models to ./models/")

if __name__ == "__main__":
    main()
