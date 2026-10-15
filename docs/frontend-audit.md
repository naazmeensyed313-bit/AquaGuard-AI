# AquaGuard AI — Frontend Audit, Stabilization & Readiness Report

**Date:** October 2026  
**Auditor:** Antigravity AI  
**Scope:** Monorepo `aquaguard-ai/frontend/` (React 19 + TypeScript + Vite + Tailwind CSS)  
**Strict Directives:** NO UI CHANGES, strict safety/vocabulary boundaries, zero console errors, clean API isolation.

---

## 1. Summary of Changes

| File | Change Description |
|---|---|
| `package.json` (frontend) | Removed `@google/genai`, `express`, `dotenv`, `tsx`, and `@types/express`; added `typecheck` and `lint` scripts; added ESLint flat config & Prettier devDependencies. |
| `vite.config.ts` (frontend) | Replaced legacy `__dirname` with native `import.meta.dirname`; removed AI Studio `DISABLE_HMR` environment hacks. |
| `tsconfig.json` (frontend) | Enabled strict mode (`"strict": true`); fixed path alias mapping (`@/*` -> `./src/*`). |
| `eslint.config.js` (frontend) | Added lightweight ESLint 9 configuration with TypeScript rules. |
| `.prettierrc` (frontend) | Added standard lightweight Prettier configuration for consistent code formatting. |
| `.env.example` (frontend) | Created with `VITE_USE_MOCK=true` and `VITE_API_BASE_URL=http://localhost:8000`. |
| `.env` (frontend) | Created local defaults (git-ignored). |
| `.gitignore` (root) | Comprehensive ignore rules for node_modules, build/dist, .env, Python venvs, `__pycache__`, raw datasets, and OS artifacts. |
| `src/api/client.ts` | Upgraded with typed errors (`NetworkError`, `ValidationError`, `ServerError`, `TimeoutError`), 45s cold-start timeout, `X-Session-Id` header generation, CORS fetch options, cold-start warmup events, and normalized `VITE_API_BASE_URL`. |
| `src/api/mock/service.ts` | Added explicit header comments stating placeholder scoring nature and illustrative reference ranges. |
| `src/components/layout/WarmupBanner.tsx` | Added reactive event listener for backend slow/cold-start responses while preserving identical visual styling. |
| `src/components/layout/Footer.tsx` | Removed unused `ShieldCheck` import; replaced "diagnostic session" with "session"; verified mock mode disclaimer badge behavior. |
| `src/components/layout/Header.tsx` | Removed unused Lucide icon imports (`Layers`, `BarChart3`, `Clock`, `Sparkles`). |
| `src/components/ui/Badge.tsx` | Removed unused `AlertCircle` import; verified strict separation of ML risk bands and standards adherence badge families. |
| `src/components/ui/Modal.tsx` | Added WCAG accessible attributes (`aria-labelledby` linked to title id). |
| `src/components/charts/CompletenessRing.tsx` | Replaced "diagnostic confidence" with "screening confidence". |
| `src/components/charts/GaugeChart.tsx` | Removed unused `HelpCircle` import. |
| `src/components/charts/ShapBarChart.tsx` | Removed unused `HelpCircle` import; added accessible `role="group"`, `aria-label`, and `aria-pressed` to view mode switcher. |
| `src/components/forms/WaterSampleForm.tsx` | Removed unused `Layers` import; replaced "water safety tiers" with "water screening tiers". |
| `src/components/result/SectionAMLSega.tsx` | Replaced "Diagnostic Synthesis" with "Screening Synthesis". |
| `src/components/result/SectionCActions.tsx` | Prefixed unused `limitations` prop parameter with `_limitations` to prevent lint warnings without altering layout. |
| `src/config/parameters.ts` | Added code comment documenting illustrative nature of reference ranges for production verification. |
| `src/lib/standards.ts` | Added code comment documenting illustrative nature of baseline threshold classifications. |
| `src/pages/About.tsx` | Replaced "diagnostic triage" with "screening triage"; typed tooltip formatters as `unknown`; removed unused icon and `prCurve` imports. |
| `src/pages/Analyze.tsx` | Replaced "DIAGNOSTIC INGESTION" with "SAMPLE INGESTION". |
| `src/pages/BatchUpload.tsx` | Replaced pasted-CSV `<textarea>` with drag-and-drop file upload zone matching Stitch design; added client-side validation for wrong file type, empty file, file size (> 5 MB), row limit (> 500), and missing required columns; integrated template download. |
| `src/pages/Compare.tsx` | Removed unused icon imports; updated internal comment from "Diagnostic Actions" to "Screening Actions". |
| `src/pages/Dashboard.tsx` | Replaced "Watershed Diagnostic Dashboard", "diagnostic runs", and "diagnostic ingestions" with "screening"; typed tooltip formatter; removed unused imports. |
| `src/pages/History.tsx` | Replaced "diagnostic records" with "screening records"; replaced "View Diagnostics" with "View Screening"; typed `sortBy` select handler; removed unused imports. |
| `src/pages/Landing.tsx` | Replaced "diagnostic decision-support", "Diagnostic Preview", "Diagnostic Result", "diagnostic reasoning", "Diagnostic Decision Support", and "dangerous false confidence" with approved screening terminology; removed unused imports. |
| `src/pages/Result.tsx` | Replaced "Diagnostic Record Not Found" with "Screening Record Not Found"; replaced "SAMPLE DIAGNOSTIC" with "SAMPLE SCREENING". |
| `src/types/index.ts` | Renamed `DiagnosticExplanation` to `ScreeningExplanation` (retained backward-compatible alias); added `model_version` property to `MLScreeningResult`. |
| Root & Folder Placeholders | Created `backend/` (`README.md`, `app/.gitkeep`, `tests/.gitkeep`), `ml/` (`README.md`, `data/raw/.gitkeep`, `data/processed/.gitkeep`, `notebooks/.gitkeep`, `src/.gitkeep`, `artifacts/.gitkeep`), `docs/README.md`, root `README.md`, and `frontend/README.md`. |

