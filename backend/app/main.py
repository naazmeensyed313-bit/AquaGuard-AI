"""
AquaGuard AI — Main FastAPI Application
Entry point for the AI-Powered Water Quality Screening & Decision Support System backend.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.analyses import router as analyses_router
from .routers.batch import router as batch_router
from .routers.dashboard import router as dashboard_router
from .routers.model_card import router as model_card_router
from .routers.health import router as health_router
from .database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    init_db()
    # Eagerly load predictor
    try:
        from ml.src.predict import predictor
        _ = predictor.is_loaded
    except Exception as e:
        print(f"Notice: Predictor initialization: {e}")
    yield
    # Shutdown actions

app = FastAPI(
    title="AquaGuard AI Screening API",
    description="Educational decision-support screening and risk stratification API for water quality telemetry.",
    version="2.4.0",
    lifespan=lifespan,
)

# CORS middleware for local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api prefix matching frontend client contract
app.include_router(analyses_router, prefix="/api")
app.include_router(batch_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(model_card_router, prefix="/api")
app.include_router(health_router, prefix="/api")

# Also mount health directly at /health for cloud orchestration probes
app.include_router(health_router)

@app.get("/")
def root():
    return {
        "service": "AquaGuard AI API",
        "status": "online",
        "documentation": "/docs",
        "version": "2.4.0",
    }

