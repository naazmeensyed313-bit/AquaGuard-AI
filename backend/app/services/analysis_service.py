"""
AquaGuard AI — Analysis Orchestration Service
Computes input completeness, calls the calibrated ML model and SHAP engine,
evaluates standards, synthesizes decision-support explanations, and packages recommendations.
"""

from datetime import datetime, timezone
import uuid
from typing import Dict, Any, Optional, List

from ..schemas.water import (
    WaterParameters,
    WaterSampleAnalysis,
    InputCompleteness,
    MLScreeningResult,
    MLThresholds,
    ShapResult,
    ShapContribution,
    ScreeningExplanation,
    DecisionAction,
    RegulatoryStandard,
)
from .standards_service import evaluate_standards, PARAMETERS_STANDARDS_CONFIG
from ml.src.predict import predictor

def compute_completeness(inputs: WaterParameters) -> InputCompleteness:
    inputs_dict = inputs.model_dump()
    provided = 0
    missing = []

    for cfg in PARAMETERS_STANDARDS_CONFIG:
        val = inputs_dict.get(cfg["key"])
        if val is not None and not (isinstance(val, float) and val != val):
            provided += 1
        else:
            missing.append(cfg["fullName"])

    percent = int(round((provided / 9) * 100))

    if provided >= 8:
        tier = "High Confidence"
    elif provided >= 5:
        tier = "Moderate Confidence"
    else:
        tier = "Low Confidence"

    return InputCompleteness(
        provided=provided,
        total=9,
        percent=percent,
        missing=missing,
        confidenceTier=tier,
    )

def analyze_water_sample(
    inputs: WaterParameters,
    label: Optional[str] = None,
    location: Optional[str] = None,
    collected_at: Optional[str] = None,
    standard: RegulatoryStandard = "BIS IS 10500",
    sample_id: Optional[str] = None,
) -> WaterSampleAnalysis:
    now_iso = datetime.now(timezone.utc).isoformat()
    analysis_id = sample_id or f"sample-{uuid.uuid4().hex[:8]}"
    clean_label = label.strip() if label and label.strip() else "Unlabeled Sample"
    clean_loc = location.strip() if location and location.strip() else "Field Sensor Ingestion"
    created_at_str = collected_at or now_iso

    # 1. Completeness
    completeness = compute_completeness(inputs)

    # 2. Machine Learning Inference & SHAP
    inputs_dict = inputs.model_dump()
    ml_res = predictor.predict_sample(inputs_dict)

    ml_result = MLScreeningResult(
        score=ml_res["score"],
        band=ml_res["band"],
        classifierBias=ml_res.get("classifierBias"),
        thresholds=MLThresholds(low=0.40, high=0.60),
        modelVersion=ml_res.get("modelVersion", "v2.4 · Calibrated GBDT"),
        model_version=ml_res.get("modelVersion", "v2.4 · Calibrated GBDT"),
        calloutText=ml_res.get("calloutText"),
    )

    shap_data = ml_res["shap"]
    shap_contributions = [
        ShapContribution(
            parameter=c["parameter"],
            paramKey=c["paramKey"],
            value=c["value"],
            unit=c["unit"],
            contribution=c["contribution"],
            direction=c["direction"],
        )
        for c in shap_data["contributions"]
    ]

    shap_result = ShapResult(
        base_value=shap_data["base_value"],
        contributions=shap_contributions,
        final_score=shap_data["final_score"],
    )

    # 3. Regulatory Standards Evaluation
    standards_result = evaluate_standards(inputs, standard=standard)

    # 4. Educational Synthesis Text
    band = ml_result.band
    if band == "Inconclusive — lab testing recommended":
        explanation_text = (
            f"The model's screening for this sample is inconclusive. Certain parameters moved the score toward "
            f"Elevated Concern, while others moved it toward Lower Concern. "
            f"{f'{len(completeness.missing)} inputs were missing, reducing confidence.' if completeness.missing else 'Conflicting parameter vectors create a neutral balance.'} "
            f"This result should prompt a confirmatory laboratory test, not an operational conclusion."
        )
    elif band == "Lower Concern":
        explanation_text = (
            "The model's screening places this sample in the Lower Concern band. Key physicochemical readings "
            "fall within regular empirical brackets. Routine monitoring protocols should remain active."
        )
    else:
        explanation_text = (
            "The model's screening places this sample in the Elevated Concern band. Several parameters significantly "
            "exceed normative baseline boundaries. Immediate investigation and laboratory corroboration are advised."
        )

    # 5. Recommendations
    recommendations = [
        DecisionAction(
            id="rec-1",
            title="Confirm with an accredited laboratory",
            description="Dispatch split samples to certified testing facilities to resolve parameter ambiguities.",
            iconName="flask",
        ),
        DecisionAction(
            id="rec-2",
            title="Re-test and document sampling protocol",
            description="Verify collection procedures, calibration logs of handheld probes, and field chain-of-custody.",
            iconName="calendar",
        ),
        DecisionAction(
            id="rec-3",
            title="Inspect filtration & treatment barriers",
            description="Examine chlorination dosage units, sediment pre-filters, and storage tank seals.",
            iconName="checklist",
        ),
        DecisionAction(
            id="rec-4",
            title="Notify watershed monitoring coordinators",
            description="Log this screening observation in regional environmental surveillance registries.",
            iconName="building",
        ),
    ]

    limitations = [
        "Heavy metal ions (lead, arsenic, cadmium, mercury) and emerging contaminants (PFAS, microplastics) are unassayed by this 9-parameter screening model.",
        "Microbiological pathogens (E. coli, coliforms, enterococci, viruses) are not detected by physical sensor telemetry.",
        "Model outputs are preliminary statistical risk estimations and do not constitute drinking water clearance or regulatory compliance certificates under WHO, BIS, US EPA, or EU Directives.",
        "Temperature fluctuations, probe drift, or improper sampling containers can introduce measurement bias into field readings.",
    ]

    return WaterSampleAnalysis(
        id=analysis_id,
        created_at=created_at_str,
        label=clean_label,
        location=clean_loc,
        inputs=inputs,
        completeness=completeness,
        ml=ml_result,
        shap=shap_result,
        standards=standards_result,
        explanation=ScreeningExplanation(text=explanation_text, source="template"),
        recommendations=recommendations,
        limitations=limitations,
        saved=False,
    )

