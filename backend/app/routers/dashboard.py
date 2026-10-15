"""
AquaGuard AI — Dashboard Router
Provides aggregate watershed-level screening metrics, band distributions, and parameter averages.
"""

from typing import Optional
from fastapi import APIRouter, Header
from ..schemas.water import DashboardSummary
from ..database import get_dashboard_summary_for_session

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(x_session_id: Optional[str] = Header(None)):
    session_id = x_session_id or "default-anonymous-session"
    return get_dashboard_summary_for_session(session_id)

