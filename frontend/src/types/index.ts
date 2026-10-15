/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MLRiskBand =
  | 'Lower Concern'
  | 'Inconclusive — lab testing recommended'
  | 'Elevated Concern';

export type StandardStatus =
  | 'Within range'
  | 'Above range'
  | 'Below range'
  | 'No formal reference'
  | 'Not provided';

export type RegulatoryStandard = 'BIS IS 10500' | 'WHO Guidelines';

export interface WaterParameters {
  ph?: number | null;
  turbidity?: number | null;
  solids?: number | null;
  conductivity?: number | null;
  hardness?: number | null;
  chloramines?: number | null;
  organic_carbon?: number | null;
  sulfate?: number | null;
  trihalomethanes?: number | null;
}

export interface InputCompleteness {
  provided: number;
  total: number;
  percent: number;
  missing: string[];
  confidenceTier: 'High Confidence' | 'Moderate Confidence' | 'Low Confidence';
}

export interface MLScreeningResult {
  score: number; // 0.00 to 1.00
  band: MLRiskBand;
  classifierBias?: 'Neutral Band' | 'Elevated Bias' | 'Lower Bias';
  thresholds: {
    low: number; // 0.40
    high: number; // 0.60
  };
  modelVersion: string; // e.g. "v2.4 - Calibrated"
  model_version?: string; // API contract format
  calloutText?: string;
}

export interface ShapContribution {
  parameter: string;
  paramKey: keyof WaterParameters;
  value: number | null;
  unit: string;
  contribution: number; // positive = toward Lower Concern (green), negative = toward Elevated Concern (red)
  direction: 'Lower Concern' | 'Elevated Concern';
}

export interface ShapResult {
  base_value: number; // e.g. 0.39
  contributions: ShapContribution[];
  final_score: number; // e.g. 0.47
}

export interface StandardItem {
  parameter: string;
  paramKey: keyof WaterParameters;
  value: number | null;
  unit: string;
  status: StandardStatus;
  reference_text: string; // e.g. "Standard: 6.5 – 8.5" or "Informational baseline"
  reference_min?: number;
  reference_max?: number;
}

export interface StandardsResult {
  standard: RegulatoryStandard;
  items: StandardItem[];
  summary_counts: {
    above: number;
    within: number;
    below: number;
    unassessed: number;
  };
}

export interface ScreeningExplanation {
  text: string;
  source: 'template' | 'llm';
}

// Backward-compatibility alias
export type DiagnosticExplanation = ScreeningExplanation;

export interface DecisionAction {
  id: string;
  title: string;
  description: string;
  iconName: 'flask' | 'calendar' | 'checklist' | 'building';
}

export interface WaterSampleAnalysis {
  id: string;
  created_at: string;
  label: string;
  location: string;
  inputs: WaterParameters;
  completeness: InputCompleteness;
  ml: MLScreeningResult;
  shap: ShapResult;
  standards: StandardsResult;
  explanation: ScreeningExplanation;
  recommendations: DecisionAction[];
  limitations: string[];
  saved?: boolean;
}

export interface AnalysesFilterParams {
  query?: string;
  band?: string;
  sortBy?: 'created_at' | 'score' | 'label';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AnalysesListResponse {
  items: WaterSampleAnalysis[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalAnalyses: number;
  lowerConcernCount: number;
  inconclusiveCount: number;
  elevatedConcernCount: number;
  averageCompleteness: number;
  recentAnalyses: WaterSampleAnalysis[];
  scoreDistribution: { range: string; count: number }[];
  parameterAverages: { parameter: string; average: number; unit: string }[];
}

export interface BatchRowInput {
  rowNumber: number;
  label: string;
  location?: string;
  ph?: string | number;
  turbidity?: string | number;
  solids?: string | number;
  conductivity?: string | number;
  hardness?: string | number;
  chloramines?: string | number;
  organic_carbon?: string | number;
  sulfate?: string | number;
  trihalomethanes?: string | number;
  validationErrors?: string[];
  isValid: boolean;
}

export interface BatchValidationResponse {
  validRows: BatchRowInput[];
  invalidRows: BatchRowInput[];
  totalRows: number;
  errorsSummary: { row: number; field: string; message: string }[];
}

export interface ModelCardData {
  version: string;
  architecture: string;
  dataset: string;
  calibrated: boolean;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    brierScore: number;
  };
  modelsBenchmark: {
    model: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
  }[];
  confusionMatrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  rocCurve: { fpr: number; tpr: number }[];
  prCurve: { recall: number; precision: number }[];
  calibrationCurve: { meanPredicted: number; observedFraction: number }[];
}
