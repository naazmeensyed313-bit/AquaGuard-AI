# AquaGuard AI — Frontend Application

React 19 + TypeScript + Vite + Tailwind CSS application providing an educational water quality screening and decision-support interface.

---

## Directory Structure

```text
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts         # Central typed API client and backend switch
│   │   └── mock/             # Isolated mock heuristics and seed datasets
│   │       ├── data.ts       # Initial seed sample records & benchmark model card
│   │       └── service.ts    # Deterministic placeholder scorer and local storage adapter
│   ├── components/
│   │   ├── charts/           # Visualization charts (Completeness, Gauge, RangeBar, SHAP)
│   │   ├── forms/            # Water sample input forms & parameter validators
│   │   ├── layout/           # Header, Footer, MobileNav, WarmupBanner
│   │   ├── result/           # Dual-layer screening result cards & limitation sections
│   │   └── ui/               # Design system primitives (Badge, Button, Card, Modal, Tooltip, Toast)
│   ├── config/
│   │   └── parameters.ts     # Definition of the 9 fixed physicochemical parameters & units
│   ├── lib/
│   │   ├── export.ts         # CSV export utility
│   │   ├── standards.ts      # BIS IS 10500 and WHO standards evaluator
│   │   └── validation.ts     # Input validation rules and boundary checking
│   ├── pages/                # Route pages (Landing, Analyze, Result, Dashboard, History, Compare, Batch, About)
│   ├── types/                # TypeScript interface definitions aligned with API contract
│   ├── App.tsx               # Client router and root shell
│   ├── index.css             # Tailwind v4 theme variables and base typography
│   └── main.tsx              # Application entry point
├── .env.example              # Environment variables template
├── eslint.config.js          # ESLint 9 flat configuration
├── .prettierrc               # Prettier code formatting rules
├── index.html                # HTML entry file
├── package.json              # NPM package definition
├── tsconfig.json             # TypeScript compiler options (strict mode)
└── vite.config.ts            # Vite configuration
```

---

## API Client & Mock Switch

Data fetching throughout the frontend is strictly abstracted behind `src/api/client.ts`. Components never import mock data directly.

### Switching Between Mock and Real Backend

In `frontend/.env`:

```env
# Set to 'true' to use the local mock service
VITE_USE_MOCK=true

# Set to 'false' to connect to the live FastAPI backend
# VITE_USE_MOCK=false

# Real backend base URL
VITE_API_BASE_URL=http://localhost:8000
```

When `VITE_USE_MOCK=false`:
1. Requests are dispatched to `${VITE_API_BASE_URL}/api/<endpoint>`.
2. All requests include an anonymous session identifier via the `X-Session-Id` header (generated once and stored in `localStorage`).
3. Requests use CORS-friendly settings (`mode: 'cors'`, `credentials: 'omit'`).
4. Requests have an automated timeout of 45 seconds (handling potential backend cold starts).
5. If requests take longer than 2.5 seconds, the `WarmupBanner` automatically alerts the user that the backend is waking up.
6. Errors are strongly typed (`NetworkError`, `ValidationError`, `ServerError`, `TimeoutError`).

---

## Connecting to the Real Backend

When the Python/FastAPI backend is ready:
1. Ensure the backend is running (e.g. `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`).
2. Update `frontend/.env`:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000
   ```
3. Restart the Vite dev server:
   ```bash
   npm run dev
   ```
4. Verify backend health via the frontend health probe (`apiClient.getHealth()`).

---

## Available NPM Scripts

- `npm run dev`: Start development server on port 3000 (`--host=0.0.0.0`)
- `npm run typecheck`: Run TypeScript compiler type-check (`tsc --noEmit`)
- `npm run lint`: Run ESLint checks (`eslint .`)
- `npm run build`: Type-check and build production assets (`dist/`)
- `npm run preview`: Preview production build locally on port 4173

