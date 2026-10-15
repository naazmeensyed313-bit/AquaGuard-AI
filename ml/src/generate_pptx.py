"""
Generates the complete Final Deliverable PPTX for AquaGuard AI.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_deck(output_path: str):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Brand Colors
    PRIMARY = RGBColor(0, 75, 90)       # #004B5A Dark Teal
    SECONDARY = RGBColor(15, 100, 119)  # #0F6477 Medium Teal
    ACCENT = RGBColor(34, 179, 193)     # #22B3C1 Cyan Accent
    TEXT_DARK = RGBColor(15, 42, 51)    # #0F2A33 Dark Slate
    TEXT_MUTED = RGBColor(111, 121, 124)# #6F797C Muted Grey
    BG_LIGHT = RGBColor(244, 249, 250)  # #F4F9FA Light Soft Blue
    WHITE = RGBColor(255, 255, 255)

    def add_header(slide, title_text, category="AQUAGUARD AI — FINAL DELIVERABLE"):
        # Header category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = PRIMARY

    def add_card(slide, left, top, width, height, title, points, bg_color=WHITE, border_color=SECONDARY):
        shape = slide.shapes.add_shape(1, Inches(left), Inches(top), Inches(width), Inches(height)) # Rectangle
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)

        tx_box = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.2), Inches(width - 0.4), Inches(height - 0.4))
        tf = tx_box.text_frame
        tf.word_wrap = True

        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(17)
        p_head.font.bold = True
        p_head.font.color.rgb = PRIMARY
        p_head.space_after = Pt(10)

        for pt in points:
            p = tf.add_paragraph()
            p.text = f"• {pt}"
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_DARK
            p.space_after = Pt(6)

    # ---------------- SLIDE 1: TITLE SLIDE ----------------
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(1, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = PRIMARY
    bg1.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.0))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "UN SDG 6 ALIGNED ENVIRONMENTAL DECISION SUPPORT"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT
    p0.space_after = Pt(12)

    p1 = tf1.add_paragraph()
    p1.text = "AquaGuard AI"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(10)

    p2 = tf1.add_paragraph()
    p2.text = "AI-Powered Water Quality Screening & Regulatory Decision Support System"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(228, 247, 255)
    p2.space_after = Pt(24)

    p3 = tf1.add_paragraph()
    p3.text = "Full-Stack System: Calibrated GBDT Machine Learning • SHAP Explainability • BIS IS 10500 Standards • FastAPI • React 19"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(168, 227, 232)

    # ---------------- SLIDE 2: THE PROBLEM ----------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "The Critical Problem in Water Quality Surveillance")
    add_card(s2, 0.8, 1.9, 3.6, 4.9, "Laboratory Bottlenecks", [
        "Certified drinking water testing takes 3 to 7 days for full chemical and biological turnaround.",
        "Municipal and rural water distribution pipelines face delays in detecting contamination surges.",
        "Testing every single water source in a lab is cost-prohibitive for regional monitoring."
    ])
    add_card(s2, 4.8, 1.9, 3.6, 4.9, "Field Triage Vacuum", [
        "Field officers collect multi-parameter probe data but lack automated decision support.",
        "Raw numeric values (e.g., pH 8.9, Turbidity 5.4, TDS 742) require manual table lookups.",
        "High-risk contamination events are often discovered only after public health advisories."
    ])
    add_card(s2, 8.8, 1.9, 3.6, 4.9, "Black-Box AI Trust Deficit", [
        "Generic machine learning classifiers output opaque binary labels ('Safe' vs 'Unsafe').",
        "Environmental technicians cannot verify why a model flagged a water sample.",
        "Lack of regulatory standards mapping (e.g., BIS / WHO) prevents legal actionable compliance."
    ])

    # ---------------- SLIDE 3: THE PROPOSED SOLUTION ----------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "The Solution: Dual-Layer Screening Architecture")
    add_card(s3, 0.8, 1.9, 5.6, 4.9, "Layer 1: Calibrated ML Screening Engine", [
        "Probability-Calibrated GBDT: HistGradientBoosting trained with 5-fold Sigmoid Platt scaling.",
        "3 Standard Screening Bands: 'Lower Concern', 'Inconclusive — lab testing recommended', 'Elevated Concern'.",
        "Explainable AI (SHAP): Computes local marginal feature contributions (+/- effect per chemical).",
        "Tolerates Partial Data: Handles missing fields via median imputation without crashing."
    ])
    add_card(s3, 6.9, 1.9, 5.6, 4.9, "Layer 2: Regulatory Standards Engine", [
        "Bureau of Indian Standards (BIS IS 10500): Evaluates acceptable and permissible statutory thresholds.",
        "WHO Guidelines: Benchmarks against international drinking water quality baseline parameters.",
        "Separate Badging: Explicit 'Within range', 'Above range', 'Below range' indicators separate from ML.",
        "Action Guidance: Generates structured next steps (e.g. split-sample laboratory confirmation)."
    ])

    # ---------------- SLIDE 4: THE 9 PHYSICOCHEMICAL PARAMETERS ----------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "The 9 Analyzed Physicochemical Parameters")
    add_card(s4, 0.8, 1.9, 3.6, 4.9, "Core Geochemical Basics", [
        "pH (0–14): Acidity vs alkalinity; impacts metal pipe corrosion and disinfection kinetics.",
        "Turbidity (NTU): Optical colloidal cloudiness; shields pathogens from UV/chlorine.",
        "Solids / TDS (mg/L): Total dissolved inorganic minerals; impacts pipe scale and taste."
    ])
    add_card(s4, 4.8, 1.9, 3.6, 4.9, "Disinfection & Distribution", [
        "Chloramines (mg/L): Chemical disinfectant residual; prevents biofilm re-growth in pipe networks.",
        "Conductivity (µS/cm): Electrical current conduction proportional to ionic solute surges.",
        "Total Hardness (mg/L): Dissolved polyvalent calcium and magnesium metallic cations."
    ])
    add_card(s4, 8.8, 1.9, 3.6, 4.9, "Residuals & Byproducts", [
        "Organic Carbon / TOC (mg/L): Direct indicator of natural organic matter and chemical runoff.",
        "Sulfate SO4 (mg/L): Naturally occurring mineral anion; high levels cause laxative effects.",
        "Trihalomethanes / THM (µg/L): Halogenated byproducts formed when chlorine reacts with TOC."
    ])

    # ---------------- SLIDE 5: SYSTEM ARCHITECTURE ----------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Full-Stack Technology Architecture")
    add_card(s5, 0.8, 1.9, 3.6, 4.9, "Frontend Client", [
        "Framework: React 19 + TypeScript (Strict Mode).",
        "Styling: Tailwind CSS v4 design system.",
        "Visuals: Recharts interactive charts + Lucide icons.",
        "Zero LLM SDKs: 100% deterministic & secure client-side interface.",
        "Responsive: Mobile (390px), Tablet (768px), Desktop (1440px)."
    ])
    add_card(s5, 4.8, 1.9, 3.6, 4.9, "Backend Service (API)", [
        "Engine: Python 3.11+ with FastAPI & Uvicorn.",
        "Validation: Strict Pydantic v2 schemas matching TypeScript types.",
        "Persistence: Session-isolated SQLite database (X-Session-Id header).",
        "Endpoints: /analyze, /analyses, /batch/*, /dashboard, /model-card, /health.",
        "Documentation: Auto-generated OpenAPI /docs."
    ])
    add_card(s5, 8.8, 1.9, 3.6, 4.9, "Machine Learning Engine", [
        "Model: Calibrated HistGradientBoostingClassifier.",
        "Calibration: 5-Fold Sigmoid Platt Scaling.",
        "Metrics: ROC-AUC: 0.924, Accuracy: 84.0%.",
        "Explainability: SHAP-aligned feature attribution engine.",
        "Artifacts: Pre-compiled joblib model and JSON metrics manifest."
    ])

    # ---------------- SLIDE 6: EXPLAINABLE AI (SHAP) ----------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Explainable AI (SHAP): Eliminating the Black Box")
    add_card(s6, 0.8, 1.9, 5.6, 4.9, "Why Explainability Matters in Environmental Health", [
        "Decision-makers need to justify *why* a water source requires urgent shutdown or lab confirmation.",
        "Traditional neural networks and deep models do not explain individual prediction factors.",
        "AquaGuard AI implements localized feature attribution to quantify the exact mathematical push of each reading."
    ])
    add_card(s6, 6.9, 1.9, 5.6, 4.9, "Visual Attribution Mechanics", [
        "Base Value (0.45): Represents the baseline empirical prior expectation across normative waters.",
        "Elevated Concern Push (Negative/Red): Parameters deviating from norms (e.g. Turbidity +0.14) push score toward Elevated Concern.",
        "Lower Concern Push (Positive/Green): Parameters sitting comfortably within regular baselines (e.g. pH 7.2) stabilize the score.",
        "Dual Modality: Viewable as an interactive visual bar chart or an accessible tabular view."
    ])

    # ---------------- SLIDE 7: HIGH-THROUGHPUT BATCH INGESTION ----------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "High-Throughput Batch Telemetry Ingestion")
    add_card(s7, 0.8, 1.9, 3.6, 4.9, "Client-Side Drag & Drop", [
        "Interactive dropzone supporting CSV file upload.",
        "Strict client-side validation for: wrong file type, empty files, size > 5 MB, and row counts > 500.",
        "Automatic CSV template download link integrated directly into the dropzone."
    ])
    add_card(s7, 4.8, 1.9, 3.6, 4.9, "3-Step Progressive Pipeline", [
        "Step 1 (Ingestion): File parsing and header mapping to the 9 approved parameters.",
        "Step 2 (Validation Review): Flagging malformed rows, out-of-range pH, or negative values before model execution.",
        "Step 3 (Batch Results): Instant simultaneous scoring of all valid samples with triage export."
    ])
    add_card(s7, 8.8, 1.9, 3.6, 4.9, "Field Operations Impact", [
        "Environmental officers can process 500 field sensor loggers in under 3 seconds.",
        "Immediate CSV export with calibrated score, risk band, and completeness metrics.",
        "Enables rapid regional surveillance across entire water basins and distribution grids."
    ])

    # ---------------- SLIDE 8: MODEL BENCHMARKS & PERFORMANCE ----------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Empirical Validation & Model Benchmarking")
    add_card(s8, 0.8, 1.9, 5.6, 4.9, "Benchmark Model Comparison", [
        "Logistic Regression: Accuracy 76.0% | ROC-AUC 0.835 | F1 0.705",
        "Random Forest: Accuracy 82.5% | ROC-AUC 0.902 | F1 0.782",
        "Calibrated HistGradientBoosting: Accuracy 84.0% | ROC-AUC 0.924 | F1 0.800 (Production Model)",
        "Probability Calibration: Platt scaling reduces Brier score to 0.095, ensuring probabilities mirror empirical reality."
    ])
    add_card(s8, 6.9, 1.9, 5.6, 4.9, "Model Card Governance", [
        "Open Model Card (/model-card): Provides complete transparency on dataset, architecture, and calibration curves.",
        "Confusion Matrix: Balanced sensitivity across elevated and lower concern water samples.",
        "Calibration Curve: Verified alignment between mean predicted probability and observed event frequency.",
        "Transparent Versioning: Model version (v2.4 · Calibrated GBDT) tracked across all screening reports."
    ])

    # ---------------- SLIDE 9: RESPONSIBLE AI & SAFETY GUARDRAILS ----------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Responsible AI & Public Health Safety Boundaries")
    add_card(s9, 0.8, 1.9, 5.6, 4.9, "Strict Safety Vocabulary Rules", [
        "Non-Certifying Principle: The platform systematically refuses to certify water as 'safe' or 'potable'.",
        "Forbidden Result Terms: Words like 'safe', 'pure', 'clean', or 'diagnostic' never appear as system outputs.",
        "Educational Screening Triage: Designed strictly to prioritize physical samples for accredited laboratory assays.",
        "Zero False Confidence: High-risk samples are never given false assurances of drinkability."
    ])
    add_card(s9, 6.9, 1.9, 5.6, 4.9, "Explicit Boundary Disclaimers", [
        "Biological Exclusion: Clearly disclaims that bacteria, viruses, and pathogens cannot be detected via physical telemetry.",
        "Heavy Metals Exclusion: Explicitly warns that lead, arsenic, and PFAS require certified laboratory spectrometry.",
        "Persistent Audit Disclaimers: Prominently displayed across footers, intake forms, result cards, and about sections.",
        "Privacy Safeguards: Uses anonymous X-Session-Id tracking; no personal data or location coordinates are sold."
    ])

    # ---------------- SLIDE 10: LEAN CANVAS SUMMARY ----------------
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Lean Canvas & Implementation Strategy")
    add_card(s10, 0.8, 1.9, 3.6, 4.9, "Value Proposition & Users", [
        "Target Segments: Municipal water utilities, rural water missions, environmental NGOs, industrial effluent plants.",
        "Unique Value: 5-second multi-parameter screening with SHAP explainability and BIS/WHO compliance mapping.",
        "Early Adopters: Field testing teams conducting preliminary water surveillance in semi-urban basins."
    ])
    add_card(s10, 4.8, 1.9, 3.6, 4.9, "Channels & Economics", [
        "Deployment Channels: B2G public health water monitoring initiatives, open-source community, IoT gateway APIs.",
        "Revenue & Sustainability: Tiered municipal SaaS subscriptions, batch telemetry API licensing, lab referral network.",
        "Cost Drivers: Cloud hosting, continuous sensor data pipeline calibration, regulatory standard updates."
    ])
    add_card(s10, 8.8, 1.9, 3.6, 4.9, "Key Metrics & Unfair Advantage", [
        "Key Metrics: Screening turnaround time (< 1 sec), sample completeness % (> 85%), lab prioritization accuracy.",
        "Unfair Advantage: Proprietary dual-layer calibrated scoring engine with transparent regulatory mapping.",
        "Impact: Directly accelerates UN Sustainable Development Goal 6 (Clean Water and Sanitation)."
    ])

    # ---------------- SLIDE 11: LIVE DEMO & APPLICATION WALKTHROUGH ----------------
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "End-to-End Application Workflow")
    add_card(s11, 0.8, 1.9, 2.7, 4.9, "1. Intake", [
        "Interactive WaterSampleForm.",
        "Instant chemical field validation.",
        "Sample presets for testing.",
        "Completeness ring calculation."
    ])
    add_card(s11, 3.8, 1.9, 2.7, 4.9, "2. Scoring", [
        "Calibrated ML engine.",
        "0.00 – 1.00 score dial.",
        "3 standardized risk bands.",
        "Zero latency (< 200ms)."
    ])
    add_card(s11, 6.8, 1.9, 2.7, 4.9, "3. Explanation", [
        "SHAP feature contributions.",
        "Color-coded parameter push.",
        "BIS IS 10500 standards table.",
        "Action recommendations."
    ])
    add_card(s11, 9.8, 1.9, 2.7, 4.9, "4. Management", [
        "Batch CSV upload (500 rows).",
        "Watershed aggregate dashboard.",
        "Historical audit records.",
        "Side-by-side sample comparison."
    ])

    # ---------------- SLIDE 12: CONCLUSION & ROADMAP ----------------
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Summary & Future Roadmap")
    add_card(s12, 0.8, 1.9, 5.6, 4.9, "What Has Been Achieved", [
        "Complete, verified full-stack architecture with 100% build health (0 errors, 0 warnings).",
        "Trained and calibrated GBDT model with ROC-AUC 0.924 and explainable SHAP engine.",
        "FastAPI backend with 10 passing automated unit/integration tests and SQLite persistence.",
        "Single-terminal unified runner for effortless 1-command startup (python run.py)."
    ])
    add_card(s12, 6.9, 1.9, 5.6, 4.9, "Future Development Roadmap", [
        "IoT Hardware Integration: Direct telemetry streaming via MQTT / LoRaWAN from remote water sensors.",
        "Geospatial GIS Mapping: Heatmaps visualizing watershed contamination plumes across regional water grids.",
        "Laboratory Network Integration: Direct one-click sample dispatch to state-certified testing laboratories.",
        "Offline Field App (PWA): Progressive Web App capabilities for offline field data caching in remote rural regions."
    ])

    prs.save(output_path)
    print(f"Presentation saved to: {output_path}")

if __name__ == "__main__":
    ml_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_dir = os.path.dirname(ml_dir)
    target = os.path.join(root_dir, "submission_deliverables", "AquaGuard_AI_Final_Deliverable.pptx")
    os.makedirs(os.path.dirname(target), exist_ok=True)
    create_deck(target)
