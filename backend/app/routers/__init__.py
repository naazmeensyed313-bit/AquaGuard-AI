from .analyses import router as analyses_router
from .batch import router as batch_router
from .dashboard import router as dashboard_router
from .model_card import router as model_card_router
from .health import router as health_router

__all__ = [
    "analyses_router",
    "batch_router",
    "dashboard_router",
    "model_card_router",
    "health_router",
]

