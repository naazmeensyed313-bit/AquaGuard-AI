# AquaGuard AI — Backend Service

FastAPI-based educational decision-support screening and risk stratification API.

## Features
- **Inference & Explainability:** Integrates the trained, calibrated GBDT machine learning model and SHAP feature attribution engine from `ml/artifacts/`.
- **Regulatory Standards Engine:** Automated compliance evaluation against Bureau of Indian Standards (BIS IS 10500) and WHO Guidelines.
- **Batch Processing:** High-throughput validation and screening for multi-station sensor telemetry batches.
- **Session Scoping:** Anonymous session isolation via `X-Session-Id` header with SQLite persistence.
- **OpenAPI Documentation:** Interactive documentation automatically available at `http://localhost:8000/docs`.

## Directory Structure
- `app/`: FastAPI application code:
  - `main.py`: Application entry point and CORS configuration.
  - `schemas/`: Pydantic data models matching frontend TypeScript interfaces.
  - `services/`: ML predictor integration, standards evaluation, and analysis orchestration.
  - `routers/`: Endpoints for `/api/analyze`, `/api/analyses`, `/api/batch/*`, `/api/dashboard/*`, `/api/model-card`, and `/api/health`.
  - `database.py`: SQLite persistence layer.
- `tests/`: Automated unit and integration tests (`test_api.py`).
- `requirements.txt`: Python package requirements.

## How to Run

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Start the Development Server
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Run Automated Tests
```bash
python -m unittest backend/tests/test_api.py
```