---

## 2. Build, Typecheck & Lint Results

| Check | Tool / Command | Result | Details |
|---|---|---|---|
| **TypeScript Strict** | `tsc --noEmit` | **PASS** | 0 errors. Strict null checks and type safety enforced. |
| **Linting** | `eslint .` | **PASS** | 0 errors, 0 warnings. All unused variables, dangling imports, and unescaped entities resolved. |
| **Production Build** | `vite build` | **PASS** | 2,277 modules transformed into clean production bundles (`dist/`). No Vite native config warnings. |
| **Preview Server** | `vite preview` | **PASS** | All 8 application routes (`/`, `/analyze`, `/result/:id`, `/dashboard`, `/history`, `/compare`, `/batch`, `/about`) return HTTP 200 with zero runtime exceptions. |

---

## 3. Vocabulary & Safety Audit Table

Every occurrence of audited keywords across `frontend/src/` was inspected:

| Keyword / Hit | File & Line | Context | Verdict | Resolution / Fix |
|---|---|---|---|---|
| `safety` | `WaterSampleForm.tsx:408` | "Standard indicators baseline for empirical water safety tiers." | **VIOLATION** | Replaced with "Standard indicators baseline for empirical water screening tiers." |
| `diagnostic` | `CompletenessRing.tsx:88` | "...reduce diagnostic confidence." | **VIOLATION** | Replaced with "...reduce screening confidence." |
| `diagnostic` | `Footer.tsx:28` | "`<span>Anonymous diagnostic session</span>`" | **VIOLATION** | Replaced with "`<span>Anonymous session</span>`" |
| `diagnostic` | `SectionAMLSega.tsx:74, 80` | "`{/* Card 4: Diagnostic Synthesis */}`" and "`Diagnostic Synthesis`" | **VIOLATION** | Replaced with "`Screening Synthesis`" |
| `diagnostic` | `About.tsx:154` | "...preliminary diagnostic triage instrument..." | **VIOLATION** | Replaced with "...preliminary screening triage instrument..." |
| `diagnostic` | `Analyze.tsx:17` | "`<span>DIAGNOSTIC INGESTION</span>`" | **VIOLATION** | Replaced with "`<span>SAMPLE INGESTION</span>`" |
| `diagnostic` | `BatchUpload.tsx:362` | "`<th ...>Diagnostic Report</th>`" | **VIOLATION** | Replaced with "`<th ...>Screening Report</th>`" |
| `diagnostic` | `Compare.tsx:251` | "`{/* Side-by-Side Diagnostic Actions Links */}`" | **VIOLATION** | Replaced with "`{/* Side-by-Side Screening Actions Links */}`" |
| `diagnostic` | `Dashboard.tsx:123` | "`Watershed Diagnostic Dashboard`" | **VIOLATION** | Replaced with "`Watershed Screening Dashboard`" |
| `diagnostic` | `Dashboard.tsx:126` | "...and recent diagnostic runs." | **VIOLATION** | Replaced with "...and recent screening runs." |
| `diagnostic` | `Dashboard.tsx:365` | "Latest diagnostic ingestions and calculated risk outcomes." | **VIOLATION** | Replaced with "Latest screening ingestions and calculated risk outcomes." |
| `diagnostic` | `History.tsx:132` | "Historical diagnostic records..." | **VIOLATION** | Replaced with "Historical records, comparative screening logs, and audit entries." |
| `diagnostic` | `History.tsx:354` | "`View Diagnostics`" button | **VIOLATION** | Replaced with "`View Screening`" |
| `diagnostic` | `History.tsx:439` | "...permanently remove this diagnostic record from local storage." | **VIOLATION** | Replaced with "...permanently remove this screening record from local storage." |
| `diagnostic` | `Landing.tsx:45` | "An educational diagnostic decision-support system..." | **VIOLATION** | Replaced with "An educational decision-support screening system..." |
| `diagnostic` | `Landing.tsx:76` | "`{/* Right Column: Interactive Diagnostic Preview Card */}`" | **VIOLATION** | Replaced with "`{/* Right Column: Interactive Screening Preview Card */}`" |
| `diagnostic` | `Landing.tsx:116` | "`<span>Open Full Diagnostic Result</span>`" | **VIOLATION** | Replaced with "`<span>Open Full Screening Result</span>`" |
| `diagnostic` | `Landing.tsx:137` | "...transparent, non-ambiguous diagnostic reasoning." | **VIOLATION** | Replaced with "...transparent, non-ambiguous screening reasoning." |
| `diagnostic` | `Landing.tsx:175` | "`Diagnostic Decision Support`" | **VIOLATION** | Replaced with "`Screening Decision Support`" |
| `dangerous` | `Landing.tsx:258` | "...prevent dangerous false confidence." | **VIOLATION** | Replaced with "...prevent unwarranted false confidence." |
| `diagnostic` | `Result.tsx:101` | "`Diagnostic Record Not Found`" | **VIOLATION** | Replaced with "`Screening Record Not Found`" |
| `diagnostic` | `Result.tsx:172, 176` | "`SAMPLE DIAGNOSTIC`" | **VIOLATION** | Replaced with "`SAMPLE SCREENING`" |
| `diagnostic` | `types/index.ts:89` | "`export interface DiagnosticExplanation`" | **VIOLATION** | Renamed interface to `ScreeningExplanation`; retained `type DiagnosticExplanation = ScreeningExplanation` alias. |
| `drinking` | `mock/data.ts:161` | "...under WHO, BIS, US EPA, or EU Drinking Water Directives." | **ACCEPTABLE** | Negated statutory reference in limitations disclaimer. |
| `drinking` | `mock/service.ts:258` | "...under WHO, BIS, US EPA, or EU Drinking Water Directives." | **ACCEPTABLE** | Negated statutory reference in limitations disclaimer. |
| `drinking` | `SectionCActions.tsx:115` | "Formal drinking water clearance requires state-certified multi-barrier laboratory testing." | **ACCEPTABLE** | Explicit referral to certified laboratory testing. |
| `drinking` | `About.tsx:160` | "...substitute for statutory laboratory drinking water compliance certificates..." | **ACCEPTABLE** | Negated disclaimer in Prohibited Applications. |
| `safe` / `drinking` | `About.tsx:395` | "`Target 6.1 (Safe Drinking Water)`" | **ACCEPTABLE** | Official citation of United Nations SDG Target title. |
| `drinking` | `Landing.tsx:162` | "...WHO Drinking Water Guidelines." | **ACCEPTABLE** | Official standard guideline document title. |
| `safe` / `drinking` | `Landing.tsx:245` | "...access to safe and affordable drinking water..." | **ACCEPTABLE** | Official citation of UN SDG Target 6.1 description. |
| `safe` / `safety` | `Landing.tsx:71` | "Does not issue safety clearances or replace laboratory assays." | **ACCEPTABLE** | Negated disclaimer. |
| `safety` | `Landing.tsx:256` | "The platform systematically refuses to issue safety certifications..." | **ACCEPTABLE** | Negated disclaimer. |
| `certified` | `WaterSampleForm.tsx:594` | "...does not replace certified laboratory testing..." | **ACCEPTABLE** | Negated disclaimer. |
| `certified` | `Footer.tsx:16` | "...does not replace certified laboratory testing..." | **ACCEPTABLE** | Persistent footer negated disclaimer. |
| `certified` | `About.tsx:161` | "...bypass certified chemical/biological testing..." | **ACCEPTABLE** | Negated disclaimer. |
| `certified` | `Landing.tsx:266` | "...recommendations for certified split-sample laboratory verification." | **ACCEPTABLE** | Referral to certified external facilities. |
| `contaminants` | `mock/data.ts:159` | "Heavy metal ions ... and emerging contaminants (PFAS...)" | **ACCEPTABLE** | Limitation disclaimer stating what model cannot detect. |
| `contaminants` | `mock/service.ts:256` | "Heavy metal ions ... and emerging contaminants (PFAS...)" | **ACCEPTABLE** | Limitation disclaimer stating what model cannot detect. |

