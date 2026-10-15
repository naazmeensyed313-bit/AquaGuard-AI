"""
AquaGuard AI — Health Check Router
Provides service uptime and liveness checks for cold-start warmup and monitoring.
"""

import time
from fastapi import APIRouter
from ..schemas.water import HealthResponse

router = APIRouter(tags=["health"])
SERVER_START_TIME = time.time()

@router.get("/health", response_model=HealthResponse)
def get_health():
    uptime = round(time.time() - SERVER_START_TIME, 2)
    return HealthResponse(
        status="ok",
        uptime=uptime,
        version="v2.4",
    )

