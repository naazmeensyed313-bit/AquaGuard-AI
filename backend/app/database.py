"""
AquaGuard AI — Storage & Database Layer
Stores water sample analyses using SQLite, scoped by anonymous session id (X-Session-Id).
Initializes with standard seed analyses for immediate evaluation and dashboard metrics.
"""

import sqlite3
import json
import os
from typing import List, Optional, Tuple, Dict, Any
from .schemas.water import (
    WaterSampleAnalysis,
    WaterParameters,
    DashboardSummary,
    ScoreDistributionBucket,
    ParameterAverage,
)
from .services.analysis_service import analyze_water_sample

DB_PATH = os.path.join(os.path.dirname(__file__), "aquaguard.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                created_at TEXT,
                label TEXT,
                location TEXT,
                score REAL,
                band TEXT,
                saved INTEGER DEFAULT 0,
                data_json TEXT
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_session ON analyses(session_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_created_at ON analyses(created_at)")

def seed_initial_records(session_id: str):
    """Seeds standard initial benchmark records if session has no records."""
    seeds = [
        {
            "id": f"seed-ward-12-{session_id[:6]}",
            "label": "Community tank – Ward 12",
            "location": "Station G-04",
            "inputs": WaterParameters(
                ph=8.9, turbidity=5.4, solids=742.0, conductivity=1180.0,
                hardness=186.0, chloramines=3.9, organic_carbon=14.2, sulfate=None, trihalomethanes=None
            ),
        },
        {
            "id": f"seed-highland-{session_id[:6]}",
            "label": "Highland Spring Inlet",
            "location": "Ridge Valley Station",
            "inputs": WaterParameters(
                ph=6.8, turbidity=1.4, solids=190.0, conductivity=320.0,
                hardness=140.0, chloramines=1.8, organic_carbon=3.2, sulfate=180.0, trihalomethanes=28.0
            ),
        },
        {
            "id": f"seed-industrial-{session_id[:6]}",
            "label": "Industrial Canal Effluent",
            "location": "Discharge Point B",
            "inputs": WaterParameters(
                ph=5.1, turbidity=8.6, solids=1150.0, conductivity=1840.0,
                hardness=420.0, chloramines=5.6, organic_carbon=22.1, sulfate=580.0, trihalomethanes=105.0
            ),
        },
        {
            "id": f"seed-borewell-{session_id[:6]}",
            "label": "Rural Borewell 2A",
            "location": "North Irrigation Zone",
            "inputs": WaterParameters(
                ph=8.2, turbidity=3.4, solids=490.0, conductivity=750.0,
                hardness=290.0, chloramines=2.8, organic_carbon=7.9, sulfate=310.0, trihalomethanes=55.0
            ),
        },
    ]

    for s in seeds:
        analysis = analyze_water_sample(
            inputs=s["inputs"],
            label=s["label"],
            location=s["location"],
            sample_id=s["id"],
        )
        save_analysis_record(session_id, analysis)

def save_analysis_record(session_id: str, analysis: WaterSampleAnalysis):
    init_db()
    data_dict = analysis.model_dump()
    with get_connection() as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO analyses (id, session_id, created_at, label, location, score, band, saved, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                analysis.id,
                session_id,
                analysis.created_at,
                analysis.label,
                analysis.location,
                analysis.ml.score,
                analysis.ml.band,
                1 if analysis.saved else 0,
                json.dumps(data_dict),
            ),
        )

def get_analyses_for_session(
    session_id: str,
    query: Optional[str] = None,
    band: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10,
) -> Tuple[List[WaterSampleAnalysis], int]:
    init_db()
    with get_connection() as conn:
        count_cur = conn.execute("SELECT COUNT(*) as count FROM analyses WHERE session_id = ?", (session_id,))
        if count_cur.fetchone()["count"] == 0:
            seed_initial_records(session_id)

        sql = "SELECT data_json, saved FROM analyses WHERE session_id = ?"
        params: List[Any] = [session_id]

        if query and query.strip():
            sql += " AND (label LIKE ? OR location LIKE ?)"
            q_like = f"%{query.strip()}%"
            params.extend([q_like, q_like])

        if band and band.strip():
            sql += " AND band = ?"
            params.append(band.strip())

        order_col = "score" if sort_by == "score" else "label" if sort_by == "label" else "created_at"
        order_dir = "ASC" if sort_order.lower() == "asc" else "DESC"
        sql += f" ORDER BY {order_col} {order_dir}"

        cur = conn.execute(sql, params)
        all_rows = cur.fetchall()
        total = len(all_rows)

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paged_rows = all_rows[start_idx:end_idx]

        items = []
        for r in paged_rows:
            d = json.loads(r["data_json"])
            d["saved"] = bool(r["saved"])
            items.append(WaterSampleAnalysis(**d))

        return items, total

def get_analysis_by_id(session_id: str, analysis_id: str) -> Optional[WaterSampleAnalysis]:
    init_db()
    with get_connection() as conn:
        cur = conn.execute(
            "SELECT data_json, saved FROM analyses WHERE (session_id = ? OR session_id IS NULL) AND id = ?",
            (session_id, analysis_id),
        )
        row = cur.fetchone()
        if not row:
            # Fallback search across all sessions for link-sharing
            cur = conn.execute("SELECT data_json, saved FROM analyses WHERE id = ?", (analysis_id,))
            row = cur.fetchone()
        if row:
            d = json.loads(row["data_json"])
            d["saved"] = bool(row["saved"])
            return WaterSampleAnalysis(**d)
        return None

def delete_analysis_by_id(session_id: str, analysis_id: str) -> bool:
    init_db()
    with get_connection() as conn:
        cur = conn.execute(
            "DELETE FROM analyses WHERE session_id = ? AND id = ?",
            (session_id, analysis_id),
        )
        return cur.rowcount > 0

def toggle_saved_status(session_id: str, analysis_id: str) -> Optional[WaterSampleAnalysis]:
    init_db()
    analysis = get_analysis_by_id(session_id, analysis_id)
    if not analysis:
        return None
    new_saved = not bool(analysis.saved)
    analysis.saved = new_saved
    save_analysis_record(session_id, analysis)
    return analysis

def get_dashboard_summary_for_session(session_id: str) -> DashboardSummary:
    init_db()
    items, total = get_analyses_for_session(session_id, page=1, page_size=100)

    lower_count = sum(1 for a in items if a.ml.band == "Lower Concern")
    inconclusive_count = sum(1 for a in items if a.ml.band == "Inconclusive — lab testing recommended")
    elevated_count = sum(1 for a in items if a.ml.band == "Elevated Concern")

    avg_comp = int(round(sum(a.completeness.percent for a in items) / len(items))) if items else 0

    buckets = [
        {"range": "0.00 – 0.20", "count": sum(1 for a in items if a.ml.score <= 0.20)},
        {"range": "0.21 – 0.40", "count": sum(1 for a in items if 0.20 < a.ml.score <= 0.40)},
        {"range": "0.41 – 0.60", "count": sum(1 for a in items if 0.40 < a.ml.score <= 0.60)},
        {"range": "0.61 – 0.80", "count": sum(1 for a in items if 0.60 < a.ml.score <= 0.80)},
        {"range": "0.81 – 1.00", "count": sum(1 for a in items if a.ml.score > 0.80)},
    ]

    from .services.standards_service import PARAMETERS_STANDARDS_CONFIG
    param_averages = []
    for cfg in PARAMETERS_STANDARDS_CONFIG:
        k = cfg["key"]
        vals = [getattr(a.inputs, k) for a in items if getattr(a.inputs, k) is not None]
        avg_val = round(sum(vals) / len(vals), 1) if vals else 0.0
        param_averages.append(
            ParameterAverage(parameter=cfg["fullName"], average=avg_val, unit=cfg["unit"])
        )

    return DashboardSummary(
        totalAnalyses=total,
        lowerConcernCount=lower_count,
        inconclusiveCount=inconclusive_count,
        elevatedConcernCount=elevated_count,
        averageCompleteness=avg_comp,
        recentAnalyses=items[:5],
        scoreDistribution=[ScoreDistributionBucket(**b) for b in buckets],
        parameterAverages=param_averages,
    )

init_db()

