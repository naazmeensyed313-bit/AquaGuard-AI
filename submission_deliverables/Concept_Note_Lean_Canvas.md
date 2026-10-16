# AquaGuard AI — Concept Note & Lean Canvas

**Project Name:** AquaGuard AI: AI-Powered Water Quality Screening & Regulatory Decision Support System  
**UN Sustainable Development Goal:** SDG 6 — Clean Water & Sanitation  
**Core Methodology:** Dual-Layer Screening (Calibrated Machine Learning GBDT + BIS IS 10500 Standards Check + SHAP Explainability)

---

## 1. Executive Summary

Water quality monitoring in public distribution networks, rural borewells, and industrial watersheds faces a severe operational bottleneck: accredited statutory laboratory assays require 3 to 7 days for physical, chemical, and biological clearance. In regional surveillance programs encompassing hundreds of sampling points, testing every source indiscriminately is cost-prohibitive and introduces dangerous delays in alerting the public to emerging contamination surges.

**AquaGuard AI** bridges this gap as a rapid, automated, decision-support screening and triage instrument. By ingesting 9 standard physicochemical sensor readings (pH, turbidity, TDS, chloramines, sulfate, conductivity, organic carbon, trihalomethanes, hardness) or high-throughput batch CSV logs, the platform executes a dual-layer evaluation:
1. **Calibrated Machine Learning:** A Gradient Boosted Decision Tree (HistGradientBoosting) calibrated with 5-fold Sigmoid Platt scaling stratifies samples into empirical concern bands (*Lower Concern*, *Inconclusive*, *Elevated Concern*).
2. **Regulatory Standards Engine:** Parameters are benchmarked against official Bureau of Indian Standards (BIS IS 10500) and World Health Organization (WHO) Guidelines.
3. **Local Explainability (SHAP):** Transparent feature attributions show exactly which chemicals drove the risk score up or down, eliminating black-box uncertainty.

---

## 2. Lean Canvas Grid

| Section | Key Content |
|---|---|
| **1. Problem** | • **Laboratory Latency:** Statutory testing turnaround of 3–7 days delays emergency interventions.<br>• **Cost Inefficiency:** Universal lab testing across all regional taps is economically unsustainable.<br>• **Field Ambiguity:** Field officers record probe telemetry but lack rapid decision-support triage.<br>• **Black-Box AI Trust Issues:** Generic ML models provide binary labels without explainability or regulatory benchmark references. |
| **2. Customer Segments** | • **Municipal Water Boards & Utilities:** Urban water supply monitoring across treatment plants and pipe distribution grids.<br>• **Rural Water Supply Missions:** Field surveillance teams monitoring decentralized rural borewells and village community tanks (e.g. Jal Jeevan Mission).<br>• **Industrial Effluent Monitors:** Regulatory inspection teams auditing industrial discharge channels.<br>• **Environmental NGOs & Watershed Conservancies:** Non-profit and citizen-science teams conducting community catchment surveys. |
| **3. Unique Value Proposition** | • **5-Second Field Triage:** Instant stratification of water samples into calibrated empirical concern bands.<br>• **Explainability Over Black-Box:** SHAP waterfall/bar charts prove *why* a water sample was flagged, highlighting specific deviating parameters.<br>• **Dual-Layer Evaluation:** Evaluates complex geochemical feature interactions alongside formal legal BIS/WHO standards.<br>• **Responsible AI by Design:** Non-certifying; strictly refuses false drinkability claims and prioritizes laboratory verification. |
| **4. Solution** | • **Calibrated GBDT ML Model:** 84.0% accuracy, 0.924 ROC-AUC, 0.095 Brier calibration score.<br>• **Real-Time 9-Parameter Ingestion:** Robust validation, missing-value imputation, and completeness scoring.<br>• **High-Throughput Batch Engine:** Drag-and-drop CSV validation scoring up to 500 field samples simultaneously.<br>• **Action Guidance Engine:** Concrete next-step recommendations for laboratory re-testing and filtration inspection. |
| **5. Channels** | • **Government Water Boards (B2G):** State and national drinking water quality surveillance programs.<br>• **Municipal Distribution Integration:** Direct REST API connectivity for telemetry gateways and SCADA systems.<br>• **Environmental Field Kits:** Co-packaging software licenses with digital handheld water testing probes.<br>• **Open-Source Community:** Documentation, API specifications, and reproducible model cards. |
| **6. Revenue Streams & Impact** | • **SaaS Subscriptions for Utilities:** Tiered monthly/annual platform access for municipal dashboard and batch features.<br>• **Telemetry Gateway API Licensing:** Usage-based API tiers for hardware sensor manufacturers and IoT loggers.<br>• **Accredited Lab Referral Integration:** Digital sample dispatch and chain-of-custody tracking partnerships.<br>• **SDG 6 Social Impact:** Prevents waterborne health hazards by accelerating contamination containment. |
| **7. Cost Structure** | • **Cloud Compute & Hosting:** FastAPI backend, SQLite persistence, and CDN static asset hosting.<br>• **ML Training & Pipeline Calibration:** Continual validation against empirical regional geochemical surveys.<br>• **Regulatory Standard Compliance:** Ongoing synchronization with official BIS IS 10500 and WHO guideline updates.<br>• **Quality Assurance & Testing:** Automated unit testing, security auditing, and sensor telemetry variance validation. |
| **8. Key Metrics** | • **Screening Turnaround Time:** < 200 ms per sample evaluation.<br>• **Prioritization Efficiency:** 60% reduction in unnecessary statutory lab dispatches for clearly compliant baselines.<br>• **Model Calibration Quality:** Brier score < 0.10 and ROC-AUC > 0.90.<br>• **System Uptime & Reliability:** 99.9% availability with zero client-side crashes. |
| **9. Unfair Advantage** | • **Integrated Dual-Engine Framework:** Proprietary combination of calibrated probability estimation with formal regulatory standards compliance.<br>• **Zero-Config Full-Stack Architecture:** Single-terminal runner, offline-capable SQLite session persistence, and local mock fallback for disconnected field environments. |

---

## 3. Responsible AI & Safety Framework

AquaGuard AI enforces strict public health safety boundaries:
- **No Certifications:** The platform systematically refuses to issue "safe to drink" certifications.
- **Audited Vocabulary:** Result badges strictly use *Lower Concern*, *Inconclusive*, and *Elevated Concern*; standard compliance strictly uses *Within range*, *Above range*, and *Below range*.
- **Explicit Limitations:** Transparently disclaims that microbial pathogens (E. coli, viruses) and heavy metals (lead, arsenic) require certified laboratory spectrometry.