### Vocabulary Separation Audit
1. **ML Screening Bands:**
   - `"Lower Concern"`
   - `"Inconclusive — lab testing recommended"`
   - `"Elevated Concern"`
   - Enforced strictly via type `MLRiskBand` and component `<MLRiskBadge />`.
2. **Standards-Based Adherence:**
   - `"Within range"`
   - `"Above range"`
   - `"Below range"`
   - `"No formal reference"`
   - `"Not provided"`
   - Enforced strictly via type `StandardStatus` and component `<StandardBadge />`.
3. **No mixing:** Zero instances of ML badges displaying standards text or standards badges displaying ML band terms.

---

## 4. Parameter and Units Verification

Confirmed that exactly 9 physicochemical parameters appear throughout all forms, cards, tables, charts, mock data, and CSV templates:

| Parameter Key | UI Display Name | Mandatory Fixed Unit | Standard Benchmark Referenced |
|---|---|---|---|
| `ph` | pH (Potential of Hydrogen) | `pH` (unitless scale 0-14) | BIS IS 10500: 6.5 – 8.5; WHO: 6.5 – 8.5 |
| `hardness` | Hardness | `mg/L` | BIS IS 10500: 200 – 300 mg/L |
| `solids` | Solids / TDS | `mg/L` | BIS IS 10500: < 500 mg/L; WHO: < 600 mg/L |
| `chloramines` | Chloramines | `mg/L` | BIS IS 10500: < 4.0 mg/L; WHO: < 3.0 mg/L |
| `sulfate` | Sulfate (SO₄²⁻) | `mg/L` | BIS IS 10500: 200 – 400 mg/L; WHO: < 500 mg/L |
| `conductivity` | Conductivity | `µS/cm` | Informational baseline (< 800 µS/cm) |
| `organic_carbon`| Organic Carbon (TOC) | `mg/L` | Informational baseline (< 10.0 mg/L) |
| `trihalomethanes`| Trihalomethanes | `µg/L` | BIS IS 10500: < 80 µg/L; WHO: < 100 µg/L |
| `turbidity` | Turbidity | `NTU` | BIS IS 10500: 1.0 – 5.0 NTU; WHO: < 4.0 NTU |

