"""
AquaGuard AI — Pydantic Schemas
Strictly matching frontend TypeScript interfaces and API contract specifications.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

MLRiskBand = Literal[
    "Lower Concern",
    "Inconclusive — lab testing recommended",
    "Elevated Concern",
]

StandardStatus = Literal[
    "Within range",
    "Above range",
    "Below range",
    "No formal reference",
    "Not provided",
]

RegulatoryStandard = Literal["BIS IS 10500", "WHO Guidelines"]

class WaterParameters(BaseModel):
    ph: Optional[float] = None
    turbidity: Optional[float] = None
    solids: Optional[float] = None
    conductivity: Optional[float] = None
    hardness: Optional[float] = None
    chloramines: Optional[float] = None
    organic_carbon: Optional[float] = None
    sulfate: Optional[float] = None
    trihalomethanes: Optional[float] = None

class InputCompleteness(BaseModel):
    provided: int
    total: int = 9
    percent: int
    missing: List[str]
    confidenceTier: Literal["High Confidence", "Moderate Confidence", "Low Confidence"]

class MLThresholds(BaseModel):
    low: float = 0.40
    high: float = 0.60

class MLScreeningResult(BaseModel):
    score: float
    band: MLRiskBand
    classifierBias: Optional[Literal["Neutral Band", "Elevated Bias", "Lower Bias"]] = None
    thresholds: MLThresholds = Field(default_factory=MLThresholds)
    modelVersion: str
    model_version: Optional[str] = None
    calloutText: Optional[str] = None

class ShapContribution(BaseModel):
    parameter: str
    paramKey: str
    value: Optional[float] = None
    unit: str
    contribution: float
    direction: Literal["Lower Concern", "Elevated Concern"]

class ShapResult(BaseModel):
    base_value: float
    contributions: List[ShapContribution]
    final_score: float

class StandardItem(BaseModel):
    parameter: str
    paramKey: str
    value: Optional[float] = None
    unit: str
    status: StandardStatus
    reference_text: str
    reference_min: Optional[float] = None
    reference_max: Optional[float] = None

class StandardsSummaryCounts(BaseModel):
    above: int = 0
    within: int = 0
    below: int = 0
    unassessed: int = 0

class StandardsResult(BaseModel):
    standard: RegulatoryStandard
    items: List[StandardItem]
    summary_counts: StandardsSummaryCounts

class ScreeningExplanation(BaseModel):
    text: str
    source: Literal["template", "llm"] = "template"

class DecisionAction(BaseModel):
    id: str
    title: str
    description: str
    iconName: Literal["flask", "calendar", "checklist", "building"]

class WaterSampleAnalysis(BaseModel):
    id: str
    created_at: str
    label: str
    location: str
    inputs: WaterParameters
    completeness: InputCompleteness
    ml: MLScreeningResult
    shap: ShapResult
    standards: StandardsResult
    explanation: ScreeningExplanation
    recommendations: List[DecisionAction]
    limitations: List[str]
    saved: Optional[bool] = False

class AnalyzeRequest(BaseModel):
    ph: Optional[float] = None
    turbidity: Optional[float] = None
    solids: Optional[float] = None
    conductivity: Optional[float] = None
    hardness: Optional[float] = None
    chloramines: Optional[float] = None
    organic_carbon: Optional[float] = None
    sulfate: Optional[float] = None
    trihalomethanes: Optional[float] = None
    label: Optional[str] = None
    location: Optional[str] = None
    collected_at: Optional[str] = None
    standard: Optional[RegulatoryStandard] = "BIS IS 10500"

class AnalysesListResponse(BaseModel):
    items: List[WaterSampleAnalysis]
    total: int
    page: int
    pageSize: int
    totalPages: int

class ScoreDistributionBucket(BaseModel):
    range: str
    count: int

class ParameterAverage(BaseModel):
    parameter: str
    average: float
    unit: str

class DashboardSummary(BaseModel):
    totalAnalyses: int
    lowerConcernCount: int
    inconclusiveCount: int
    elevatedConcernCount: int
    averageCompleteness: int
    recentAnalyses: List[WaterSampleAnalysis]
    scoreDistribution: List[ScoreDistributionBucket]
    parameterAverages: List[ParameterAverage]

class BatchRowInput(BaseModel):
    rowNumber: int
    label: str
    location: Optional[str] = None
    ph: Optional[Any] = None
    turbidity: Optional[Any] = None
    solids: Optional[Any] = None
    conductivity: Optional[Any] = None
    hardness: Optional[Any] = None
    chloramines: Optional[Any] = None
    organic_carbon: Optional[Any] = None
    sulfate: Optional[Any] = None
    trihalomethanes: Optional[Any] = None
    validationErrors: Optional[List[str]] = None
    isValid: bool

class BatchValidationError(BaseModel):
    row: int
    field: str
    message: str

class BatchValidationResponse(BaseModel):
    validRows: List[BatchRowInput]
    invalidRows: List[BatchRowInput]
    totalRows: int
    errorsSummary: List[BatchValidationError]

class BatchAnalyzeRequest(BaseModel):
    rows: List[BatchRowInput]

class ModelCardMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1Score: float
    rocAuc: float
    brierScore: float

class ModelBenchmarkItem(BaseModel):
    model: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    rocAuc: float

class ConfusionMatrix(BaseModel):
    tp: int
    fp: int
    fn: int
    tn: int

class CurvePoint(BaseModel):
    fpr: Optional[float] = None
    tpr: Optional[float] = None
    recall: Optional[float] = None
    precision: Optional[float] = None
    meanPredicted: Optional[float] = None
    observedFraction: Optional[float] = None

class ModelCardData(BaseModel):
    version: str
    architecture: str
    dataset: str
    calibrated: bool
    metrics: ModelCardMetrics
    modelsBenchmark: List[ModelBenchmarkItem]
    confusionMatrix: ConfusionMatrix
    rocCurve: List[Dict[str, float]]
    prCurve: List[Dict[str, float]]
    calibrationCurve: List[Dict[str, float]]

class HealthResponse(BaseModel):
    status: str
    uptime: float
    version: str

