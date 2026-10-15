# AquaGuard AI: AI-Powered Water Quality Screening & Decision Support System

> **Educational Decision-Support Screening Tool**  
> AquaGuard AI is an educational decision-support screening tool aligned with UN Sustainable Development Goal 6 (Clean Water and Sanitation). It does **NOT** certify water as suitable or unsuitable for drinking and makes no medical, potable, or public-health claims. It is designed to assist environmental surveillance and prioritize samples for statutory, accredited laboratory testing.

---

## Project Status

**Complete Full-Stack Application: Frontend, ML Pipeline, and FastAPI Backend.**

The React + TypeScript + Vite + Tailwind CSS frontend interface is fully stabilized and can run either in local mock mode (`VITE_USE_MOCK=true`) or connected to the live Python/FastAPI backend (`VITE_USE_MOCK=false`). The backend integrates a trained, calibrated Gradient Boosting Classifier and SHAP explainability engine along with an automated regulatory standards engine (BIS IS 10500 and WHO Guidelines).

---

## Tech Stack

- **Frontend:** React 19, TypeScript (strict mode), Vite 8, Tailwind CSS v4, Lucide Icons, Recharts, Motion
- **Backend:** Python 3.11+, FastAPI 0.133+, Pydantic v2, Uvicorn, SQLite
- **Machine Learning:** Scikit-Learn 1.8+, HistGradientBoosting, CalibratedClassifierCV (Platt Scaling), Tree Feature Attributions
- **Standards:** Bureau of Indian Standards (BIS IS 10500), World Health Organization (WHO) Guidelines

---

## Monorepo Folder Structure

```text
AquaGuard-AI/
├── frontend/                 # React + TypeScript + Vite application
│   ├── src/
│   │   ├── api/              # API client abstraction & isolated mock service
│   │   │   ├── client.ts     # Central client (VITE_USE_MOCK toggle, timeout, X-Session-Id)
│   │   │   └── mock/         # Isolated placeholder scorer & seed datasets
│   │   ├── components/       # UI components (charts, forms, layout, result, ui)
│   │   ├── config/           # Fixed 9 physicochemical parameters configuration
│   │   ├── lib/              # Standards evaluation, data validation, CSV export
│   │   ├── pages/            # 8 core route views (Landing, Analyze, Result, Dashboard, etc.)
│   │   └── types/            # TypeScript interfaces aligned with API contract
│   ├── .env.example          # Environment variables template
│   ├── eslint.config.js      # Lightweight ESLint flat configuration
│   ├── index.html            # Vite entry HTML
│   ├── package.json          # Frontend scripts and dependencies
│   ├── tsconfig.json         # Strict TypeScript compiler configuration
│   └── vite.config.ts        # Vite configuration with Tailwind v4 and path aliases
├── backend/                  # FastAPI service (Planned)
│   ├── app/                  # Application code, routers, models, schemas
│   ├── tests/                # Automated API and unit tests
│   └── README.md             # Backend service documentation
├── ml/                       # Machine Learning pipeline (Planned)
│   ├── data/
│   │   ├── raw/              # Raw data archive (git-ignored)
│   │   └── processed/        # Cleaned and normalized datasets
│   ├── notebooks/            # Exploratory analysis and baseline experiments
│   ├── src/                  # Production training, calibration, and SHAP pipelines
│   ├── artifacts/            # Serialized model weights, calibrators, explainer objects
│   └── README.md             # ML documentation
├── docs/                     # Architecture, audit reports, and governance documentation
│   ├── frontend-audit.md     # Comprehensive frontend code, safety, and API audit report
│   └── README.md             # Documentation overview
├── .gitignore                # Root git ignore specification
└── README.md                 # Project root documentation
```

---

## Getting Started: Frontend

### Prerequisites

- Node.js (v20.x or v22.x or v24.x recommended)
- npm (v10+ or v11+)

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Default contents:
```env
# Mock data switch: 'true' for local mock engine, 'false' for remote backend
VITE_USE_MOCK=true

# Real backend base URL (used when VITE_USE_MOCK=false)
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Both Frontend & Backend (Single Terminal)

To run both the **Python FastAPI Backend** and **React Frontend** together in the **same terminal**:

```bash
# In the root AquaGuard-AI folder:
python run.py
# or
npm start
```

This will concurrently stream:
- `[BACKEND]` on `http://localhost:8000` (FastAPI + ML Model)
- `[FRONTEND]` on `http://localhost:3000` (React Vite App)

Press `Ctrl+C` once at any time to cleanly stop both services.

```bash
# Typecheck with strict TypeScript
npm run typecheck

# Lint with ESLint
npm run lint

# Production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Roadmap

- [x] **Phase 1: Frontend UI & Stabilization**
  - [x] Full UI exported and stabilized across 8 core routes
  - [x] Removal of LLM SDK leftovers and hardcoded credentials
  - [x] Strict safety and vocabulary audit (non-certifying decision support)
  - [x] Typed API client layer with isolated mock engine and `VITE_USE_MOCK` toggle
  - [x] Accessibility (a11y) and responsive layout verification
  - [x] TypeScript strict compilation (0 errors) and zero ESLint warnings
  - [x] Drag-and-drop CSV file ingestion zone with client-side validation
- [x] **Phase 2: Machine Learning Pipeline**
  - [x] Ingest benchmark dataset (9 physicochemical parameters)
  - [x] Train candidate classifiers (Logistic Regression, Random Forest, HistGradientBoosting)
  - [x] Implement probability calibration (5-fold Sigmoid Platt Scaling)
  - [x] Generate SHAP-compatible feature contributions for local sample explainability
  - [x] Serialize model artifacts (`model_pipeline.joblib`) and validation manifest (`metrics.json`)
- [x] **Phase 3: Backend API Service**
  - [x] Build FastAPI application matching typed API contracts (`POST /api/analyze`, `POST /api/batch/*`, etc.)
  - [x] Integrate serialized ML pipeline and regulatory standards engine (BIS IS 10500 & WHO)
  - [x] Anonymous session management with `X-Session-Id` header and SQLite persistence
  - [x] CORS configuration and comprehensive automated test suite (10/10 tests passing)
- [x] **Phase 4: End-to-End Integration**
  - [x] Connect frontend to live FastAPI backend (`VITE_USE_MOCK=false`)
  - [x] Automated unit and integration test suite verification
  - [x] OpenAPI interactive documentation (`/docs`) and service health monitoring (`/api/health`)