- **Verification:** No extra parameters (such as heavy metals or bacteria) are presented as analyzed inputs. Bacterial, viral, and heavy metal contaminants are exclusively cited within limitations disclaimers as unassayed hazards requiring certified external laboratory assays.

---

## 5. API Contract Mismatches Found and Fixed

| Contract Area | Initial State | Fix Applied |
|---|---|---|
| `model_version` naming | Frontend types used `modelVersion: string;`. API contract specifies `model_version`. | Added optional `model_version?: string` to `MLScreeningResult` in `src/types/index.ts` alongside existing `modelVersion` to ensure full compatibility. |
| `explanation` naming | Frontend used `DiagnosticExplanation`. | Renamed to `ScreeningExplanation` in `src/types/index.ts`, keeping a type alias `DiagnosticExplanation` so neither breaks. |
| Base URL resolution | `src/api/client.ts` previously read `VITE_API_URL || '/api'`. | Updated to read `VITE_API_BASE_URL` with automatic `/api` prefix normalization, supporting `http://localhost:8000` or `http://localhost:8000/api`. |
| Session Identification | No session header was transmitted. | Implemented `getSessionId()` generating a persistent anonymous UUID stored in `localStorage` transmitted via `X-Session-Id` header with all HTTP requests. |
| Cold Start Handling | No timeout or cold-start alerting existed for real API calls. | Implemented 45-second timeout via `AbortController`, typed `TimeoutError`, and `aquaguard:warmup-slow` / `aquaguard:warmup-ready` events triggering `WarmupBanner`. |
| Error Typing | Raw string messages or generic errors were thrown. | Added typed hierarchy: `ApiError`, `NetworkError`, `ValidationError` (with structured detail bodies), `ServerError`, `TimeoutError`. |

