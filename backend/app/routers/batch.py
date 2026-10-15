"""
AquaGuard AI — Batch Telemetry Router
Endpoints for batch row validation and batch model screening.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Header, status
from pydantic import BaseModel

from ..schemas.water import (
    BatchRowInput,
    BatchValidationResponse,
    BatchValidationError,
    WaterSampleAnalysis,
    WaterParameters,
)
from ..services.analysis_service import analyze_water_sample
from ..database import save_analysis_record

router = APIRouter(prefix="/batch", tags=["batch"])

class ValidateBatchPayload(BaseModel):
    rows: List[Dict[str, Any]]

class AnalyzeBatchPayload(BaseModel):
    rows: List[BatchRowInput]

def validate_row_item(row_dict: Dict[str, Any], row_idx: int) -> BatchRowInput:
    errors = []
    row_number = int(row_dict.get("rowNumber", row_idx))
    label = str(row_dict.get("label") or f"Sample #{row_number}").strip()
    location = str(row_dict.get("location") or "Unspecified station").strip()

    parsed_params: Dict[str, Optional[float]] = {}
    provided_count = 0

    param_keys = [
        "ph", "turbidity", "solids", "conductivity", "hardness",
        "chloramines", "organic_carbon", "sulfate", "trihalomethanes"
    ]

    for k in param_keys:
        raw_val = row_dict.get(k)
        if raw_val is not None and str(raw_val).strip() != "":
            try:
                num = float(raw_val)
                if k == "ph" and (num < 0.0 or num > 14.0):
                    errors.append(f"pH must be between 0.0 and 14.0 (found {num})")
                elif num < 0:
                    errors.append(f"{k} cannot be negative (found {num})")
                else:
                    parsed_params[k] = num
                    provided_count += 1
            except (ValueError, TypeError):
                errors.append(f"{k}: not a valid number ('{raw_val}')")
        else:
            parsed_params[k] = None

    if provided_count == 0:
        errors.append("No valid parameter measurements found in row.")

    is_valid = len(errors) == 0

    return BatchRowInput(
        rowNumber=row_number,
        label=label,
        location=location,
        ph=parsed_params.get("ph"),
        turbidity=parsed_params.get("turbidity"),
        solids=parsed_params.get("solids"),
        conductivity=parsed_params.get("conductivity"),
        hardness=parsed_params.get("hardness"),
        chloramines=parsed_params.get("chloramines"),
        organic_carbon=parsed_params.get("organic_carbon"),
        sulfate=parsed_params.get("sulfate"),
        trihalomethanes=parsed_params.get("trihalomethanes"),
        validationErrors=errors if errors else None,
        isValid=is_valid,
    )

@router.post("/validate", response_model=BatchValidationResponse)
def validate_batch_rows(payload: ValidateBatchPayload):
    valid_rows = []
    invalid_rows = []
    errors_summary = []

    for idx, r in enumerate(payload.rows, start=1):
        validated = validate_row_item(r, idx)
        if validated.isValid:
            valid_rows.append(validated)
        else:
            invalid_rows.append(validated)
            if validated.validationErrors:
                for err in validated.validationErrors:
                    errors_summary.append(
                        BatchValidationError(row=validated.rowNumber, field="Telemetry", message=err)
                    )

    return BatchValidationResponse(
        validRows=valid_rows,
        invalidRows=invalid_rows,
        totalRows=len(payload.rows),
        errorsSummary=errors_summary,
    )

@router.post("/analyze", response_model=List[WaterSampleAnalysis])
def analyze_batch_rows(
    payload: AnalyzeBatchPayload,
    x_session_id: Optional[str] = Header(None),
):
    session_id = x_session_id or "default-anonymous-session"
    results = []

    for row in payload.rows:
        inputs = WaterParameters(
            ph=float(row.ph) if row.ph is not None else None,
            turbidity=float(row.turbidity) if row.turbidity is not None else None,
            solids=float(row.solids) if row.solids is not None else None,
            conductivity=float(row.conductivity) if row.conductivity is not None else None,
            hardness=float(row.hardness) if row.hardness is not None else None,
            chloramines=float(row.chloramines) if row.chloramines is not None else None,
            organic_carbon=float(row.organic_carbon) if row.organic_carbon is not None else None,
            sulfate=float(row.sulfate) if row.sulfate is not None else None,
            trihalomethanes=float(row.trihalomethanes) if row.trihalomethanes is not None else None,
        )

        analysis = analyze_water_sample(
            inputs=inputs,
            label=row.label,
            location=row.location,
        )

        save_analysis_record(session_id, analysis)
        results.append(analysis)

    return results

