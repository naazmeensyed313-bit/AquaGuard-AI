"""
AquaGuard AI — Analyses Router
Endpoints for creating, listing, viewing, deleting, and saving water sample analyses.
"""

from typing import Optional
import math
from fastapi import APIRouter, Header, HTTPException, Query, status

from ..schemas.water import (
    AnalyzeRequest,
    WaterSampleAnalysis,
    AnalysesListResponse,
    WaterParameters,
)
from ..services.analysis_service import analyze_water_sample
from ..database import (
    save_analysis_record,
    get_analyses_for_session,
    get_analysis_by_id,
    delete_analysis_by_id,
    toggle_saved_status,
)

router = APIRouter(tags=["analyses"])

def extract_session_id(x_session_id: Optional[str] = Header(None)) -> str:
    return x_session_id or "default-anonymous-session"

@router.post("/analyze", response_model=WaterSampleAnalysis, status_code=status.HTTP_201_CREATED)
def create_analysis(
    payload: AnalyzeRequest,
    x_session_id: Optional[str] = Header(None),
):
    session_id = extract_session_id(x_session_id)
    inputs = WaterParameters(
        ph=payload.ph,
        turbidity=payload.turbidity,
        solids=payload.solids,
        conductivity=payload.conductivity,
        hardness=payload.hardness,
        chloramines=payload.chloramines,
        organic_carbon=payload.organic_carbon,
        sulfate=payload.sulfate,
        trihalomethanes=payload.trihalomethanes,
    )

    analysis = analyze_water_sample(
        inputs=inputs,
        label=payload.label,
        location=payload.location,
        collected_at=payload.collected_at,
        standard=payload.standard or "BIS IS 10500",
    )

    save_analysis_record(session_id, analysis)
    return analysis

@router.get("/analyses", response_model=AnalysesListResponse)
def list_analyses(
    query: Optional[str] = Query(None),
    band: Optional[str] = Query(None),
    sortBy: str = Query("created_at"),
    sortOrder: str = Query("desc"),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    x_session_id: Optional[str] = Header(None),
):
    session_id = extract_session_id(x_session_id)
    items, total = get_analyses_for_session(
        session_id=session_id,
        query=query,
        band=band,
        sort_by=sortBy,
        sort_order=sortOrder,
        page=page,
        page_size=pageSize,
    )

    total_pages = max(1, math.ceil(total / pageSize))

    return AnalysesListResponse(
        items=items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=total_pages,
    )

@router.get("/analyses/{id}", response_model=WaterSampleAnalysis)
def get_single_analysis(
    id: str,
    x_session_id: Optional[str] = Header(None),
):
    session_id = extract_session_id(x_session_id)
    analysis = get_analysis_by_id(session_id, id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Water sample analysis '{id}' not found.")
    return analysis

@router.delete("/analyses/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_single_analysis(
    id: str,
    x_session_id: Optional[str] = Header(None),
):
    session_id = extract_session_id(x_session_id)
    success = delete_analysis_by_id(session_id, id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Water sample analysis '{id}' not found.")
    return None

@router.post("/analyses/{id}/save", response_model=WaterSampleAnalysis)
def toggle_save_analysis(
    id: str,
    x_session_id: Optional[str] = Header(None),
):
    session_id = extract_session_id(x_session_id)
    analysis = toggle_saved_status(session_id, id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Water sample analysis '{id}' not found.")
    return analysis