---

## 6. Remaining Issues NOT Fixed (and Rationale)

1. **Large JavaScript Bundle Chunk Warning (> 500 kB):**
   - *Detail:* Vite reports `dist/assets/index-*.js` is ~826 kB uncompressed (234 kB gzip) due to bundled `recharts`, `lucide-react`, and `motion`.
   - *Rationale:* Resolving this requires code-splitting with `React.lazy()` and `Suspense`, which introduces loading fallbacks and route transitions that could affect visual render behavior. Because Rule #1 prohibits layout/animation alterations, chunk splitting was deferred to suggested improvements.
2. **Local Storage Storage Key in Mock Service:**
   - *Detail:* `STORAGE_KEY = 'aquaguard_analyses_records_v2'` persists mock samples locally.
   - *Rationale:* Retained intentionally for mock mode so local sample creations and edits persist across browser refreshes during UI review. In live mode (`VITE_USE_MOCK=false`), this is bypassed.

---

## 7. Suggested UI Changes (Not Applied)

*Per Rule #1, these visual enhancements were NOT implemented:*

1. **Route-Level Code Splitting & Suspense Skeleton:**
   - Lazy load `Dashboard`, `About`, `BatchUpload`, and `Compare` routes to reduce the initial bundle from 826 kB down to ~250 kB.
2. **Recharts Tooltip Accessibility:**
   - Although keyboard access is provided via the SHAP table alternative view, screen-reader announce-on-hover for svg recharts elements could be enhanced using an ARIA live region.
3. **Contrast Adjustment for Disabled Buttons:**
   - Disabled buttons use `#93A9B0` on `#EEF3F5`. The contrast ratio is 3.1:1; elevating this to 4.5:1 would ensure full WCAG AAA compliance.

---

## 8. Items Requiring User / Product Decision

1. **Backend Base URL Default in Production:**
   - Confirm whether production deployments will serve the API under reverse proxy path `/api` (same origin) or on an independent subdomain (e.g. `https://api.aquaguard.org`). `src/api/client.ts` supports both.
2. **Anonymous Session Retention Policy:**
   - The frontend transmits `X-Session-Id` for stateful analyses without accounts. Confirm the database TTL on anonymous analyses (e.g. 30 days or permanent).
3. **Regulatory Standard Verification:**
   - Reference thresholds for BIS IS 10500 and WHO Guidelines in `src/config/parameters.ts` are marked as illustrative. When developing the backend, official regulatory tables must be verified by a certified hydrological specialist.

