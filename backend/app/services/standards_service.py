"""
AquaGuard AI — Regulatory Standards Evaluation Service
Evaluates the 9 physicochemical water quality parameters against:
1. Bureau of Indian Standards (BIS IS 10500)
2. World Health Organization (WHO Guidelines)
"""

from typing import Dict, Any, Optional
from ..schemas.water import (
    WaterParameters,
    RegulatoryStandard,
    StandardsResult,
    StandardItem,
    StandardStatus,
    StandardsSummaryCounts,
)

# Reference definitions for the 9 physicochemical parameters
PARAMETERS_STANDARDS_CONFIG = [
    {
        "key": "ph",
        "fullName": "pH (Potential of Hydrogen)",
        "unit": "pH",
        "standardBIS": {"min": 6.5, "max": 8.5, "label": "Standard: 6.5 – 8.5", "hasFormalStandard": True},
        "standardWHO": {"min": 6.5, "max": 8.5, "label": "Standard: 6.5 – 8.5", "hasFormalStandard": True},
    },
    {
        "key": "turbidity",
        "fullName": "Turbidity",
        "unit": "NTU",
        "standardBIS": {"min": 1.0, "max": 5.0, "label": "Standard: 1.0 – 5.0 NTU", "hasFormalStandard": True},
        "standardWHO": {"min": 0.0, "max": 4.0, "label": "Standard: < 4.0 NTU", "hasFormalStandard": True},
    },
    {
        "key": "solids",
        "fullName": "Solids / TDS",
        "unit": "mg/L",
        "standardBIS": {"max": 500.0, "label": "Standard limit: 500 mg/L", "hasFormalStandard": True},
        "standardWHO": {"max": 600.0, "label": "Standard guideline: < 600 mg/L", "hasFormalStandard": True},
    },
    {
        "key": "conductivity",
        "fullName": "Conductivity",
        "unit": "µS/cm",
        "standardBIS": {"label": "Informational baseline", "hasFormalStandard": False},
        "standardWHO": {"label": "Informational baseline", "hasFormalStandard": False},
    },
    {
        "key": "hardness",
        "fullName": "Hardness",
        "unit": "mg/L",
        "standardBIS": {"min": 200.0, "max": 300.0, "label": "Standard: 200 – 300 mg/L", "hasFormalStandard": True},
        "standardWHO": {"min": 100.0, "max": 300.0, "label": "Aesthetic benchmark: 100 – 300 mg/L", "hasFormalStandard": False},
    },
    {
        "key": "chloramines",
        "fullName": "Chloramines",
        "unit": "mg/L",
        "standardBIS": {"max": 4.0, "label": "Standard max: 4.0 mg/L", "hasFormalStandard": True},
        "standardWHO": {"max": 3.0, "label": "Standard guideline: < 3.0 mg/L", "hasFormalStandard": True},
    },
    {
        "key": "organic_carbon",
        "fullName": "Organic Carbon (TOC)",
        "unit": "mg/L",
        "standardBIS": {"label": "Informational baseline", "hasFormalStandard": False},
        "standardWHO": {"label": "Informational baseline", "hasFormalStandard": False},
    },
    {
        "key": "sulfate",
        "fullName": "Sulfate (SO₄²⁻)",
        "unit": "mg/L",
        "standardBIS": {"min": 200.0, "max": 400.0, "label": "Standard: 200 – 400 mg/L", "hasFormalStandard": True},
        "standardWHO": {"max": 500.0, "label": "Guideline max: 500 mg/L", "hasFormalStandard": True},
    },
    {
        "key": "trihalomethanes",
        "fullName": "Trihalomethanes",
        "unit": "µg/L",
        "standardBIS": {"max": 80.0, "label": "Standard limit: 80 µg/L", "hasFormalStandard": True},
        "standardWHO": {"max": 100.0, "label": "Guideline sum: < 100 µg/L", "hasFormalStandard": True},
    },
]

def evaluate_standards(
    inputs: WaterParameters, standard: RegulatoryStandard = "BIS IS 10500"
) -> StandardsResult:
    items = []
    above = 0
    within = 0
    below = 0
    unassessed = 0

    inputs_dict = inputs.model_dump()

    for config in PARAMETERS_STANDARDS_CONFIG:
        raw_val = inputs_dict.get(config["key"])
        std_config = (
            config["standardBIS"] if standard == "BIS IS 10500" else config["standardWHO"]
        )

        if raw_val is None:
            items.append(
                StandardItem(
                    parameter=config["fullName"],
                    paramKey=config["key"],
                    value=None,
                    unit=config["unit"],
                    status="Not provided",
                    reference_text=std_config["label"],
                    reference_min=std_config.get("min"),
                    reference_max=std_config.get("max"),
                )
            )
            unassessed += 1
            continue

        val = float(raw_val)

        if not std_config.get("hasFormalStandard", False):
            items.append(
                StandardItem(
                    parameter=config["fullName"],
                    paramKey=config["key"],
                    value=val,
                    unit=config["unit"],
                    status="No formal reference",
                    reference_text="Informational baseline",
                    reference_min=std_config.get("min"),
                    reference_max=std_config.get("max"),
                )
            )
            unassessed += 1
            continue

        status: StandardStatus = "Within range"
        ref_min = std_config.get("min")
        ref_max = std_config.get("max")

        if ref_min is not None and val < ref_min:
            status = "Below range"
            below += 1
        elif ref_max is not None and val > ref_max:
            status = "Above range"
            above += 1
        else:
            status = "Within range"
            within += 1

        items.append(
            StandardItem(
                parameter=config["fullName"],
                paramKey=config["key"],
                value=val,
                unit=config["unit"],
                status=status,
                reference_text=std_config["label"],
                reference_min=ref_min,
                reference_max=ref_max,
            )
        )

    return StandardsResult(
        standard=standard,
        items=items,
        summary_counts=StandardsSummaryCounts(
            above=above, within=within, below=below, unassessed=unassessed
        ),
    )

