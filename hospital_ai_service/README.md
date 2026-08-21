# Hospital Resource Optimization — AI/ML Service

This is the "intelligent" piece of your SIH prototype: it predicts per-ward
bed demand and occupancy risk so the rest of your system (Node backend,
allocation logic, dashboard) can react dynamically instead of using fixed
schedules.

## What's inside

| File | Purpose |
|---|---|
| `generate_data.py` | Simulates 2 years of realistic daily ward admission data (weekday effects, flu season, monsoon season, holidays). Replace with real/hospital-provided data if you get any. |
| `train_model.py` | Trains a **RandomForestRegressor** (predicts bed demand count) and a **RandomForestClassifier** (predicts risk_level: low/medium/high). Saves models + metrics to `models/`. |
| `app.py` | **FastAPI microservice** — your Node backend calls this over HTTP to get live predictions. |
| `push_predictions_to_mongo.py` | Alternative architecture — a script that periodically writes predictions straight into MongoDB, so Node only ever reads from the DB. |
| `requirements.txt` | Python dependencies. |

You don't need both `app.py` and `push_predictions_to_mongo.py` — pick
whichever integration style your team prefers (see below).

## Setup

```bash
pip install -r requirements.txt
python generate_data.py      # creates hospital_admissions.csv
python train_model.py        # creates models/*.joblib + models/metrics.json
```

`models/metrics.json` will have real numbers (MAE, R², accuracy, F1) you
can drop straight into your pitch deck — no need to make numbers up.

## Option A: Live API (recommended — more "wow" in a live demo)

```bash
uvicorn app:app --reload --port 8000
```

Node backend calls it like any REST API:

```js
const res = await fetch(`http://localhost:8000/predict?ward=ICU&date=2026-01-15`);
const prediction = await res.json();
// { ward, date, predicted_admissions, ward_capacity,
//   predicted_occupancy_pct, risk_level, recommended_action }
```

Or get every ward in one call (good for a dashboard refresh):

```
GET http://localhost:8000/predict/all-wards?date=2026-01-15
```

Interactive API docs (auto-generated, great for judges to poke at):
`http://localhost:8000/docs`

## Option B: Batch push into MongoDB

```bash
export MONGO_URI="mongodb://localhost:27017"   # or your Atlas connection string
python push_predictions_to_mongo.py --loop --interval 3600
```

This writes predictions for today + next 3 days into the
`hospital_resource_system.bed_demand_predictions` collection. Your Node
backend just queries Mongo directly — no dependency on the Python
process being up at request time, which is more resilient for a demo
where things might crash.

## How this plugs into "dynamic allocation"

The prediction alone isn't the product — it's the input to your
allocation logic. Suggested flow for the rest of the team:

1. **Node backend** calls `/predict/all-wards` (or reads from Mongo) on a
   timer or on dashboard load.
2. For any ward with `risk_level: "high"`, your allocation logic:
   - flags beds/staff to reassign from lower-risk wards
   - suggests deferring non-urgent scheduled appointments in that ward
   - surfaces an alert on the dashboard
3. Dashboard (React/whatever) shows predicted occupancy per ward as a
   simple bar/gauge, color-coded by `risk_level` — this is the visual
   that sells "intelligent" to judges.

## Feature: Doctor availability ("busy — free by X PM")

Lets patient and staff/admin pages check if a doctor is free right now,
or if busy, get an estimated free-by time — based on their live
appointment queue in MongoDB and a duration-prediction model.

### Setup

```bash
python generate_consultation_data.py   # simulated consultation duration history
python train_duration_model.py         # trains the duration-prediction model

export MONGO_URI="mongodb://localhost:27017"
python seed_mongo.py                   # populates doctors + live appointment queue
```

`test_availability.py` verifies the logic works with a fake in-memory
MongoDB (mongomock) — run `python test_availability.py` any time to
sanity-check the estimation logic without touching a real database.

### API

```
GET /doctor-availability?doctor_id=D001
```

Response when busy:
```json
{
  "doctor_id": "D001",
  "doctor_name": "Dr. Sharma",
  "status": "busy",
  "free_by": "02:45 PM",
  "queue_length": 2,
  "estimated_wait_minutes": 38
}
```

Response when free:
```json
{
  "doctor_id": "D001",
  "doctor_name": "Dr. Sharma",
  "status": "free",
  "free_by": "01:10 PM",
  "queue_length": 0
}
```

```
GET /doctors
```
Lists all doctors — use this to populate a dropdown on the frontend.

### Frontend

`DoctorAvailability.jsx` is a ready-to-use React component with a
"Check doctor availability" button. Drop it into both your patient page
and your admin/staff page:

```jsx
<DoctorAvailability doctorId="D001" />
```

### How it estimates the free-by time

1. Looks up the doctor's currently in-progress appointment
2. Predicts how many more minutes it will take (regression model, trained
   on appointment type / patient age group / first-visit flag)
3. Adds up predicted durations for everyone waiting in queue ahead
4. Returns the resulting free-by time

## Improving this if you have time

- Swap `RandomForest*` for `GradientBoosting*` or `xgboost` if you want to
  claim a fancier model name in your deck (won't meaningfully change
  accuracy on data this size, but judges like recognizable names).
- Add more features: local hospital's actual historical data if you can
  get any (even anonymized), nearby event calendars, weather API for
  real (not synthetic) seasonal signals.
- Retrain nightly on a rolling window of real usage data once the
  system is "live" — turns this from a static model into one that
  actually adapts, which matches the problem statement's "dynamically"
  requirement even more literally.
- Add a `/predict/staff-demand` and `/predict/diagnostic-load` endpoint
  using the same pattern, trained on separate simulated targets, if you
  want to visibly cover "beds, diagnostics, and staff" as three distinct
  predictions rather than implying beds ≈ everything.
